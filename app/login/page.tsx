'use client';

import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useLoginMutation } from '@/lib/redux/features/auth/authApiSlice';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { FormWrapper, FormInput } from '@/components/form';

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = async (data: LoginFormValues) => {
    try {
      await login(data).unwrap();
      toast.success('Login successful');
      router.push('/dashboard');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.data?.message || 'Login failed');
    }
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-4'>
      <div className='w-full max-w-md space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md'>
        <div className='text-center'>
          <h1 className='text-3xl font-bold tracking-tight text-gray-900 dark:text-white'>
            Portfolio Dashboard
          </h1>
          <p className='mt-2 text-sm text-gray-600 dark:text-gray-400'>
            Sign in to manage your portfolio content
          </p>
        </div>

        <FormWrapper
          schema={loginSchema}
          onSubmit={handleSubmit}
          defaultValues={{
            email: '',
            password: '',
          }}
          className='mt-8 space-y-6'
        >
          <div className='space-y-4'>
            <FormInput
              name='email'
              label='Email'
              type='email'
              placeholder='your@email.com'
              icon={<Mail />}
            />

            <FormInput
              name='password'
              label='Password'
              type='password'
              placeholder='••••••••'
              icon={<Lock />}
            />
          </div>

          <Button
            type='submit'
            className='w-full cursor-pointer'
            disabled={isLoading}
          >
            {isLoading ? (
              <span className='flex items-center gap-1'>
                <Loader2 className='animate-spin' />
                Signing in...
              </span>
            ) : (
              'Sign in'
            )}
          </Button>
        </FormWrapper>
      </div>
    </div>
  );
}
