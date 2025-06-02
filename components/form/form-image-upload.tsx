'use client';

import { useCallback, useState } from 'react';
import { useController } from 'react-hook-form';
import Image from 'next/image';
import { X, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface FormImageUploadProps {
  name: string;
  label?: string;
  className?: string;
  defaultValue?: string | string[];
  disabled?: boolean;
  maxSizeInMB?: number;
  accept?: string;
  required?: boolean;
  multiple?: boolean;
  maxFiles?: number;
  onFileChange?: (file: File | null) => void;
  existingImage?: string;
}

export function FormImageUpload({
  name,
  label,
  className,
  defaultValue,
  disabled = false,
  maxSizeInMB = 5,
  accept = 'image/*',
  required = false,
  multiple = false,
  maxFiles = 5,
  onFileChange,
  existingImage,
}: FormImageUploadProps) {
  // Initialize previews based on defaultValue or existingImage
  const initialPreviews = Array.isArray(defaultValue)
    ? defaultValue
    : defaultValue
    ? [defaultValue]
    : existingImage
    ? [existingImage]
    : [];

  const [previews, setPreviews] = useState<string[]>(initialPreviews);

  const {
    field: { onChange, value },
    fieldState: { error },
  } = useController({ name });

  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      // For multiple files
      if (multiple) {
        // Check if adding new files would exceed the limit
        const currentCount = Array.isArray(value) ? value.length : 0;
        const newFilesCount = files.length;

        if (currentCount + newFilesCount > maxFiles) {
          alert(`You can upload a maximum of ${maxFiles} images`);
          return;
        }

        const newFiles: File[] = [];
        const newPreviews: string[] = [...previews];

        Array.from(files).forEach((file) => {
          // Check file size
          const sizeInMB = file.size / (1024 * 1024);
          if (sizeInMB > maxSizeInMB) {
            alert(`File ${file.name} exceeds the ${maxSizeInMB}MB limit`);
            return;
          }

          newFiles.push(file);

          // Create preview
          const reader = new FileReader();
          reader.onloadend = () => {
            newPreviews.push(reader.result as string);
            setPreviews([...newPreviews]);
          };
          reader.readAsDataURL(file);
        });

        // Update form value with all files (existing + new)
        const updatedFiles = Array.isArray(value)
          ? [...value, ...newFiles]
          : newFiles;
        onChange(updatedFiles);

        // Call onFileChange if provided (for backward compatibility)
        if (onFileChange && newFiles.length > 0) {
          onFileChange(newFiles[0]);
        }
      }
      // For single file
      else {
        const file = files[0];
        // Check file size
        const sizeInMB = file.size / (1024 * 1024);
        if (sizeInMB > maxSizeInMB) {
          alert(`File size should be less than ${maxSizeInMB}MB`);
          return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviews([reader.result as string]);
          onChange(file); // Pass the file to form controller
        };
        reader.readAsDataURL(file);

        // Call onFileChange if provided
        if (onFileChange) {
          onFileChange(file);
        }
      }
    },
    [onChange, maxSizeInMB, multiple, maxFiles, previews, value, onFileChange]
  );

  const handleRemove = useCallback(
    (index: number) => {
      if (multiple && Array.isArray(value)) {
        // Remove the file at the specified index
        const newFiles = [...value];
        newFiles.splice(index, 1);
        onChange(newFiles);

        // Remove the preview
        const newPreviews = [...previews];
        newPreviews.splice(index, 1);
        setPreviews(newPreviews);
      } else {
        // For single file, just clear everything
        setPreviews([]);
        onChange(null);

        // Call onFileChange if provided
        if (onFileChange) {
          onFileChange(null);
        }
      }
    },
    [onChange, multiple, previews, value, onFileChange]
  );

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label htmlFor={name}>
          {label}
          {required && <span className='text-destructive'> *</span>}
        </Label>
      )}

      <div className='flex flex-wrap gap-4'>
        {/* Display image previews */}
        {previews.map((preview, index) => (
          <div key={index} className='relative w-32 h-32'>
            <Image
              src={preview}
              alt={`Preview ${index + 1}`}
              fill
              className='object-cover rounded-md'
            />
            <Button
              type='button'
              size='icon'
              variant='destructive'
              className='absolute top-1 right-1 h-6 w-6'
              onClick={() => handleRemove(index)}
              disabled={disabled}
            >
              <X className='h-3 w-3' />
            </Button>
          </div>
        ))}

        {/* Add image button (only show if multiple is true or no images yet) */}
        {(multiple || previews.length === 0) &&
          (!multiple || previews.length < maxFiles) && (
            <div className='flex items-center justify-center w-32 h-32 border-2 border-dashed rounded-md hover:border-primary/50 transition-colors'>
              <input
                id={`${name}-upload`}
                type='file'
                accept={accept}
                onChange={handleImageChange}
                disabled={disabled}
                multiple={multiple}
                className='hidden'
              />
              <label
                htmlFor={`${name}-upload`}
                className={cn(
                  'flex flex-col items-center justify-center w-full h-full cursor-pointer',
                  disabled && 'cursor-not-allowed opacity-60'
                )}
              >
                <Plus className='h-6 w-6 text-primary mb-1' />
                <span className='text-xs text-muted-foreground'>
                  {multiple ? 'Add Image' : 'Upload Image'}
                </span>
              </label>
            </div>
          )}
      </div>

      {multiple && (
        <p className='text-xs text-muted-foreground'>
          Upload up to {maxFiles} images (max {maxSizeInMB}MB each)
        </p>
      )}

      {error && <p className='text-sm text-destructive'>{error.message}</p>}
    </div>
  );
}
