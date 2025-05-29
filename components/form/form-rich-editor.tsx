'use client';

import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import dynamic from 'next/dynamic';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

// Import styles directly - this is the recommended approach for Next.js
import 'react-quill-new/dist/quill.snow.css';

// Dynamically import React Quill with no SSR to avoid hydration issues
const ReactQuill = dynamic(() => import('react-quill-new'), {
  ssr: false,
  loading: () => (
    <div className='h-64 w-full bg-muted animate-pulse rounded-md' />
  ),
});

type FormRichEditorProps = {
  name: string;
  label?: string;
  placeholder?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
};

export function FormRichEditor({
  name,
  label,
  placeholder,
  description,
  disabled,
  className,
}: FormRichEditorProps) {
  const { control } = useFormContext();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Quill modules configuration
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image', 'code-block'],
      [{ color: [] }, { background: [] }],
      ['clean'],
    ],
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            {isMounted && (
              <ReactQuill
                theme='snow'
                value={field.value || ''}
                onChange={field.onChange}
                placeholder={placeholder}
                modules={modules}
                className='h-64 mb-12'
                readOnly={disabled}
              />
            )}
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
