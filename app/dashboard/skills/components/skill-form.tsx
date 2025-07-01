'use client';

import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { FormWrapper, FormInput, FormSelect } from '@/components/form';

import {
  useCreateSkillMutation,
  useUpdateSkillMutation,
  useGetSkillCategoriesQuery,
  useCreateSkillCategoryMutation,
  Skill,
  SkillCategory,
} from '@/lib/redux/features/skill/skillApiSlice';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  proficiency: z.coerce
    .number()
    .min(1, 'Proficiency must be at least 1')
    .max(100, 'Proficiency must be at most 100'),
  categoryId: z.string().min(1, 'Category is required'),
});

type FormValues = z.infer<typeof formSchema>;

type SkillFormProps = {
  skill?: Skill;
};

export function SkillForm({ skill }: SkillFormProps) {
  const router = useRouter();

  const [createSkill, { isLoading: isCreating }] = useCreateSkillMutation();
  const [updateSkill, { isLoading: isUpdating }] = useUpdateSkillMutation();
  const { data: categories = [], isLoading: isLoadingCategories } =
    useGetSkillCategoriesQuery();
  const [createSkillCategory] = useCreateSkillCategoryMutation();

  const isLoading = isCreating || isUpdating || isLoadingCategories;
  const isEditing = !!skill;

  const defaultValues: FormValues = {
    name: skill?.name || '',
    proficiency: skill?.proficiency || 50,
    categoryId: skill?.categoryId || '',
  };

  const categoryOptions = categories.map((cat: SkillCategory) => ({
    value: cat.id,
    label: cat.name,
  }));

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

  // Handle creatable select for category
  const handleCreateCategory = async (
    inputValue: string,
    onChange: (value: string) => void
  ) => {
    try {
      const newCategory = await createSkillCategory({
        name: inputValue,
      }).unwrap();
      onChange(newCategory.id);
    } catch {
      toast.error('Failed to create category');
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
        <FormSelect
          name='categoryId'
          label='Category'
          options={categoryOptions}
          isCreatable
          disabled={isLoading}
          selectProps={{
            onCreateOption: (inputValue: string) => {
              handleCreateCategory(inputValue, (id) => {
                // Set the value in the form
                const event = { target: { value: id } };
                // @ts-ignore
                document
                  .querySelector(`[name='categoryId']`)
                  ?.dispatchEvent(new Event('change', { bubbles: true }));
              });
            },
          }}
        />
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
