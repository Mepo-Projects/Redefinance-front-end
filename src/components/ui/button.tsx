import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, isLoading, variant = 'primary', size = 'default', disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center rounded-2xl font-medium transition-all duration-350 ease-out focus:outline-none focus:ring-2 focus:ring-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed micro-hover",
          // Variants
          variant === 'primary' && "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg hover:shadow-red-500/50 hover:shadow-xl active:shadow-red-600/60",
          variant === 'secondary' && "bg-red-950/50 text-red-400 hover:bg-red-900/50 border border-red-800/50 hover:border-red-700/70 backdrop-blur-sm",
          variant === 'ghost' && "bg-transparent text-neutral-400 hover:text-red-400 hover:bg-red-950/30",
          // Sizes
          size === 'default' && "px-6 py-3",
          size === 'sm' && "px-3 py-1.5 text-sm",
          size === 'lg' && "px-8 py-4 text-lg",
          size === 'icon' && "h-10 w-10 p-0",
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
