'use client';

import { ReactNode } from 'react';
import { useFormContext } from 'react-hook-form';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { CalendarIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { cn } from '@/lib/utils';

type FormDatePickerProps = {
  name: string;
  label?: string;
  placeholder?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
};

export function FormDatePicker({
  name,
  label,
  placeholder,
  description,
  disabled,
  className,
}: FormDatePickerProps) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn('flex flex-col', className)}>
          {label && <FormLabel>{label}</FormLabel>}
          <div className='relative'>
            <FormControl>
              <div className='relative'>
                <ReactDatePicker
                  selected={field.value}
                  onChange={field.onChange}
                  disabled={disabled}
                  placeholderText={placeholder}
                  dateFormat='MMMM d, yyyy'
                  customInput={<Input className='pr-10' />}
                />
                <CalendarIcon className='absolute right-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none' />
              </div>
            </FormControl>
          </div>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
