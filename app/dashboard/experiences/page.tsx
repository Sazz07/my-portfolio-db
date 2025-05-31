'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { DeleteConfirmationDialog } from '@/components/delete-confirmation-dialog';
import { Loading } from '@/components/ui/loading';
import { EmptyState } from '@/components/ui/empty-state';

import {
  useGetExperiencesQuery,
  useDeleteExperienceMutation,
} from '@/lib/redux/features/experience/experienceApiSlice';

export default function ExperiencesPage() {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [experienceToDelete, setExperienceToDelete] = useState<string | null>(
    null
  );

  const { data: experiences = [], isLoading } = useGetExperiencesQuery();

  const [deleteExperience, { isLoading: isDeleting }] =
    useDeleteExperienceMutation();

  const handleCreateClick = () => {
    router.push('/dashboard/experiences/create');
  };

  const handleEditClick = (id: string) => {
    router.push(`/dashboard/experiences/edit/${id}`);
  };

  const handleDeleteClick = (id: string) => {
    setExperienceToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!experienceToDelete) return;

    try {
      await deleteExperience(experienceToDelete).unwrap();
      toast.success('Experience deleted successfully');
      setDeleteDialogOpen(false);
      setExperienceToDelete(null);
    } catch {
      toast.error('Failed to delete experience');
    }
  };

  if (isLoading) {
    return <Loading fullScreen text='Loading experiences...' />;
  }

  return (
    <div className='container py-6 space-y-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-3xl font-bold'>Experiences</h1>
        <Button onClick={handleCreateClick}>
          <Plus className='mr-2 h-4 w-4' /> Add Experience
        </Button>
      </div>

      <Separator />

      {experiences.length === 0 ? (
        <EmptyState
          title='No experiences found'
          description='Get started by creating your first experience'
          action={{
            label: 'Add Experience',
            onClick: handleCreateClick,
          }}
        />
      ) : (
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {experiences.map((experience) => (
            <Card key={experience.id} className='flex flex-col'>
              <CardHeader>
                <div className='flex justify-between items-start'>
                  <div>
                    <CardTitle>{experience.title}</CardTitle>
                    <CardDescription className='text-base'>
                      {experience.company}
                    </CardDescription>
                  </div>
                  <Badge>{experience.type}</Badge>
                </div>
              </CardHeader>
              <CardContent className='flex-grow'>
                <div className='text-sm text-muted-foreground mb-2'>
                  {format(new Date(experience.startDate), 'MMM yyyy')} -{' '}
                  {experience.endDate
                    ? format(new Date(experience.endDate), 'MMM yyyy')
                    : 'Present'}
                </div>
                {experience.description && (
                  <ul className='list-disc list-inside space-y-1 text-sm'>
                    {experience.description.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                )}
              </CardContent>
              <CardFooter className='border-t pt-4 flex justify-end space-x-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => handleEditClick(experience.id)}
                >
                  <Pencil className='h-4 w-4 mr-1' /> Edit
                </Button>
                <Button
                  variant='destructive'
                  size='sm'
                  onClick={() => handleDeleteClick(experience.id)}
                >
                  <Trash2 className='h-4 w-4 mr-1' /> Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <DeleteConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        title='Delete Experience'
        description='Are you sure you want to delete this experience? This action cannot be undone.'
        isDeleting={isDeleting}
      />
    </div>
  );
}
