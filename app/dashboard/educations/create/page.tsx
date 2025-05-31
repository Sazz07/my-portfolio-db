'use client';

import { EducationForm } from '../components/education-form';

export default function CreateEducationPage() {
  return (
    <div className='container py-6 space-y-6'>
      <h1 className='text-3xl font-bold'>Add Education</h1>
      <EducationForm />
    </div>
  );
}
