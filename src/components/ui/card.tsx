import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl border border-neutral-800 bg-gradient-to-br from-neutral-900/80 to-neutral-900/40 p-6 backdrop-blur-sm transition-all duration-350 hover:border-red-800/50 hover:shadow-lg hover:shadow-red-950/50 soft-shadow",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = 'Card';
