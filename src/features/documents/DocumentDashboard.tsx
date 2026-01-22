'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { documentService } from '@/features/documents/documents.service';
import { sessionService } from '@/features/session/session.service';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

export function DocumentDashboard() {
  const router = useRouter();
  const setSessionId = useAppStore(state => state.setSessionId);
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);

  const { data: documents, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['documents'],
    queryFn: documentService.getAll,
    retry: 1, // Don't retry endlessly if the backend is down
  });

  const createSessionMutation = useMutation({
    mutationFn: sessionService.create,
    onSuccess: (data) => {
      setSessionId(data.session_id);
      router.push(`/chat/${data.session_id}`);
    },
  });

  const toggleDoc = (id: string) => {
    setSelectedDocs(prev => 
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  };

  const handleStart = () => {
    if (selectedDocs.length > 0) {
      createSessionMutation.mutate(selectedDocs);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-950 p-8 flex flex-col max-w-5xl mx-auto">
      <header className="mb-12 mt-8 animate-fade-in">
        <h1 className="text-5xl font-light tracking-tight text-gradient-red mb-4">
          Redefinance
        </h1>
        <p className="text-neutral-400 text-lg font-light">Select documents to begin intelligent analysis.</p>
      </header>

      {isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center text-neutral-500 gap-4">
          <div className="w-16 h-16 rounded-full border-2 border-red-900/30 border-t-red-500 animate-spin glow-red" />
          <p className="text-lg font-light animate-pulse">Loading Library...</p>
        </div>
      ) : isError ? (
         <div className="flex-1 flex flex-col items-center justify-center text-red-400 gap-4">
            <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl max-w-md text-center">
               <h3 className="text-xl font-medium mb-2">Connection Failed</h3>
               <p className="text-sm text-red-300/80 mb-6">
                 {(error as Error)?.message || "Could not connect to the backend API."}
               </p>
               <Button onClick={() => refetch()} variant="secondary" className="bg-red-500/10 hover:bg-red-500/20 text-red-200 border-red-500/20">
                 Retry Connection
               </Button>
            </div>
         </div>
      ) : documents?.length === 0 ? (
         <div className="flex-1 flex flex-col items-center justify-center text-neutral-500 gap-4">
            <FileText className="w-16 h-16 opacity-20" />
            <p className="text-lg font-light">No documents found in the library.</p>
             <Button onClick={() => refetch()} variant="ghost" size="sm">
                 Refresh List
             </Button>
         </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-32">
          {documents?.map(doc => (
            <Card 
              key={doc.document_id}
              onClick={() => toggleDoc(doc.document_id)}
              className={cn(
                "cursor-pointer relative group min-h-[160px] flex flex-col justify-between transition-all duration-350",
                selectedDocs.includes(doc.document_id) 
                  ? "border-red-600 bg-gradient-to-br from-red-950/40 to-red-950/10 shadow-xl shadow-red-950/50 scale-[1.02] glow-red" 
                  : "hover:border-red-800/50 hover:shadow-lg hover:shadow-red-950/30 hover:scale-[1.01]"
              )}
            >
              <div className="flex items-start justify-between w-full">
                <div className={cn(
                  "p-3 rounded-xl transition-all duration-350",
                  selectedDocs.includes(doc.document_id) 
                    ? "bg-gradient-to-br from-red-600 to-red-500 text-white shadow-lg shadow-red-600/50" 
                    : "bg-red-950/30 text-red-400 group-hover:bg-red-900/40 group-hover:text-red-300"
                )}>
                  <FileText className="w-6 h-6" />
                </div>
                {selectedDocs.includes(doc.document_id) && (
                  <div className="animate-in zoom-in duration-300">
                     <div className="bg-white rounded-full p-1"><Check className="w-3 h-3 text-black" /></div>
                  </div>
                )}
              </div>
              <div className="mt-4">
                <h3 className="font-medium text-lg leading-snug text-neutral-200 group-hover:text-white transition-colors">
                  {doc.company_name}
                </h3>
                <p className="text-sm text-neutral-500 mt-1">
                  {doc.fiscal_year} {doc.company_ticker && `• ${doc.company_ticker}`}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Floating Action Button Container */}
      <div className="fixed bottom-10 left-0 right-0 flex justify-center pointer-events-none z-50">
        <div className="pointer-events-auto">
             <Button 
               disabled={selectedDocs.length === 0}
               isLoading={createSessionMutation.isPending}
               onClick={handleStart}
               className={cn(
                 "shadow-2xl transition-all duration-500 transform",
                 selectedDocs.length === 0 ? "translate-y-24 opacity-0 scale-95" : "translate-y-0 opacity-100 scale-100"
               )}
             >
               Start Analysis ({selectedDocs.length})
             </Button>
        </div>
      </div>
    </main>
  );
}
