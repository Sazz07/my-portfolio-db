'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '@/lib/redux/features/auth/authSlice';
import { useLogoutMutation } from '@/lib/redux/features/auth/authApiSlice';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
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
  Menu,
  X,
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
  const pathname = usePathname();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [logout] = useLogoutMutation();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

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

  const NavLinks = () => (
    <ul className='space-y-1'>
      {navItems.map((item) => (
        <li key={item.name}>
          <Link
            href={item.href}
            className={`flex items-center px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
              pathname === item.href ? 'bg-gray-100 dark:bg-gray-700' : ''
            }`}
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
  );

  return (
    <div className='flex flex-col md:flex-row min-h-screen bg-gray-100 dark:bg-gray-900'>
      {/* Mobile Header */}
      <header className='md:hidden flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow-sm'>
        <h1 className='text-xl font-bold text-gray-800 dark:text-white'>
          Portfolio Dashboard
        </h1>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant='ghost' size='icon'>
              <Menu className='h-6 w-6' />
            </Button>
          </SheetTrigger>
          <SheetContent side='left' className='w-[80%] sm:w-[350px] p-0'>
            <div className='flex flex-col h-full'>
              <div className='p-6 border-b'>
                <h2 className='text-xl font-bold'>Portfolio Dashboard</h2>
              </div>
              <nav className='flex-1 overflow-auto py-2'>
                <NavLinks />
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </header>

      {/* Desktop Sidebar */}
      <aside className='hidden md:block w-64 bg-white dark:bg-gray-800 shadow-md'>
        <div className='p-6'>
          <h1 className='text-2xl font-bold text-gray-800 dark:text-white'>
            Portfolio Dashboard
          </h1>
        </div>
        <nav className='mt-6'>
          <NavLinks />
        </nav>
      </aside>

      <main className='flex-1 overflow-y-auto p-4 md:p-6'>{children}</main>
    </div>
  );
}
