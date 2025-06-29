'use client';

import { useState, useEffect, use } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { z } from 'zod';
import { toast } from 'sonner';
import { Loader2, ArrowLeft, X } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  FormWrapper,
  FormInput,
  FormSelect,
  FormRichEditor,
  FormImageUpload,
  FormFeaturedImageSelector,
} from '@/components/form';
import {
  useGetBlogQuery,
  useUpdateBlogMutation,
} from '@/lib/redux/features/blog/blogApiSlice';
import { Loading } from '@/components/ui/loading';
import { EmptyState } from '@/components/ui/empty-state';

// Define form schema with Zod
const formSchema = z.object({
  title: z.string().min(2, { message: 'Title must be at least 2 characters' }),
  content: z
    .string()
    .min(10, { message: 'Content must be at least 10 characters' }),
  summary: z
    .string()
    .min(10, { message: 'Summary must be at least 10 characters' }),
  tags: z.array(z.string()).min(1, { message: 'Please add at least one tag' }),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
  images: z.array(z.any()).optional(),
  imagesToRemove: z.array(z.string()).optional(),
  featuredImage: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const statusOptions = [
  { value: 'DRAFT', label: 'Draft' },
  { value: 'PUBLISHED', label: 'Published' },
];

export default function EditBlogPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const { data: blog, isLoading: isLoadingBlog } = useGetBlogQuery(id);

  const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation();

  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [imagesToRemove, setImagesToRemove] = useState<string[]>([]);

  useEffect(() => {
    if (blog?.images && blog.images.length > 0) {
      // Clean up the image URLs (remove any extra quotes)
      const cleanedImages = blog.images.map((img) =>
        typeof img === 'string'
          ? img.replace(/\s+/g, '').replace(/"/g, '')
          : img
      );
      setExistingImages(
        cleanedImages.filter((img) => !imagesToRemove.includes(img))
      );
    }
  }, [blog, imagesToRemove]);

  const handleRemoveExistingImage = (imageUrl: string) => {
    setImagesToRemove((prev) => [...prev, imageUrl]);
  };

  const handleSubmit = async (values: FormValues) => {
    try {
      const formData = new FormData();

      // Append the ID to the FormData
      formData.append('id', id);

      // Append other fields
      formData.append('title', values.title);
      formData.append('content', values.content);
      formData.append('summary', values.summary);
      formData.append('status', values.status);

      // Handle tags as JSON string
      formData.append('tags', JSON.stringify(values.tags));

      // Add featured image if selected
      if (values.featuredImage) {
        formData.append('featuredImage', values.featuredImage);
      }

      // Add images to remove
      if (imagesToRemove.length > 0) {
        formData.append('imagesToRemove', JSON.stringify(imagesToRemove));
      }

      // Handle image uploads
      if (values.images && values.images.length > 0) {
        values.images.forEach((image) => {
          formData.append('images', image);
        });
      }

      await updateBlog(formData).unwrap();
      toast.success('Blog updated successfully');
      router.push('/dashboard/blogs');
    } catch (error) {
      console.error('Failed to update blog:', error);
      toast.error('Failed to update blog');
    }
  };

  if (isLoadingBlog) {
    return <Loading fullScreen text='Loading blog...' />;
  }

  if (!blog) {
    return (
      <EmptyState
        title='Blog not found'
        action={{
          label: 'Back to Blogs',
          onClick: () => router.push('/dashboard/blogs'),
          icon: <ArrowLeft className='size-4' />,
        }}
      />
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center gap-4'>
        <Button
          variant='outline'
          size='icon'
          onClick={() => router.push('/dashboard/blogs')}
        >
          <ArrowLeft className='h-4 w-4' />
        </Button>
        <h1 className='text-3xl font-bold'>Edit Blog</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Blog</CardTitle>
          <CardDescription>
            Update your blog post details below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormWrapper
            schema={formSchema}
            onSubmit={handleSubmit}
            defaultValues={{
              title: blog.title || '',
              content: blog.content || '',
              summary: blog.summary || '',
              tags: Array.isArray(blog.tags) ? blog.tags : [],
              status: blog.status || 'DRAFT',
              images: [],
              imagesToRemove: [],
              featuredImage: blog.featuredImage || '',
            }}
            className='space-y-6'
          >
            <FormInput
              name='title'
              label='Blog Title'
              placeholder='Enter blog title'
            />

            <FormInput
              name='summary'
              label='Summary'
              placeholder='Enter a brief summary of your blog post'
              description='This will be displayed in blog previews'
            />

            <FormRichEditor
              name='content'
              label='Content'
              placeholder='Write your blog content here...'
              description='Use the formatting tools to style your content'
            />

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <FormSelect
                name='tags'
                label='Tags'
                placeholder='Select or create tags'
                isMulti
                isCreatable
                options={
                  blog.tags?.map((tag) => ({ value: tag, label: tag })) || []
                }
                description='Add tags to categorize your blog post'
              />

              <FormSelect
                name='status'
                label='Status'
                placeholder='Select blog status'
                options={statusOptions}
                description='Draft will save but not publish your blog'
              />
            </div>

            {/* Display existing images with remove buttons */}
            {existingImages.length > 0 && (
              <div className='space-y-2'>
                <Label>Existing Images</Label>
                <div className='flex flex-wrap gap-4'>
                  {existingImages.map((img, index) => (
                    <div
                      key={`existing-${index}`}
                      className='relative w-32 h-32'
                    >
                      <Image
                        src={img}
                        alt={`Blog image ${index + 1}`}
                        fill
                        className='object-cover rounded-md'
                      />
                      <Button
                        type='button'
                        size='icon'
                        variant='destructive'
                        className='absolute top-1 right-1 h-6 w-6'
                        onClick={() => handleRemoveExistingImage(img)}
                      >
                        <X className='h-3 w-3' />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <FormImageUpload
              name='images'
              label='Add New Images'
              maxFiles={5}
              multiple
            />

            <FormFeaturedImageSelector
              name='featuredImage'
              label='Featured Image'
              existingImages={existingImages}
              currentFeaturedImage={blog.featuredImage}
            />

            <div className='flex justify-end gap-4'>
              <Button
                type='button'
                variant='outline'
                onClick={() => router.push('/dashboard/blogs')}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={isUpdating}>
                {isUpdating && (
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                )}
                Update Blog
              </Button>
            </div>
          </FormWrapper>
        </CardContent>
      </Card>
    </div>
  );
}
