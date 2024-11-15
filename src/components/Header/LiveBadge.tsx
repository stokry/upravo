import { cn } from '@/lib/utils';

interface LiveBadgeProps {
  className?: string;
}

export function LiveBadge({ className }: LiveBadgeProps) {
  return (
    <div className={cn(
      "relative flex items-center space-x-2 bg-gradient-to-r from-brand/10 to-brand/5",
      "px-4 py-1.5 rounded-full group hover:shadow-lg transition-all duration-300",
      className
    )}>
      <div className="absolute -inset-0.5 bg-gradient-to-r from-brand to-brand-light opacity-10 rounded-full blur-sm group-hover:opacity-15 transition-opacity" />
      <div className="relative flex items-center">
        <div className="relative">
          <div className="w-2 h-2 bg-brand rounded-full animate-ping absolute" />
          <div className="w-2 h-2 bg-brand rounded-full relative" />
        </div>
        <span className="relative ml-2 text-sm font-medium text-brand">
          Uživo
        </span>
      </div>
    </div>
  );
}
