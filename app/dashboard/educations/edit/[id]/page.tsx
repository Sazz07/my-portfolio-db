'use client';

import { useParams } from 'next/navigation';
import { EducationForm } from '../../components/education-form';
import { useGetEducationQuery } from '@/lib/redux/features/education/educationApiSlice';
import { Loading } from '@/components/ui/loading';
import { EmptyState } from '@/components/ui/empty-state';

export default function EditEducationPage() {
  const { id } = useParams<{ id: string }>();
  const { data: education, isLoading, error } = useGetEducationQuery(id);

  if (isLoading) {
    return <Loading fullScreen text='Loading education...' />;
  }

  if (error || !education) {
    return (
      <EmptyState
        title='Education not found'
        description="The education record you're looking for doesn't exist or you don't have permission to view it."
      />
    );
  }

  return (
    <div className='container py-6 space-y-6'>
      <h1 className='text-3xl font-bold'>Edit Education</h1>
      <EducationForm education={education} />
    </div>
  );
}
