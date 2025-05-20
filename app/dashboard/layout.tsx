'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '@/lib/redux/features/auth/authSlice';
import { useLogoutMutation } from '@/lib/redux/features/auth/authApiSlice';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

import {
  LayoutDashboard,
  FileText,
  Briefcase,
  GraduationCap,
  Code,
  MessageSquare,
  User,
  LogOut,
  PenTool,
  Info,
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'About', href: '/dashboard/about', icon: Info },
  { name: 'Projects', href: '/dashboard/projects', icon: Code },
  { name: 'Experiences', href: '/dashboard/experiences', icon: Briefcase },
  { name: 'Education', href: '/dashboard/education', icon: GraduationCap },
  { name: 'Skills', href: '/dashboard/skills', icon: PenTool },
  { name: 'Blogs', href: '/dashboard/blogs', icon: FileText },
  { name: 'Contacts', href: '/dashboard/contacts', icon: MessageSquare },
  { name: 'Profile', href: '/dashboard/profile', icon: User },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [logout] = useLogoutMutation();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleLogout = async () => {
    try {
      await logout(undefined).unwrap();
      toast.success('Logged out successfully');
      router.push('/login');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className='flex h-screen bg-gray-100 dark:bg-gray-900'>
      {/* Sidebar */}
      <aside className='w-64 bg-white dark:bg-gray-800 shadow-md'>
        <div className='p-6'>
          <h1 className='text-2xl font-bold text-gray-800 dark:text-white'>
            Portfolio Dashboard
          </h1>
        </div>
        <nav className='mt-6'>
          <ul>
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className='flex items-center px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'
                >
                  <item.icon className='h-5 w-5 mr-3' />
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
            <li>
              <Button
                variant='ghost'
                className='flex w-full items-center justify-start px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'
                onClick={handleLogout}
              >
                <LogOut className='h-5 w-5 mr-3' />
                <span>Logout</span>
              </Button>
            </li>
          </ul>
        </nav>
      </aside>

      <main className='flex-1 overflow-y-auto p-6'>{children}</main>
    </div>
  );
}
