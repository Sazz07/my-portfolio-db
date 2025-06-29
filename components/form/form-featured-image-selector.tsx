'use client';

import { useController } from 'react-hook-form';
import Image from 'next/image';
import { Star, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

interface FormFeaturedImageSelectorProps {
  name: string;
  label?: string;
  className?: string;
  existingImages: string[];
  currentFeaturedImage?: string | null;
  disabled?: boolean;
}

export function FormFeaturedImageSelector({
  name,
  label,
  className,
  existingImages,
  currentFeaturedImage,
  disabled = false,
}: FormFeaturedImageSelectorProps) {
  const {
    field: { onChange, value },
    fieldState: { error },
  } = useController({ name });

  const handleSelectFeatured = (imageUrl: string) => {
    onChange(imageUrl);
  };

  if (existingImages.length === 0) {
    return null;
  }

  return (
    <div className={cn('space-y-4', className)}>
      {label && (
        <div className='space-y-2'>
          <Label className='text-base font-medium'>{label}</Label>
          <p className='text-sm text-muted-foreground'>
            Choose the main image that will be displayed prominently for this
            content.
          </p>
        </div>
      )}

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
        {existingImages.map((img, index) => {
          const isFeatured =
            value === img || (!value && currentFeaturedImage === img);

          return (
            <div
              key={`featured-${index}`}
              className={cn(
                'group relative aspect-square cursor-pointer transition-all duration-200 rounded-lg overflow-hidden border-2',
                isFeatured
                  ? 'border-primary shadow-lg scale-105'
                  : 'border-border hover:border-primary/50 hover:shadow-md',
                disabled && 'cursor-not-allowed opacity-60'
              )}
              onClick={() => !disabled && handleSelectFeatured(img)}
            >
              <Image
                src={img}
                alt={`Image ${index + 1}`}
                fill
                className='object-cover transition-transform duration-200 group-hover:scale-105'
              />

              {/* Overlay for better text readability */}
              <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200' />

              {/* Featured indicator */}
              {isFeatured && (
                <div className='absolute top-2 left-2'>
                  <Badge
                    variant='default'
                    className='bg-primary text-primary-foreground'
                  >
                    <Star className='h-3 w-3 mr-1' />
                    Featured
                  </Badge>
                </div>
              )}

              {/* Selection indicator */}
              {isFeatured && (
                <div className='absolute top-2 right-2'>
                  <div className='w-6 h-6 bg-primary rounded-full flex items-center justify-center'>
                    <Check className='h-3 w-3 text-primary-foreground' />
                  </div>
                </div>
              )}

              {/* Image number */}
              <div className='absolute bottom-2 left-2'>
                <Badge variant='secondary' className='text-xs'>
                  {index + 1}
                </Badge>
              </div>

              {/* Select button for non-featured images */}
              {!isFeatured && !disabled && (
                <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
                  <Button
                    type='button'
                    size='sm'
                    variant='default'
                    className='bg-white/90 text-black hover:bg-white shadow-lg'
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectFeatured(img);
                    }}
                  >
                    <Star className='h-3 w-3 mr-1' />
                    Set as Featured
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Status indicator */}
      {value && (
        <div className='flex items-center gap-2 p-3 bg-muted/50 rounded-lg'>
          <Star className='h-4 w-4 text-primary' />
          <span className='text-sm text-muted-foreground'>
            Image {existingImages.indexOf(value) + 1} is set as featured
          </span>
        </div>
      )}

      {error && (
        <p className='text-sm text-destructive flex items-center gap-1'>
          <span>⚠</span>
          {error.message}
        </p>
      )}
    </div>
  );
}
