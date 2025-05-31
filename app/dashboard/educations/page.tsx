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
  useGetEducationsQuery,
  useDeleteEducationMutation,
} from '@/lib/redux/features/education/educationApiSlice';

export default function EducationsPage() {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [educationToDelete, setEducationToDelete] = useState<string | null>(
    null
  );

  const { data: educations = [], isLoading } = useGetEducationsQuery();
  const [deleteEducation, { isLoading: isDeleting }] =
    useDeleteEducationMutation();

  const handleCreateClick = () => {
    router.push('/dashboard/educations/create');
  };

  const handleEditClick = (id: string) => {
    router.push(`/dashboard/educations/edit/${id}`);
  };

  const handleDeleteClick = (id: string) => {
    setEducationToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!educationToDelete) return;

    try {
      await deleteEducation(educationToDelete).unwrap();
      toast.success('Education deleted successfully');
      setDeleteDialogOpen(false);
      setEducationToDelete(null);
    } catch {
      toast.error('Failed to delete education');
    }
  };

  if (isLoading) {
    return <Loading fullScreen text='Loading education records...' />;
  }

  return (
    <div className='container py-6 space-y-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-3xl font-bold'>Education</h1>
        <Button onClick={handleCreateClick}>
          <Plus className='mr-2 h-4 w-4' /> Add Education
        </Button>
      </div>

      <Separator />

      {educations.length === 0 ? (
        <EmptyState
          title='No education records found'
          description='Get started by adding your educational background'
          action={{
            label: 'Add Education',
            onClick: handleCreateClick,
          }}
        />
      ) : (
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {educations.map((education) => (
            <Card key={education.id} className='flex flex-col'>
              <CardHeader>
                <div className='flex justify-between items-start'>
                  <div>
                    <CardTitle>{education.degree}</CardTitle>
                    <CardDescription className='text-base'>
                      {education.institution}
                    </CardDescription>
                  </div>
                  {education.fieldOfStudy && (
                    <Badge>{education.fieldOfStudy}</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className='flex-grow'>
                <div className='text-sm text-muted-foreground mb-2'>
                  {format(new Date(education.startDate), 'MMM yyyy')} -
                  {education.endDate
                    ? format(new Date(education.endDate), 'MMM yyyy')
                    : 'Present'}
                </div>
                {education.description && (
                  <ul className='list-disc list-inside space-y-1 text-sm'>
                    {education?.description.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                )}
              </CardContent>
              <CardFooter className='border-t pt-4 flex justify-end space-x-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => handleEditClick(education.id)}
                >
                  <Pencil className='h-4 w-4 mr-1' /> Edit
                </Button>
                <Button
                  variant='destructive'
                  size='sm'
                  onClick={() => handleDeleteClick(education.id)}
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
        isDeleting={isDeleting}
        title='Delete Education'
        description='Are you sure you want to delete this education record? This action cannot be undone.'
      />
    </div>
  );
}
