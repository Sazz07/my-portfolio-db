'use client';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { z } from 'zod';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FormWrapper, FormInput } from '@/components/form';

import { selectCurrentUser } from '@/lib/redux/features/auth/authSlice';
import { useChangePasswordMutation } from '@/lib/redux/features/auth/authApiSlice';

const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      ),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type PasswordFormValues = z.infer<typeof passwordFormSchema>;

export default function ProfilePage() {
  const user = useSelector(selectCurrentUser);
  const [activeTab, setActiveTab] = useState('account');

  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const handlePasswordSubmit = async (values: PasswordFormValues) => {
    try {
      await changePassword({
        oldPassword: values.currentPassword,
        newPassword: values.newPassword,
      }).unwrap();
      toast.success('Password changed successfully');
    } catch {
      toast.error('Failed to change password');
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="container py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account settings
        </p>
      </div>

      <Separator />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    Email
                  </h3>
                  <p>{user.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    Role
                  </h3>
                  <p className="capitalize">{user.role.toLowerCase()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <CardContent>
              <FormWrapper
                schema={passwordFormSchema}
                defaultValues={{
                  currentPassword: '',
                  newPassword: '',
                  confirmPassword: '',
                }}
                onSubmit={handlePasswordSubmit}
                className="space-y-4"
              >
                <FormInput
                  name="currentPassword"
                  label="Current Password"
                  type="password"
                  disabled={isLoading}
                />
                <FormInput
                  name="newPassword"
                  label="New Password"
                  type="password"
                  disabled={isLoading}
                />
                <FormInput
                  name="confirmPassword"
                  label="Confirm New Password"
                  type="password"
                  disabled={isLoading}
                />
                <div className="flex justify-end">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Changing Password...' : 'Change Password'}
                  </Button>
                </div>
              </FormWrapper>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}