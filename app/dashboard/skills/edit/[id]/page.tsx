'use client';

import { useParams } from 'next/navigation';
import { SkillForm } from '../../components/skill-form';
import { useGetSkillQuery } from '@/lib/redux/features/skill/skillApiSlice';
import { Loading } from '@/components/ui/loading';

export default function EditSkillPage() {
  const { id } = useParams<{ id: string }>();
  const { data: skill, isLoading } = useGetSkillQuery(id);

  if (isLoading) {
    return <Loading fullScreen text='Loading skill...' />;
  }

  if (!skill) {
    return <div>Skill not found</div>;
  }

  return (
    <div className='container py-6 space-y-6'>
      <h1 className='text-3xl font-bold'>Edit Skill</h1>
      <SkillForm skill={skill?.data} />
    </div>
  );
}
