'use client';

import { useParams } from 'next/navigation';
import { ExperienceForm } from '../../components/experience-form';
import { useGetExperienceQuery } from '@/lib/redux/features/experience/experienceApiSlice';
import { Loading } from '@/components/ui/loading';
import { EmptyState } from '@/components/ui/empty-state';

export default function EditExperiencePage() {
  const { id } = useParams<{ id: string }>();
  const { data: experience, isLoading, error } = useGetExperienceQuery(id);

  if (isLoading) {
    return <Loading fullScreen text='Loading experience...' />;
  }

  if (error || !experience) {
    return (
      <EmptyState
        title='Experience not found'
        description="The experience you're looking for doesn't exist or you don't have permission to view it."
      />
    );
  }

  return (
    <div className='container py-6 space-y-6'>
      <h1 className='text-3xl font-bold'>Edit Experience</h1>
      <ExperienceForm experience={experience?.data} />
    </div>
  );
}
