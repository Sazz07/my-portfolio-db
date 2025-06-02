'use client';

import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { toast } from 'sonner';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  FormWrapper,
  FormInput,
  FormRichEditor,
  FormImageUpload,
} from '@/components/form';

import {
  useCreateAboutMutation,
  useUpdateAboutMutation,
  About,
} from '@/lib/redux/features/about/aboutApiSlice';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  image: z.string().optional(),
  resumeUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

type FormValues = z.infer<typeof formSchema>;

type AboutFormProps = {
  about?: About;
};

export function AboutForm({ about }: AboutFormProps) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const [createAbout, { isLoading: isCreating }] = useCreateAboutMutation();
  const [updateAbout, { isLoading: isUpdating }] = useUpdateAboutMutation();

  const isLoading = isCreating || isUpdating;
  const isEditing = !!about;

  const defaultValues: FormValues = {
    title: about?.title || '',
    description: about?.description || '',
    image: about?.image || '',
    resumeUrl: about?.resumeUrl || '',
  };

  const onSubmit = async (values: FormValues) => {
    try {
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('description', values.description);

      if (values.resumeUrl) {
        formData.append('resumeUrl', values.resumeUrl);
      }

      if (selectedImage) {
        formData.append('image', selectedImage);
      } else if (values.image) {
        formData.append('image', values.image);
      }

      if (isEditing && about) {
        formData.append('id', about.id);
        await updateAbout(formData).unwrap();
        toast.success('About information updated successfully');
      } else {
        await createAbout(formData).unwrap();
        toast.success('About information created successfully');
      }

      router.push('/dashboard/about');
    } catch {
      toast.error(
        isEditing
          ? 'Failed to update about information'
          : 'Failed to create about information'
      );
    }
  };

  const handleImageChange = (file: File | null) => {
    setSelectedImage(file);
  };

  return (
    <FormWrapper
      schema={formSchema}
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      className='space-y-6'
    >
      <FormInput
        name='title'
        label='Title'
        placeholder='e.g. Full Stack Developer'
        disabled={isLoading}
      />

      <FormRichEditor
        name='description'
        label='Description'
        disabled={isLoading}
      />

      <FormImageUpload
        name='image'
        label='Profile Image'
        disabled={isLoading}
        onFileChange={handleImageChange}
        existingImage={about?.image}
      />

      <FormInput
        name='resumeUrl'
        label='Resume URL'
        placeholder='https://example.com/resume.pdf'
        disabled={isLoading}
      />

      <div className='flex justify-end space-x-2'>
        <Button
          type='button'
          variant='outline'
          onClick={() => router.back()}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type='submit' disabled={isLoading}>
          {isLoading
            ? isEditing
              ? 'Updating...'
              : 'Creating...'
            : isEditing
            ? 'Update About'
            : 'Create About'}
        </Button>
      </div>
    </FormWrapper>
  );
}
