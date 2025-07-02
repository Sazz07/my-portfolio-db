'use client';

import { useParams } from 'next/navigation';
import { AboutForm } from '../../components/about-form';
import { useGetAboutQuery } from '@/lib/redux/features/about/aboutApiSlice';
import { Loading } from '@/components/ui/loading';

export default function EditAboutPage() {
  const { id } = useParams<{ id: string }>();
  const { data: about, isLoading } = useGetAboutQuery();

  if (isLoading) {
    return <Loading fullScreen text='Loading about information...' />;
  }

  if (!about || about?.data?.id !== id) {
    return <div>About information not found</div>;
  }

  return (
    <div className='container py-6 space-y-6'>
      <h1 className='text-3xl font-bold'>Edit About</h1>
      <AboutForm about={about} />
    </div>
  );
}
