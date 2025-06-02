'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Mail } from 'lucide-react';
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
import { Separator } from '@/components/ui/separator';
import { DeleteConfirmationDialog } from '@/components/delete-confirmation-dialog';
import { Loading } from '@/components/ui/loading';
import { EmptyState } from '@/components/ui/empty-state';

import {
  useGetContactsQuery,
  useDeleteContactMutation,
} from '@/lib/redux/features/contact/contactApiSlice';

export default function ContactsPage() {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<string | null>(null);

  const { data: contacts = [], isLoading } = useGetContactsQuery();

  const [deleteContact, { isLoading: isDeleting }] = useDeleteContactMutation();

  const handleDeleteClick = (id: string) => {
    setContactToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!contactToDelete) return;

    try {
      await deleteContact(contactToDelete).unwrap();
      toast.success('Contact deleted successfully');
      setDeleteDialogOpen(false);
      setContactToDelete(null);
    } catch {
      toast.error('Failed to delete contact');
    }
  };

  if (isLoading) {
    return <Loading fullScreen text='Loading contacts...' />;
  }

  return (
    <div className='container py-6 space-y-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-3xl font-bold'>Contact Messages</h1>
      </div>

      <Separator />

      {contacts.length === 0 ? (
        <EmptyState
          title='No contact messages'
          description="You haven't received any contact messages yet"
        />
      ) : (
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {contacts.map((contact) => (
            <Card key={contact.id} className='flex flex-col'>
              <CardHeader>
                <div className='flex justify-between items-start'>
                  <div>
                    <CardTitle>{contact.name}</CardTitle>
                    <CardDescription className='text-base'>
                      {contact.email}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className='flex-grow'>
                <div className='space-y-2'>
                  <h3 className='font-medium'>Subject</h3>
                  <p className='text-sm text-muted-foreground'>
                    {contact.subject}
                  </p>
                </div>
                <div className='space-y-2 mt-4'>
                  <h3 className='font-medium'>Message</h3>
                  <p className='text-sm text-muted-foreground'>
                    {contact.message}
                  </p>
                </div>
                <div className='mt-4 text-xs text-muted-foreground'>
                  Received on {format(new Date(contact.createdAt), 'PPP')}
                </div>
              </CardContent>
              <CardFooter className='flex justify-end space-x-2 mt-auto'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => handleDeleteClick(contact.id)}
                >
                  <Trash2 className='h-4 w-4' />
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
        title='Delete Contact'
        description='Are you sure you want to delete this contact message? This action cannot be undone.'
        isDeleting={isDeleting}
      />
    </div>
  );
}
