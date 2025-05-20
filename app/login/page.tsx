'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLoginMutation } from '@/lib/redux/features/auth/authApiSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [login, { isLoading }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await login(data).unwrap();
      toast.success('Login successful');
      router.push('/dashboard');
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

        <form onSubmit={handleSubmit(onSubmit)} className='mt-8 space-y-6'>
          <div className='space-y-4'>
            <div>
              <Label htmlFor='email' className='mb-1'>
                Email
              </Label>
              <Input
                id='email'
                type='email'
                placeholder='your@email.com'
                {...register('email')}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className='mt-1 text-sm text-red-500'>
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor='password' className='mb-1'>
                Password
              </Label>
              <Input
                id='password'
                type='password'
                placeholder='••••••••'
                {...register('password')}
                className={errors.password ? 'border-red-500' : ''}
              />
              {errors.password && (
                <p className='mt-1 text-sm text-red-500'>
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <Button type='submit' className='w-full' disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
      </div>
    </div>
  );
}
