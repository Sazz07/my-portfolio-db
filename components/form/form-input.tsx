'use client';

import { ReactNode, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

type FormInputProps = {
  name: string;
  label?: string;
  placeholder?: string;
  description?: string;
  type?: 'text' | 'email' | 'password' | 'number';
  icon?: ReactNode;
  disabled?: boolean;
  className?: string;
};

export function FormInput({
  name,
  label,
  placeholder,
  description,
  type = 'text',
  icon,
  disabled,
  className,
}: FormInputProps) {
  const { control } = useFormContext();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
          <div className='relative'>
            {icon && (
              <div className='absolute left-2 top-2 size-4 text-gray-500'>
                {icon}
              </div>
            )}
            <FormControl>
              <Input
                {...field}
                id={name}
                type={
                  type === 'password'
                    ? showPassword
                      ? 'text'
                      : 'password'
                    : type
                }
                placeholder={placeholder}
                className={icon ? 'pl-10' : ''}
                disabled={disabled}
              />
            </FormControl>
            {type === 'password' && (
              <Button
                type='button'
                variant='ghost'
                size='icon'
                className='absolute right-1 top-0.5 h-8 w-8'
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className='h-4 w-4 text-muted-foreground' />
                ) : (
                  <Eye className='h-4 w-4 text-muted-foreground' />
                )}
                <span className='sr-only'>
                  {showPassword ? 'Hide password' : 'Show password'}
                </span>
              </Button>
            )}
          </div>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
