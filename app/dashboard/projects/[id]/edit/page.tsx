'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { toast } from 'sonner';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  FormWrapper,
  FormInput,
  FormSelect,
  FormTextarea,
  FormImageUpload,
} from '@/components/form';
import {
  useGetProjectQuery,
  useUpdateProjectMutation,
  UpdateProjectPayload,
} from '@/lib/redux/features/project/projectApiSlice';
import { useGetTechnologiesQuery } from '@/lib/redux/features/technology/technologyApiSlice';

// Define form schema with Zod
const formSchema = z.object({
  title: z.string().min(2, { message: 'Title must be at least 2 characters' }),
  description: z
    .string()
    .min(10, { message: 'Description must be at least 10 characters' }),
  liveUrl: z
    .string()
    .url({ message: 'Please enter a valid URL' })
    .optional()
    .or(z.literal('')),
  githubUrl: z
    .string()
    .url({ message: 'Please enter a valid URL' })
    .optional()
    .or(z.literal('')),
  technologies: z
    .array(z.string())
    .min(1, { message: 'Please select at least one technology' }),
  status: z.enum(['ONGOING', 'COMPLETED']),
  images: z.array(z.any()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

type PageParams = {
  id: string;
};

export default function EditProjectPage({
  params,
}: {
  params: PageParams | Promise<PageParams>;
}) {
  const router = useRouter();
  const unwrappedParams = use(params as Promise<PageParams>);
  const id = unwrappedParams.id;

  const { data: project, isLoading: isLoadingProject } = useGetProjectQuery(id);
  const { data: technologiesData = [], isLoading: isLoadingTechnologies } =
    useGetTechnologiesQuery();
  const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation();

  const technologies = Array.isArray(technologiesData) ? technologiesData : [];

  const technologyOptions = technologies.map((tech) => ({
    value: tech.name,
    label: tech.name,
  }));

  const statusOptions = [
    { value: 'ONGOING', label: 'Ongoing' },
    { value: 'COMPLETED', label: 'Completed' },
  ];

  const handleSubmit = async (values: FormValues) => {
    try {
      const formData = new FormData();

      // Append the ID to the FormData
      formData.append('id', id);

      // Append other fields
      formData.append('title', values.title);
      formData.append('description', values.description);
      formData.append('status', values.status);

      // Handle technologies as JSON string
      formData.append('technologies', JSON.stringify(values.technologies));

      // Optional fields
      if (values.liveUrl) {
        formData.append('liveUrl', values.liveUrl);
      }

      if (values.githubUrl) {
        formData.append('githubUrl', values.githubUrl);
      }

      // Handle image uploads
      if (values.images && values.images.length > 0) {
        values.images.forEach((image) => {
          formData.append('images', image);
        });
      }

      // Send the FormData directly
      await updateProject(formData as unknown as UpdateProjectPayload).unwrap();
      toast.success('Project updated successfully');
      router.push('/dashboard/projects');
    } catch (error) {
      console.error('Failed to update project:', error);
      toast.error('Failed to update project');
    }
  };

  if (isLoadingProject) {
    return (
      <div className='flex justify-center items-center h-[50vh]'>
        <Loader2 className='h-10 w-10 animate-spin text-primary' />
      </div>
    );
  }

  if (!project) {
    return (
      <div className='text-center py-10'>
        <h3 className='text-lg font-medium'>Project not found</h3>
        <Button
          variant='outline'
          className='mt-4'
          onClick={() => router.push('/dashboard/projects')}
        >
          <ArrowLeft className='mr-2 h-4 w-4' /> Back to Projects
        </Button>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center gap-4'>
        <Button
          variant='outline'
          size='icon'
          onClick={() => router.push('/dashboard/projects')}
        >
          <ArrowLeft className='h-4 w-4' />
        </Button>
        <h1 className='text-3xl font-bold'>Edit Project</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Project</CardTitle>
          <CardDescription>Update your project details below.</CardDescription>
        </CardHeader>
        <CardContent>
          <FormWrapper
            schema={formSchema}
            onSubmit={handleSubmit}
            defaultValues={{
              title: project.title,
              description: project.description,
              liveUrl: project.liveUrl || '',
              githubUrl: project.githubUrl || '',
              technologies: project.technologies || [],
              status: project.status,
              images: [],
            }}
            className='space-y-6'
          >
            <FormInput
              name='title'
              label='Project Title'
              placeholder='Enter project title'
            />

            <FormTextarea
              name='description'
              label='Description'
              placeholder='Describe your project'
              rows={5}
            />

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <FormInput
                name='liveUrl'
                label='Live URL'
                placeholder='https://example.com'
              />

              <FormInput
                name='githubUrl'
                label='GitHub URL'
                placeholder='https://github.com/username/repo'
              />
            </div>

            <FormSelect
              name='technologies'
              label='Technologies'
              placeholder='Select technologies'
              options={technologyOptions}
              isMulti
              isCreatable
              description='Select or create technologies used in this project'
            />

            <FormSelect
              name='status'
              label='Status'
              placeholder='Select project status'
              options={statusOptions}
              description='Current status of the project'
            />

            <FormImageUpload
              name='images'
              label='Project Images'
              maxFiles={5}
              multiple
            />

            <div className='flex justify-end gap-4'>
              <Button
                type='button'
                variant='outline'
                onClick={() => router.push('/dashboard/projects')}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={isUpdating}>
                {isUpdating && (
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                )}
                Update Project
              </Button>
            </div>
          </FormWrapper>
        </CardContent>
      </Card>
    </div>
  );
}
