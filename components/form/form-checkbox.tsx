'use client';

import { useFormContext } from 'react-hook-form';
import { Checkbox } from '@/components/ui/checkbox';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

type FormCheckboxProps = {
  name: string;
  label: string;
  description?: string;
  disabled?: boolean;
};

export function FormCheckbox({
  name,
  label,
  description,
  disabled,
}: FormCheckboxProps) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md'>
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={disabled}
            />
          </FormControl>
          <div className='space-y-1 leading-none'>
            <FormLabel className='text-sm font-medium'>{label}</FormLabel>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
}
