'use client';

import { ReactNode } from 'react';
import {
  useForm,
  FormProvider,
  SubmitHandler,
  FieldValues,
  DefaultValues,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

type FormWrapperProps<T extends FieldValues> = {
  schema: z.ZodType<T>;
  defaultValues?: DefaultValues<T>;
  onSubmit: SubmitHandler<T>;
  children: ReactNode;
  className?: string;
};

export function FormWrapper<T extends FieldValues>({
  schema,
  defaultValues,
  onSubmit,
  children,
  className,
}: FormWrapperProps<T>) {
  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={className}>
        {children}
      </form>
    </FormProvider>
  );
}