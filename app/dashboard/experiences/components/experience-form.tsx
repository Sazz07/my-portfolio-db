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
  FormSelect,
  FormDatePicker,
  FormCheckbox,
} from '@/components/form';

import {
  useCreateExperienceMutation,
  useUpdateExperienceMutation,
  Experience,
  TEmploymentType,
} from '@/lib/redux/features/experience/experienceApiSlice';

const employmentTypes = [
  { value: 'FULL_TIME', label: 'Full Time' },
  { value: 'PART_TIME', label: 'Part Time' },
  { value: 'CONTRACT', label: 'Contract' },
  { value: 'INTERNSHIP', label: 'Internship' },
  { value: 'FREELANCE', label: 'Freelance' },
];

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  company: z.string().min(1, 'Company is required'),
  location: z.string().optional(),
  type: z.enum(
    ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'FREELANCE'],
    {
      required_error: 'Employment type is required',
    }
  ),
  startDate: z.date({ required_error: 'Start date is required' }),
  endDate: z.date().optional().nullable(),
  isCurrent: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

type ExperienceFormProps = {
  experience?: Experience;
};

export function ExperienceForm({ experience }: ExperienceFormProps) {
  const router = useRouter();
  const [descriptions, setDescriptions] = useState<string[]>(
    experience?.description || ['']
  );

  const [createExperience, { isLoading: isCreating }] =
    useCreateExperienceMutation();
  const [updateExperience, { isLoading: isUpdating }] =
    useUpdateExperienceMutation();

  const isLoading = isCreating || isUpdating;
  const isEditing = !!experience;

  const defaultValues: FormValues = {
    title: experience?.title || '',
    company: experience?.company || '',
    location: experience?.location || '',
    type: experience?.type || 'FULL_TIME',
    startDate: experience?.startDate
      ? new Date(experience.startDate)
      : new Date(),
    endDate: experience?.endDate ? new Date(experience.endDate) : null,
    isCurrent: experience?.endDate ? false : true,
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
      const filteredDescriptions = descriptions.filter(
        (desc) => desc.trim() !== ''
      );

      if (filteredDescriptions.length === 0) {
        toast.error('Please add at least one description');
        return;
      }

      const payload = {
        title: values.title,
        company: values.company,
        location: values.location,
        type: values.type as TEmploymentType,
        startDate: values.startDate.toISOString(),
        endDate: values.isCurrent ? undefined : values.endDate?.toISOString(),
        isCurrent: values.isCurrent,
        description: filteredDescriptions,
      };

      if (isEditing && experience) {
        await updateExperience({
          id: experience.id,
          ...payload,
        }).unwrap();
        toast.success('Experience updated successfully');
      } else {
        await createExperience(payload).unwrap();
        toast.success('Experience created successfully');
      }

      router.push('/dashboard/experiences');
    } catch {
      toast.error(
        isEditing
          ? 'Failed to update experience'
          : 'Failed to create experience'
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
              name='title'
              label='Job Title'
              placeholder='e.g. Software Engineer'
              disabled={isLoading}
            />
            <FormInput
              name='company'
              label='Company'
              placeholder='e.g. Google'
              disabled={isLoading}
            />
          </div>

          <div className='grid gap-6 md:grid-cols-2'>
            <FormInput
              name='location'
              label='Location'
              placeholder='e.g. Mountain View, CA'
              disabled={isLoading}
            />
            <FormSelect
              name='type'
              label='Employment Type'
              options={employmentTypes}
              disabled={isLoading}
            />
          </div>

          {/* Improved date fields layout */}
          <div className='space-y-4'>
            <h3 className='text-sm font-medium'>Employment Period</h3>
            <div className='grid gap-4 md:grid-cols-2'>
              <FormDatePicker
                name='startDate'
                label='Start Date'
                disabled={isLoading}
              />
              <div className='space-y-4'>
                <FormCheckbox
                  name='isCurrent'
                  label='I currently work here'
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
                ? 'Update Experience'
                : 'Create Experience'}
            </Button>
          </div>
        </>
      )}
    </FormWrapper>
  );
}
