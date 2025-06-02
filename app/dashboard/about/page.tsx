'use client';

import { useRouter } from 'next/navigation';
import { Pencil, Plus, FileText } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Loading } from '@/components/ui/loading';
import { EmptyState } from '@/components/ui/empty-state';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

import { useGetAboutQuery } from '@/lib/redux/features/about/aboutApiSlice';
import { QuotesManager } from './components/quotes-manager';

export default function AboutPage() {
  const router = useRouter();
  const { data: about, isLoading } = useGetAboutQuery();

  const handleCreateClick = () => {
    router.push('/dashboard/about/create');
  };

  const handleEditClick = () => {
    if (about) {
      router.push(`/dashboard/about/edit/${about.id}`);
    } else {
      toast.error('About section not found');
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!about) {
    return (
      <EmptyState
        title='No About Information'
        description="You haven't added any about information yet. Create one to showcase your skills and experience."
        // action={
        //   <Button onClick={handleCreateClick}>
        //     <Plus className="mr-2 h-4 w-4" />
        //     Create About
        //   </Button>
        // }
      />
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold'>About</h1>
        <Button onClick={handleEditClick}>
          <Pencil className='mr-2 h-4 w-4' />
          Edit About
        </Button>
      </div>

      <Tabs defaultValue='details'>
        <TabsList>
          <TabsTrigger value='details'>Details</TabsTrigger>
          <TabsTrigger value='quotes'>Quotes</TabsTrigger>
        </TabsList>

        <TabsContent value='details' className='space-y-6 pt-4'>
          <Card>
            <CardContent className='pt-6'>
              <div className='grid gap-6 md:grid-cols-2'>
                <div>
                  <h2 className='text-xl font-semibold mb-2'>{about.title}</h2>
                  <div
                    className='text-muted-foreground'
                    dangerouslySetInnerHTML={{ __html: about.description }}
                  />
                  {about.resumeUrl && (
                    <div className='mt-4'>
                      <a
                        href={about.resumeUrl}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='flex items-center text-primary hover:underline'
                      >
                        <FileText className='mr-2 h-4 w-4' />
                        View Resume
                      </a>
                    </div>
                  )}
                </div>
                {about.image && (
                  <div className='flex justify-center md:justify-end'>
                    <div className='relative h-64 w-64 overflow-hidden rounded-lg'>
                      <Image
                        src={about.image}
                        alt={about.title}
                        fill
                        className='object-cover'
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='quotes' className='pt-4'>
          <QuotesManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}
