import { Message } from '../chat.types';
import { cn } from '@/lib/utils';
import { User, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { usePDFStore } from '@/store/usePDFStore';
import { extractDocumentFromCitation, getPDFPath } from '@/lib/pdf-utils';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const { openPDF, documentId, navigateToPage } = usePDFStore();
  
  const handleCitationClick = (citation: any) => {
    console.log('=== Citation Clicked ===');
    console.log('Citation object:', citation);
    console.log('Citation text:', citation.text);
    
    const docId = citation.sourceId;
    const pageNumber = citation.pageNumber;
    
    console.log('Using pre-parsed docId:', docId);
    console.log('Using pre-parsed pageNumber:', pageNumber);
    
    if (docId && pageNumber) {
      const pdfPath = getPDFPath(docId);
      console.log('PDF path:', pdfPath);
      
      if (pdfPath) {
        console.log('Opening PDF - Current doc:', documentId, 'New doc:', docId);
        
        // If same document, just navigate to page
        if (documentId === docId) {
          console.log('Same document - navigating to page', pageNumber);
          navigateToPage(pageNumber);
        } else {
          // Otherwise, open new document at that page
          console.log('New document - opening at page', pageNumber);
          openPDF(docId, pageNumber);
        }
      } else {
        console.warn('No PDF path found for document:', docId);
      }
    } else {
      console.warn('Could not extract docId or pageNumber from citation');
    }
  };
  
  const renderContent = () => {
    if (message.isThinking) {
      return (
        <div className="flex items-center space-x-3 text-neutral-400">
          <span className="relative w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
          <span className="text-sm font-medium skeleton-red">Analyzing document structure...</span>
        </div>
      );
    }

    // Split by citation markers
    const parts = message.content.split(/(\[\[CITATION:[a-zA-Z0-9]+\]\])/);

    return (
      <div className="prose prose-invert max-w-none">
        {parts.map((part, i) => {
          if (part.startsWith('[[CITATION:')) {
            const id = part.replace('[[CITATION:', '').replace(']]', '');
            const citation = message.citations?.find(c => c.id === id);
            if (citation) {
              return (
                <button 
                  key={i}
                  onClick={() => handleCitationClick(citation)}
                  className="mx-1 inline-flex items-center px-2 py-0.5 rounded-full bg-red-950/40 border border-red-800/50 text-xs font-medium text-red-300 hover:bg-red-900/50 hover:border-red-700 glow-red-hover transition-all cursor-pointer align-middle"
                  title={citation.text}
                >
                  {citation.pageNumber 
                    ? `${citation.sourceId.length > 30 ? citation.sourceId.substring(0, 30) + '...' : citation.sourceId}, p.${citation.pageNumber}`
                    : 'Ref'}
                </button>
              );
            }
          }
          return <ReactMarkdown key={i} remarkPlugins={[remarkGfm]} components={markdownComponents}>{part}</ReactMarkdown>;
        })}
      </div>
    );
  };

  return (
    <div className={cn(
      "flex w-full mb-8 animate-in",
      isUser ? "justify-end" : "justify-start"
    )}>
      {!isUser && (
        <div className="mr-4 mt-1 flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-900/40 to-red-950/20 flex items-center justify-center border border-red-800/30 shadow-lg shadow-red-950/50 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-red-400" />
          </div>
        </div>
      )}

      <div className={cn(
        "max-w-[80%] rounded-2xl px-6 py-4 relative transition-all duration-350",
        isUser 
          ? "bg-gradient-to-br from-neutral-800/90 to-neutral-900/80 text-white rounded-br-sm border border-neutral-700/50 shadow-xl backdrop-blur-sm" 
          : "bg-gradient-to-br from-red-950/10 to-transparent text-neutral-200 pl-0 pt-0 backdrop-blur-sm"
      )}>
        {renderContent()}
      </div>

      {isUser && (
         <div className="ml-4 mt-1 flex-shrink-0">
           <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neutral-700/80 to-neutral-900/60 flex items-center justify-center border border-neutral-600/50 shadow-lg backdrop-blur-sm">
             <User className="w-4 h-4 text-neutral-300" />
           </div>
         </div>
      )}
    </div>
  );
}

// Custom markdown components for better styling
const markdownComponents = {
  table: ({ children }: any) => (
    <div className="my-4 overflow-x-auto rounded-xl border border-red-900/30">
      <table className="w-full border-collapse table-auto">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }: any) => (
    <thead className="bg-red-950/30 border-b border-red-900/30">
      {children}
    </thead>
  ),
  tbody: ({ children }: any) => (
    <tbody className="divide-y divide-red-950/20">
      {children}
    </tbody>
  ),
  tr: ({ children }: any) => (
    <tr className="hover:bg-red-950/20 transition-colors duration-350">
      {children}
    </tr>
  ),
  th: ({ children }: any) => (
    <th className="px-4 py-2 text-left text-sm font-semibold text-red-300">
      {children}
    </th>
  ),
  td: ({ children }: any) => (
    <td className="px-4 py-2 text-sm text-neutral-300">
      {children}
    </td>
  ),
  code: ({ inline, children }: any) => 
    inline ? (
      <code className="px-1.5 py-0.5 rounded bg-red-950/30 text-red-300 font-mono text-sm border border-red-900/20">
        {children}
      </code>
    ) : (
      <pre className="my-4 p-4 rounded-xl bg-black/40 border border-red-900/20 overflow-x-auto">
        <code className="text-sm font-mono text-neutral-200">{children}</code>
      </pre>
    ),
  h1: ({ children }: any) => <h1 className="text-2xl font-bold mt-6 mb-3 text-white">{children}</h1>,
  h2: ({ children }: any) => <h2 className="text-xl font-semibold mt-5 mb-2 text-white">{children}</h2>,
  h3: ({ children }: any) => <h3 className="text-lg font-semibold mt-4 mb-2 text-neutral-200">{children}</h3>,
  p: ({ children }: any) => <p className="mb-3 leading-relaxed text-neutral-200">{children}</p>,
  ul: ({ children }: any) => <ul className="list-disc list-inside mb-3 space-y-1 text-neutral-200">{children}</ul>,
  ol: ({ children }: any) => <ol className="list-decimal list-inside mb-3 space-y-1 text-neutral-200">{children}</ol>,
  li: ({ children }: any) => <li className="text-neutral-200">{children}</li>,
  strong: ({ children }: any) => <strong className="font-semibold text-white">{children}</strong>,
};
