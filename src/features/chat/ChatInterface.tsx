'use client';

import { useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Message } from './chat.types';
import { ChatInput } from './components/ChatInput';
import { MessageBubble } from './components/MessageBubble';
import { apiClient } from '@/lib/api';
import { parseCitations } from '@/lib/citation-parser';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { usePDFStore } from '@/store/usePDFStore';
import { sessionService } from '@/features/session/session.service';
import { cn } from '@/lib/utils';

// Dynamically import PDFViewer with no SSR to avoid DOMMatrix errors
const PDFViewer = dynamic(
  () => import('@/features/pdf/PDFViewer').then(mod => ({ default: mod.PDFViewer })),
  { ssr: false }
);

export function ChatInterface() {
  const { sessionId } = useParams();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { isOpen: isPDFOpen, resetPDF } = usePDFStore();

  useEffect(() => {
    // Reset PDF state when component unmounts (leaving chat)
    return () => {
      resetPDF();
    };
  }, [resetPDF]);

  useEffect(() => {
    // Auto-scroll on new messages
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleBack = () => {
    resetPDF();
    router.push('/');
  };

  const handleDelete = async () => {
    if (!sessionId) return;
    try {
      await sessionService.delete(sessionId.toString());
    } catch (error) {
      console.error('Failed to delete session:', error);
    } finally {
      resetPDF();
      router.push('/');
    }
  };

  const handleSend = async (text: string) => {
    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };
    
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    // Add thinking placeholder
    const thinkingId = 'thinking-' + Date.now();
    setMessages(prev => [...prev, {
      id: thinkingId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      isThinking: true
    }]);

    try {
      // Simulate/Real API Call
      const response = await apiClient<{ answer: string; sources: string[] }>('/query', {
        method: 'POST',
        body: JSON.stringify({ session_id: sessionId, query: text }),
      });

      console.log('=== API Response ===');
      console.log('Raw answer:', response.answer);
      console.log('Sources:', response.sources);

      const { displayText, citations } = parseCitations(response.answer);
      
      console.log('=== After Citation Parsing ===');
      console.log('Display text:', displayText);
      console.log('Citations found:', citations);
      console.log('Number of citations:', citations.length);

      setMessages(prev => prev.map(m => {
        if (m.id === thinkingId) {
          return {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: displayText,
            citations: citations,
            timestamp: Date.now(),
            isThinking: false
          };
        }
        return m;
      }));

    } catch (error) {
       setMessages(prev => prev.map(m => {
        if (m.id === thinkingId) {
          return {
            ...m,
            content: "I'm sorry, I encountered an error analyzing the documents.",
            isThinking: false
          };
        }
        return m;
      }));
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="flex flex-col h-screen bg-neutral-950">
      {/* Header */}
      <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-gradient-to-r from-neutral-900/80 to-neutral-900/50 backdrop-blur-xl z-10 sticky top-0 shadow-lg">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={handleBack} 
            className="p-2 h-10 w-10 rounded-full hover:bg-white/10"
            aria-label="Back to Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <span className="font-medium text-white tracking-wide">Session</span>
            <span className="text-neutral-500 text-sm ml-2 font-mono">{sessionId?.toString().slice(0,8)}</span>
          </div>
        </div>
        <Button 
            variant="ghost" 
            onClick={handleDelete}
            className="p-2 h-10 w-10 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-full transition-all"
            aria-label="End Session"
        >
          <Trash2 className="w-5 h-5" />
        </Button>
      </header>
      
      {/* Main Content - Split View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Section */}
        <div className={cn(
          "flex flex-col transition-all duration-500",
          isPDFOpen ? "w-1/2" : "w-full"
        )}>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scroll-smooth">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-neutral-500 opacity-50 select-none">
                <p className="text-xl font-light">Ask a question to begin analysis</p>
              </div>
            )}
            {messages.map(msg => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            <div ref={scrollRef} className="h-4" /> 
          </div>

          {/* Input */}
          <div className="p-6 border-t border-white/5 bg-neutral-950 z-10">
             <ChatInput onSend={handleSend} isLoading={isLoading} />
          </div>
        </div>

        {/* PDF Viewer Section */}
        <div className={cn(
          "transition-all duration-500",
          isPDFOpen ? "w-1/2 animate-in slide-in-from-right" : "w-0 overflow-hidden"
        )}>
          {isPDFOpen && <PDFViewer />}
        </div>
      </div>
    </div>
  );
}
