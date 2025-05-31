'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { toast } from 'sonner';
import { Plus, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  FormWrapper,
  FormInput,
  FormDatePicker,
  FormCheckbox,
  FormTextarea,
} from '@/components/form';

import {
  useCreateEducationMutation,
  useUpdateEducationMutation,
  Education,
} from '@/lib/redux/features/education/educationApiSlice';

const formSchema = z.object({
  institution: z.string().min(1, 'Institution is required'),
  degree: z.string().min(1, 'Degree is required'),
  fieldOfStudy: z.string().min(1, 'Field of study is required'),
  location: z.string().optional(),
  startDate: z.date({ required_error: 'Start date is required' }),
  endDate: z.date().optional().nullable(),
  isCurrent: z.boolean(),
  grade: z.string().optional(),
  activities: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

type EducationFormProps = {
  education?: Education;
};

export function EducationForm({ education }: EducationFormProps) {
  const router = useRouter();
  const [descriptions, setDescriptions] = useState<string[]>(
    education?.description || ['']
  );

  const [createEducation, { isLoading: isCreating }] =
    useCreateEducationMutation();
  const [updateEducation, { isLoading: isUpdating }] =
    useUpdateEducationMutation();

  const isLoading = isCreating || isUpdating;
  const isEditing = !!education;

  const defaultValues: FormValues = {
    institution: education?.institution || '',
    degree: education?.degree || '',
    fieldOfStudy: education?.fieldOfStudy || '',
    location: education?.location || '',
    startDate: education?.startDate
      ? new Date(education.startDate)
      : new Date(),
    endDate: education?.endDate ? new Date(education.endDate) : null,
    isCurrent: education?.endDate ? false : true,
    grade: education?.grade || '',
    activities: education?.activities || '',
  };

  const handleDescriptionChange = (index: number, value: string) => {
    const newDescriptions = [...descriptions];
    newDescriptions[index] = value;
    setDescriptions(newDescriptions);
  };

  const handleAddDescription = () => {
    setDescriptions([...descriptions, '']);
  };

  const handleRemoveDescription = (index: number) => {
    if (descriptions.length > 1) {
      const newDescriptions = descriptions.filter((_, i) => i !== index);
      setDescriptions(newDescriptions);
    }
  };

  const onSubmit = async (values: FormValues) => {
    try {
      // Filter out empty descriptions
      const filteredDescriptions = descriptions.filter(
        (desc) => desc.trim() !== ''
      );

      const payload = {
        institution: values.institution,
        degree: values.degree,
        fieldOfStudy: values.fieldOfStudy,
        location: values.location,
        startDate: values.startDate.toISOString(),
        endDate: values.isCurrent ? undefined : values.endDate?.toISOString(),
        isCurrent: values.isCurrent,
        grade: values.grade,
        activities: values.activities,
        description: filteredDescriptions,
      };

      if (isEditing && education) {
        await updateEducation({
          id: education.id,
          ...payload,
        }).unwrap();
        toast.success('Education updated successfully');
      } else {
        await createEducation(payload).unwrap();
        toast.success('Education created successfully');
      }

      router.push('/dashboard/educations');
    } catch {
      toast.error(
        isEditing ? 'Failed to update education' : 'Failed to create education'
      );
    }
  };

  return (
    <FormWrapper
      schema={formSchema}
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      className='space-y-6'
    >
      {(form) => (
        <>
          <div className='grid gap-6 md:grid-cols-2'>
            <FormInput
              name='institution'
              label='School/Institution'
              placeholder='e.g. Harvard University'
              disabled={isLoading}
            />
            <FormInput
              name='degree'
              label='Degree'
              placeholder='e.g. Bachelor of Science'
              disabled={isLoading}
            />
          </div>

          <div className='grid gap-6 md:grid-cols-2'>
            <FormInput
              name='fieldOfStudy'
              label='Field of Study'
              placeholder='e.g. Computer Science'
              disabled={isLoading}
            />
            <FormInput
              name='location'
              label='Location'
              placeholder='e.g. Cambridge, MA'
              disabled={isLoading}
            />
          </div>

          {/* Improved date fields layout */}
          <div className='space-y-4'>
            <h3 className='text-sm font-medium'>Education Period</h3>
            <div className='grid gap-4 md:grid-cols-2'>
              <FormDatePicker
                name='startDate'
                label='Start Date'
                disabled={isLoading}
              />
              <div className='space-y-4'>
                <FormCheckbox
                  name='isCurrent'
                  label='I am currently studying here'
                  disabled={isLoading}
                />
                {!form.watch('isCurrent') && (
                  <FormDatePicker
                    name='endDate'
                    label='End Date'
                    disabled={isLoading}
                  />
                )}
              </div>
            </div>
          </div>

          <div className='grid gap-6 md:grid-cols-2'>
            <FormInput
              name='grade'
              label='Grade'
              placeholder='e.g. 3.8 GPA (Optional)'
              disabled={isLoading}
            />
            <FormTextarea
              name='activities'
              label='Activities and Societies'
              placeholder='e.g. Student Government, Chess Club (Optional)'
              disabled={isLoading}
            />
          </div>

          <div className='space-y-4'>
            <div className='flex justify-between items-center'>
              <h3 className='text-lg font-medium'>Description</h3>
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={handleAddDescription}
              >
                <Plus className='h-4 w-4 mr-1' /> Add Item
              </Button>
            </div>

            {descriptions.map((description, index) => (
              <Card key={index} className='p-4'>
                <div className='flex items-start gap-2'>
                  <Input
                    value={description}
                    onChange={(e) =>
                      handleDescriptionChange(index, e.target.value)
                    }
                    placeholder={`Description item ${index + 1}`}
                    disabled={isLoading}
                    className='flex-1'
                  />
                  <Button
                    type='button'
                    variant='ghost'
                    size='icon'
                    onClick={() => handleRemoveDescription(index)}
                    disabled={descriptions.length === 1 || isLoading}
                  >
                    <X className='h-4 w-4' />
                  </Button>
                </div>
              </Card>
            ))}
          </div>

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
                ? 'Update Education'
                : 'Create Education'}
            </Button>
          </div>
        </>
      )}
    </FormWrapper>
  );
}
