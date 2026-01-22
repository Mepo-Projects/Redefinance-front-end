import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSend: (text: string) => void;
  isLoading: boolean;
}

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (value.trim() && !isLoading) {
      onSend(value);
      setValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'inherit';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 200)}px`;
    }
  }, [value]);

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-4xl mx-auto">
      <div className={cn(
        "relative flex items-end gap-2 p-2 rounded-3xl bg-gradient-to-br from-neutral-900/90 to-neutral-900/70 border backdrop-blur-xl shadow-2xl ring-1 transition-all duration-350",
        value.trim() 
          ? "border-red-800/50 ring-red-950/30 shadow-red-950/20" 
          : "border-neutral-800/50 ring-neutral-900/20"
      )}>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about the document..."
          className="w-full bg-transparent border-0 text-white placeholder:text-neutral-500 focus:ring-0 resize-none py-3 px-4 min-h-[52px] max-h-[200px] leading-relaxed focus:outline-none"
          rows={1}
          disabled={isLoading}
        />
        <div className="pb-1 pr-1">
          <Button 
            type="submit"
            size="icon"
            disabled={!value.trim() || isLoading}
            className={cn(
              "h-10 w-10 rounded-full transition-all duration-350",
              !value.trim() && "opacity-50"
            )}
          >
            {isLoading ? (
              <span className="animate-spin">⟳</span>
            ) : (
              <Send className="w-4 h-4 ml-0.5" />
            )}
          </Button>
        </div>
      </div>
      {isLoading && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 animate-fade-in">
             <div className="px-4 py-1.5 rounded-full bg-red-950/50 border border-red-900/30 backdrop-blur text-xs text-red-300 flex items-center gap-2 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                Processing request...
             </div>
        </div>
      )}
    </form>
  );
}
