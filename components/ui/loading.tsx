import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type LoadingProps = {
  /** Custom CSS classes to apply to the container */
  className?: string;
  /** Size of the loading spinner in pixels */
  size?: 'sm' | 'md' | 'lg';
  /** Text to display below the spinner */
  text?: string;
  /** Full screen height loading state */
  fullScreen?: boolean;
  /** Custom color for the spinner */
  variant?: 'default' | 'primary' | 'secondary';
};

const sizeMap = {
  sm: 'size-4',
  md: 'size-8',
  lg: 'size-12',
};

const variantMap = {
  default: 'text-muted-foreground',
  primary: 'text-primary',
  secondary: 'text-secondary',
};

export function Loading({
  className,
  size = 'md',
  text,
  fullScreen = false,
  variant = 'primary',
}: LoadingProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center',
        fullScreen ? 'min-h-[50vh]' : 'p-4',
        className
      )}
    >
      <Loader2
        className={cn('animate-spin', sizeMap[size], variantMap[variant])}
      />
      {text && <p className='mt-2 text-sm text-muted-foreground'>{text}</p>}
    </div>
  );
}
