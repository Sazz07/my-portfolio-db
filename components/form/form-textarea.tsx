'use client';

import { ReactNode } from 'react';
import { useFormContext } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

type FormTextareaProps = {
  name: string;
  label?: string;
  placeholder?: string;
  description?: string;
  rows?: number;
  icon?: ReactNode;
  disabled?: boolean;
  className?: string;
};

export function FormTextarea({
  name,
  label,
  placeholder,
  description,
  rows = 4,
  disabled,
  className,
}: FormTextareaProps) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Textarea
              {...field}
              placeholder={placeholder}
              rows={rows}
              disabled={disabled}
              className='bg-white'
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
