'use client';

import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { FormWrapper, FormInput, FormSelect } from '@/components/form';

import {
  useCreateSkillMutation,
  useUpdateSkillMutation,
  Skill,
} from '@/lib/redux/features/skill/skillApiSlice';

const skillCategories = [
  { value: 'Frontend', label: 'Frontend' },
  { value: 'Backend', label: 'Backend' },
  { value: 'Database', label: 'Database' },
  { value: 'DevOps', label: 'DevOps' },
  { value: 'Mobile', label: 'Mobile' },
  { value: 'Design', label: 'Design' },
  { value: 'Other', label: 'Other' },
];

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  proficiency: z.coerce
    .number()
    .min(1, 'Proficiency must be at least 1')
    .max(100, 'Proficiency must be at most 100'),
  // category: z.string().min(1, 'Category is required'),
});

type FormValues = z.infer<typeof formSchema>;

type SkillFormProps = {
  skill?: Skill;
};

export function SkillForm({ skill }: SkillFormProps) {
  const router = useRouter();

  const [createSkill, { isLoading: isCreating }] = useCreateSkillMutation();
  const [updateSkill, { isLoading: isUpdating }] = useUpdateSkillMutation();

  const isLoading = isCreating || isUpdating;
  const isEditing = !!skill;

  const defaultValues: FormValues = {
    name: skill?.name || '',
    proficiency: skill?.proficiency || 50,
    // category: skill?.category || 'Frontend',
  };

  const onSubmit = async (values: FormValues) => {
    try {
      if (isEditing && skill) {
        await updateSkill({
          id: skill.id,
          ...values,
        }).unwrap();
        toast.success('Skill updated successfully');
      } else {
        await createSkill(values).unwrap();
        toast.success('Skill created successfully');
      }

      router.push('/dashboard/skills');
    } catch {
      toast.error(
        isEditing ? 'Failed to update skill' : 'Failed to create skill'
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
      <div className='grid gap-6 md:grid-cols-1'>
        <FormInput
          name='name'
          label='Skill Name'
          placeholder='e.g. React'
          disabled={isLoading}
        />
        {/* <FormSelect
          name='category'
          label='Category'
          options={skillCategories}
          isCreatable
          disabled={isLoading}
        /> */}
      </div>

      <FormInput
        name='proficiency'
        label='Proficiency Level (1-100)'
        type='number'
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
            ? 'Update Skill'
            : 'Create Skill'}
        </Button>
      </div>
    </FormWrapper>
  );
}
