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
  journey: z.string().min(1, 'Journey is required'),
  values: z.string().min(1, 'Values are required'),
  approach: z.string().min(1, 'Approach is required'),
  beyondCoding: z.string().min(1, 'Beyond coding is required'),
  lookingForward: z.string().min(1, 'Looking forward is required'),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  image: z.union([z.string(), z.instanceof(File)]).optional(),
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
    journey: about?.data?.journey || '',
    values: about?.data?.values || '',
    approach: about?.data?.approach || '',
    beyondCoding: about?.data?.beyondCoding || '',
    lookingForward: about?.data?.lookingForward || '',
    metaTitle: about?.data?.metaTitle || '',
    metaDescription: about?.data?.metaDescription || '',
    image: about?.data?.image || '',
  };

  const onSubmit = async (values: FormValues) => {
    try {
      const formData = new FormData();
      formData.append('journey', values.journey);
      formData.append('values', values.values);
      formData.append('approach', values.approach);
      formData.append('beyondCoding', values.beyondCoding);
      formData.append('lookingForward', values.lookingForward);
      if (values.metaTitle) formData.append('metaTitle', values.metaTitle);
      if (values.metaDescription)
        formData.append('metaDescription', values.metaDescription);
      if (selectedImage) {
        formData.append('image', selectedImage);
      } else if (values.image) {
        formData.append('image', values.image);
      }
      if (isEditing && about) {
        formData.append('id', about?.data?.id);
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
      className='space-y-6 max-w-2xl mx-auto bg-white dark:bg-slate-900 p-8 rounded-lg shadow'
    >
      <FormRichEditor name='journey' label='Journey' disabled={isLoading} />
      <FormRichEditor name='values' label='Values' disabled={isLoading} />
      <FormRichEditor name='approach' label='Approach' disabled={isLoading} />
      <FormRichEditor
        name='beyondCoding'
        label='Beyond Coding'
        disabled={isLoading}
      />
      <FormRichEditor
        name='lookingForward'
        label='Looking Forward'
        disabled={isLoading}
      />
      <FormInput
        name='metaTitle'
        label='Meta Title'
        placeholder='SEO meta title (optional)'
        disabled={isLoading}
      />
      <FormInput
        name='metaDescription'
        label='Meta Description'
        placeholder='SEO meta description (optional)'
        disabled={isLoading}
      />
      <FormImageUpload
        name='image'
        label='Profile Image'
        disabled={isLoading}
        onFileChange={handleImageChange}
        existingImage={about?.data?.image}
      />
      <div className='flex justify-end space-x-2 pt-4'>
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
