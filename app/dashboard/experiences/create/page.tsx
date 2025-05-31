'use client';

import { ExperienceForm } from '../components/experience-form';

export default function CreateExperiencePage() {
  return (
    <div className='container py-6 space-y-6'>
      <h1 className='text-3xl font-bold'>Add Experience</h1>
      <ExperienceForm />
    </div>
  );
}
