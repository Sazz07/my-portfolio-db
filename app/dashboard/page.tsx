'use client';

import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/lib/redux/features/auth/authSlice';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Briefcase,
  FileText,
  GraduationCap,
  Code,
  MessageSquare,
  PenTool,
} from 'lucide-react';

const stats = [
  {
    name: 'Projects',
    icon: Code,
    href: '/dashboard/projects',
    description: 'Manage your portfolio projects',
  },
  {
    name: 'Experiences',
    icon: Briefcase,
    href: '/dashboard/experiences',
    description: 'Update your work experiences',
  },
  {
    name: 'Education',
    icon: GraduationCap,
    href: '/dashboard/education',
    description: 'Edit your educational background',
  },
  {
    name: 'Skills',
    icon: PenTool,
    href: '/dashboard/skills',
    description: 'Showcase your professional skills',
  },
  {
    name: 'Blogs',
    icon: FileText,
    href: '/dashboard/blogs',
    description: 'Publish and manage your blog posts',
  },
  {
    name: 'Contacts',
    icon: MessageSquare,
    href: '/dashboard/contacts',
    description: 'View messages from visitors',
  },
];

export default function DashboardPage() {
  const user = useSelector(selectCurrentUser);

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>Dashboard</h1>
        <p className='text-muted-foreground mt-2'>
          Welcome back! Manage your portfolio content from here.
        </p>
      </div>

      {user && (
        <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700'>
          <h2 className='text-xl font-semibold mb-4'>Account Information</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <p className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                Email
              </p>
              <p className='mt-1'>{user.email}</p>
            </div>
            <div>
              <p className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                Role
              </p>
              <p className='mt-1 capitalize'>{user.role.toLowerCase()}</p>
            </div>
          </div>
        </div>
      )}

      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {stats.map((stat) => (
          <Card
            key={stat.name}
            className='hover:shadow-md transition-shadow cursor-pointer'
            onClick={() => (window.location.href = stat.href)}
          >
            <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
              <CardTitle className='text-lg font-medium'>{stat.name}</CardTitle>
              <stat.icon className='h-5 w-5 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <CardDescription>{stat.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
