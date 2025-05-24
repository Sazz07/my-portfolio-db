'use client';

import { useState } from 'react';
import { z } from 'zod';
import { Mail, Lock, User, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  FormWrapper,
  FormInput,
  FormSelect,
  FormCheckbox,
  FormDatePicker,
  FormTextarea,
  FormImageUpload,
} from '@/components/form';

// Define form schema with Zod
const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' }),
  birthDate: z.date().optional(),
  bio: z
    .string()
    .min(10, { message: 'Bio must be at least 10 characters' })
    .max(500, { message: 'Bio must not exceed 500 characters' }),
  category: z.string().min(1, { message: 'Please select a category' }),
  tags: z
    .array(z.string())
    .min(1, { message: 'Please select at least one tag' }),
  agreeToTerms: z
    .boolean()
    .refine((val) => val === true, { message: 'You must agree to the terms' }),
  profileImage: z.any().optional(),
  galleryImages: z.array(z.any()).optional(),
});

// Define form types based on the schema
type FormValues = z.infer<typeof formSchema>;

export default function FormTestPage() {
  const [formData, setFormData] = useState<Partial<FormValues> | null>(null);

  // Categories for select
  const categories = [
    { value: 'technology', label: 'Technology' },
    { value: 'design', label: 'Design' },
    { value: 'business', label: 'Business' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'other', label: 'Other' },
  ];

  // Tags for multi-select
  const tags = [
    { value: 'react', label: 'React' },
    { value: 'nextjs', label: 'Next.js' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'tailwind', label: 'Tailwind CSS' },
    { value: 'nodejs', label: 'Node.js' },
    { value: 'prisma', label: 'Prisma' },
  ];

  const handleSubmit = (values: FormValues) => {
    console.log('Form submitted:', values);
    setFormData(values);
  };

  return (
    <div className='container mx-auto py-10 px-4'>
      <h1 className='text-3xl font-bold mb-8'>Form Components Test</h1>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-10'>
        <div className='space-y-6'>
          <FormWrapper
            schema={formSchema}
            onSubmit={handleSubmit}
            defaultValues={{
              name: '',
              email: '',
              password: '',
              bio: '',
              category: '',
              tags: [],
              agreeToTerms: false,
            }}
            className='space-y-6 p-6 border rounded-lg shadow-sm'
          >
            <h2 className='text-xl font-semibold'>Test Form</h2>

            <FormInput
              name='name'
              label='Full Name'
              placeholder='Enter your name'
              icon={<User />}
            />

            <FormInput
              name='email'
              label='Email Address'
              placeholder='you@example.com'
              type='email'
              icon={<Mail />}
            />

            <FormInput
              name='password'
              label='Password'
              placeholder='••••••••'
              type='password'
              icon={<Lock />}
              description='Password must be at least 8 characters'
            />

            <FormDatePicker
              name='birthDate'
              label='Birth Date'
              placeholder='Select your birth date'
            />

            <FormSelect
              name='category'
              label='Category'
              placeholder='Select a category'
              options={categories}
            />

            <FormSelect
              name='tags'
              label='Tags'
              placeholder='Select tags'
              options={tags}
              isMulti
              isCreatable
              description='You can select multiple tags or create new ones'
            />

            <FormTextarea
              name='bio'
              label='Bio'
              placeholder='Tell us about yourself'
              rows={4}
              icon={<MessageSquare />}
              description='Brief description about yourself'
            />

            <FormImageUpload
              name='profileImage'
              label='Profile Image'
              maxSizeInMB={2}
            />

            <FormImageUpload
              name='galleryImages'
              label='Gallery Images'
              multiple
              maxFiles={5}
              maxSizeInMB={2}
            />

            <FormCheckbox
              name='agreeToTerms'
              label='I agree to the terms and conditions'
              description='By checking this box, you agree to our Terms of Service and Privacy Policy'
            />

            <Button type='submit' className='w-full'>
              Submit Form
            </Button>
          </FormWrapper>
        </div>

        <div className='space-y-6'>
          <div className='p-6 border rounded-lg shadow-sm'>
            <h2 className='text-xl font-semibold mb-4'>Form Data Preview</h2>
            {formData ? (
              <pre className='bg-gray-100 p-4 rounded-md overflow-auto max-h-[600px]'>
                {JSON.stringify(
                  formData,
                  (key, value) => {
                    // Handle File objects and Date objects for display
                    if (value instanceof File) {
                      return `File: ${value.name} (${Math.round(
                        value.size / 1024
                      )}KB)`;
                    }
                    if (value instanceof Date) {
                      return value.toISOString();
                    }
                    return value;
                  },
                  2
                )}
              </pre>
            ) : (
              <p className='text-muted-foreground'>
                Submit the form to see the data here
              </p>
            )}
          </div>

          <div className='p-6 border rounded-lg shadow-sm'>
            <h2 className='text-xl font-semibold mb-4'>
              Component Information
            </h2>
            <div className='space-y-4'>
              <div>
                <h3 className='font-medium'>FormWrapper</h3>
                <p className='text-sm text-muted-foreground'>
                  Sets up form context with validation using Zod schema
                </p>
              </div>
              <div>
                <h3 className='font-medium'>FormInput</h3>
                <p className='text-sm text-muted-foreground'>
                  Text input with optional icon and password visibility toggle
                </p>
              </div>
              <div>
                <h3 className='font-medium'>FormSelect</h3>
                <p className='text-sm text-muted-foreground'>
                  Dropdown select with support for multi-select and creatable
                  options
                </p>
              </div>
              <div>
                <h3 className='font-medium'>FormCheckbox</h3>
                <p className='text-sm text-muted-foreground'>
                  Checkbox input with label and description
                </p>
              </div>
              <div>
                <h3 className='font-medium'>FormDatePicker</h3>
                <p className='text-sm text-muted-foreground'>
                  Date picker with calendar popup
                </p>
              </div>
              <div>
                <h3 className='font-medium'>FormTextarea</h3>
                <p className='text-sm text-muted-foreground'>
                  Multi-line text input with adjustable rows
                </p>
              </div>
              <div>
                <h3 className='font-medium'>FormImageUpload</h3>
                <p className='text-sm text-muted-foreground'>
                  Image upload with preview, single or multiple file support
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
