'use client';

import { ReactNode } from 'react';
import { useFormContext } from 'react-hook-form';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
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
  inputClassName?: string;
  containerClassName?: string;
  dateFormat?: string;
  showTimeSelect?: boolean;
  minDate?: Date;
  maxDate?: Date;
  icon?: ReactNode;
  size?: 'default' | 'sm' | 'lg';
};

export function FormDatePicker({
  name,
  label,
  placeholder,
  description,
  disabled,
  className,
  inputClassName,
  containerClassName,
  dateFormat = 'MMMM d, yyyy',
  showTimeSelect = false,
  minDate,
  maxDate,
  icon,
  size = 'default',
}: FormDatePickerProps) {
  const { control } = useFormContext();

  const sizeClasses = {
    sm: 'h-8 text-xs',
    default: 'h-10 text-sm',
    lg: 'h-12 text-base py-3',
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn('flex flex-col', className)}>
          {label && <FormLabel>{label}</FormLabel>}
          <div className={cn('relative', containerClassName)}>
            <FormControl>
              <div className='relative'>
                <ReactDatePicker
                  selected={field.value}
                  onChange={field.onChange}
                  disabled={disabled}
                  placeholderText={placeholder}
                  dateFormat={dateFormat}
                  showTimeSelect={showTimeSelect}
                  minDate={minDate}
                  maxDate={maxDate}
                  customInput={
                    <Input
                      className={cn(
                        'pr-10',
                        icon && 'pl-10',
                        sizeClasses[size],
                        inputClassName
                      )}
                    />
                  }
                />
                {icon && (
                  <div className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground'>
                    {icon}
                  </div>
                )}
                {/* <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /> */}
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
