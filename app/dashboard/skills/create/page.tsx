'use client';

import { SkillForm } from '../components/skill-form';

export default function CreateSkillPage() {
  return (
    <div className='container py-6 space-y-6'>
      <h1 className='text-3xl font-bold'>Add Skill</h1>
      <SkillForm />
    </div>
  );
}
