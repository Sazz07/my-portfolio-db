import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type EmptyStateProps = {
  /** Title text for the empty state */
  title: string;
  /** Optional description text */
  description?: string;
  /** Optional action button configuration */
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  /** Optional image/illustration configuration */
  image?: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  };
  /** Custom CSS classes */
  className?: string;
};

export function EmptyState({
  title,
  description,
  action,
  image,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-8',
        className
      )}
    >
      {image && (
        <div className='mb-6 relative'>
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width || 200}
            height={image.height || 200}
            className='dark:invert'
          />
        </div>
      )}
      <h3 className='text-lg font-medium'>{title}</h3>
      {description && (
        <p className='mt-2 text-sm text-muted-foreground'>{description}</p>
      )}
      {action && (
        <Button variant='outline' className='mt-4' onClick={action.onClick}>
          {action.icon && <span className='mr-2'>{action.icon}</span>}
          {action.label}
        </Button>
      )}
    </div>
  );
}
