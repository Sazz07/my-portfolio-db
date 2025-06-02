'use client';

import { AboutForm } from '../components/about-form';

export default function CreateAboutPage() {
  return (
    <div className="container py-6 space-y-6">
      <h1 className="text-3xl font-bold">Create About</h1>
      <AboutForm />
    </div>
  );
}