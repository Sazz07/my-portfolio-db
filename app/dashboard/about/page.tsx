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

import { useGetAboutQuery } from '@/lib/redux/features/about/aboutApiSlice';

export default function AboutPage() {
  const router = useRouter();
  const { data: about, isLoading } = useGetAboutQuery();

  const handleCreateClick = () => {
    router.push('/dashboard/about/create');
  };

  const handleEditClick = (id: string) => {
    router.push(`/dashboard/about/edit/${id}`);
  };

  if (isLoading) {
    return <Loading fullScreen text="Loading about information..." />;
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">About Me</h1>
        {!about ? (
          <Button onClick={handleCreateClick}>
            <Plus className="mr-2 h-4 w-4" /> Create About
          </Button>
        ) : (
          <Button onClick={() => handleEditClick(about.id)}>
            <Pencil className="mr-2 h-4 w-4" /> Edit About
          </Button>
        )}
      </div>

      <Separator />

      {!about ? (
        <EmptyState
          title="No about information"
          description="Create your about section to tell visitors about yourself"
          action={{
            label: 'Create About',
            onClick: handleCreateClick,
          }}
        />
      ) : (
        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              {about.image && (
                <div className="w-full md:w-1/3">
                  <div className="relative aspect-square overflow-hidden rounded-md">
                    <Image
                      src={about.image}
                      alt="Profile"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}
              <div className="flex-1 space-y-4">
                <h2 className="text-2xl font-bold">{about.title}</h2>
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: about.description }}
                />
                {about.resumeUrl && (
                  <div className="pt-4">
                    <Button asChild variant="outline">
                      <a href={about.resumeUrl} target="_blank" rel="noopener noreferrer">
                        <FileText className="mr-2 h-4 w-4" /> View Resume
                      </a>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}