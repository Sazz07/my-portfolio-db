'use client';

import { useState } from 'react';
import { z } from 'zod';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormWrapper, FormInput, FormTextarea } from '@/components/form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { DeleteConfirmationDialog } from '@/components/delete-confirmation-dialog';

import {
  useGetQuotesQuery,
  useCreateQuoteMutation,
  useUpdateQuoteMutation,
  useDeleteQuoteMutation,
  Quote,
} from '@/lib/redux/features/about/aboutApiSlice';

const quoteSchema = z.object({
  text: z.string().min(1, 'Quote text is required'),
  author: z.string().min(1, 'Author is required'),
  source: z.string().optional(),
});

type QuoteFormValues = z.infer<typeof quoteSchema>;

export function QuotesManager() {
  const { data: quotes = [], isLoading } = useGetQuotesQuery();
  const [createQuote, { isLoading: isCreating }] = useCreateQuoteMutation();
  const [updateQuote, { isLoading: isUpdating }] = useUpdateQuoteMutation();
  const [deleteQuote, { isLoading: isDeleting }] = useDeleteQuoteMutation();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);

  const handleAddQuote = async (values: QuoteFormValues) => {
    try {
      await createQuote(values).unwrap();
      toast.success('Quote added successfully');
      setIsAddDialogOpen(false);
    } catch (error) {
      toast.error('Failed to add quote');
    }
  };

  const handleEditQuote = async (values: QuoteFormValues) => {
    if (!currentQuote) return;

    try {
      await updateQuote({
        id: currentQuote.id,
        ...values,
      }).unwrap();
      toast.success('Quote updated successfully');
      setIsEditDialogOpen(false);
      setCurrentQuote(null);
    } catch (error) {
      toast.error('Failed to update quote');
    }
  };

  const handleDeleteQuote = async () => {
    if (!currentQuote) return;

    try {
      await deleteQuote(currentQuote.id).unwrap();
      toast.success('Quote deleted successfully');
      setIsDeleteDialogOpen(false);
      setCurrentQuote(null);
    } catch (error) {
      toast.error('Failed to delete quote');
    }
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl font-bold'>Quotes</h2>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className='mr-2 h-4 w-4' /> Add Quote
        </Button>
      </div>

      <Separator />

      {isLoading ? (
        <div className='flex justify-center py-8'>Loading quotes...</div>
      ) : quotes.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-8 text-center'>
          <p className='text-muted-foreground mb-4'>
            No quotes added yet. Add your first quote to display on your about
            page.
          </p>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className='mr-2 h-4 w-4' /> Add Your First Quote
          </Button>
        </div>
      ) : (
        <div className='grid gap-4 md:grid-cols-2'>
          {quotes.map((quote) => (
            <Card key={quote.id}>
              <CardHeader className='pb-2'>
                <CardTitle className='flex items-center justify-between text-lg'>
                  <span className='truncate'>{quote.author}</span>
                  <div className='flex space-x-2'>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => {
                        setCurrentQuote(quote);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Pencil className='h-4 w-4' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => {
                        setCurrentQuote(quote);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <blockquote className='border-l-4 border-primary/30 pl-4 italic text-muted-foreground'>
                  {quote.text}
                </blockquote>
                {quote.source && (
                  <p className='mt-2 text-sm text-muted-foreground'>
                    Source: {quote.source}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Quote Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Quote</DialogTitle>
          </DialogHeader>
          <FormWrapper
            schema={quoteSchema}
            onSubmit={handleAddQuote}
            className='space-y-4'
          >
            <FormTextarea
              name='text'
              label='Quote Text'
              placeholder='Enter the quote text'
              disabled={isCreating}
            />
            <FormInput
              name='author'
              label='Author'
              placeholder="Enter the author's name"
              disabled={isCreating}
            />
            <FormInput
              name='source'
              label='Source (Optional)'
              placeholder='Book, speech, etc.'
              disabled={isCreating}
            />
            <div className='flex justify-end space-x-2'>
              <Button
                type='button'
                variant='outline'
                onClick={() => setIsAddDialogOpen(false)}
                disabled={isCreating}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={isCreating}>
                {isCreating ? 'Adding...' : 'Add Quote'}
              </Button>
            </div>
          </FormWrapper>
        </DialogContent>
      </Dialog>

      {/* Edit Quote Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Quote</DialogTitle>
          </DialogHeader>
          <FormWrapper
            schema={quoteSchema}
            defaultValues={{
              text: currentQuote?.text || '',
              author: currentQuote?.author || '',
              source: currentQuote?.source || '',
            }}
            onSubmit={handleEditQuote}
            className='space-y-4'
          >
            <FormTextarea
              name='text'
              label='Quote Text'
              placeholder='Enter the quote text'
              disabled={isUpdating}
            />
            <FormInput
              name='author'
              label='Author'
              placeholder="Enter the author's name"
              disabled={isUpdating}
            />
            <FormInput
              name='source'
              label='Source (Optional)'
              placeholder='Book, speech, etc.'
              disabled={isUpdating}
            />
            <div className='flex justify-end space-x-2'>
              <Button
                type='button'
                variant='outline'
                onClick={() => setIsEditDialogOpen(false)}
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={isUpdating}>
                {isUpdating ? 'Updating...' : 'Update Quote'}
              </Button>
            </div>
          </FormWrapper>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={setIsDeleteDialogOpen}
        onConfirm={handleDeleteQuote}
        isDeleting={isDeleting}
        title='Delete Quote'
        description='Are you sure you want to delete this quote? This action cannot be undone.'
      />
    </div>
  );
}
