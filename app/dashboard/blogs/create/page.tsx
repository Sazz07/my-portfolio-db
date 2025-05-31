'use client';

import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { toast } from 'sonner';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
} from '@/components/form';
import {
  useCreateBlogMutation,
  useGetBlogsCategoriesQuery,
} from '@/lib/redux/features/blog/blogApiSlice';
import { TBlogCategory } from '@/types/blog.type';

const formSchema = z.object({
  title: z.string().min(2, { message: 'Title must be at least 2 characters' }),
  content: z
    .string()
    .min(10, { message: 'Content must be at least 10 characters' }),
  summary: z
    .string()
    .min(10, { message: 'Summary must be at least 10 characters' }),
  tags: z.array(z.string()).min(1, { message: 'Please add at least one tag' }),
  status: z.enum(['DRAFT', 'PUBLISHED']),
  categoryId: z.string().min(1, { message: 'Please select a category' }),
  images: z
    .array(z.any())
    .min(1, { message: 'Please upload at least one image' }),
});

type FormValues = z.infer<typeof formSchema>;

const statusOptions = [
  { value: 'DRAFT', label: 'Draft' },
  { value: 'PUBLISHED', label: 'Published' },
];

export default function CreateBlogPage() {
  const router = useRouter();
  const [createBlog, { isLoading: isCreatingBlogLoading }] =
    useCreateBlogMutation();

  const { data: blogCategories } = useGetBlogsCategoriesQuery(undefined);

  const categoriesOption =
    blogCategories.length > 0
      ? blogCategories.map((category: TBlogCategory) => ({
          value: category.id,
          label: category.name,
        }))
      : [];

  const handleSubmit = async (values: FormValues) => {
    try {
      const formData = new FormData();

      formData.append('title', values.title);
      formData.append('content', values.content);
      formData.append('summary', values.summary);
      formData.append('status', values.status);
      formData.append('categoryId', values.categoryId);

      formData.append('tags', JSON.stringify(values.tags));

      values.images.forEach((image) => {
        formData.append('images', image);
      });

      await createBlog(formData).unwrap();
      toast.success('Blog created successfully');
      router.push('/dashboard/blogs');
    } catch (error) {
      console.error('Failed to create blog:', error);
      toast.error('Failed to create blog');
    }
  };

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
        <h1 className='text-3xl font-bold'>Create Blog</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create New Blog</CardTitle>
          <CardDescription>
            Create a new blog post for your portfolio. Fill in the details
            below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormWrapper
            schema={formSchema}
            onSubmit={handleSubmit}
            defaultValues={{
              title: '',
              content: '',
              summary: '',
              tags: [],
              status: 'DRAFT',
              categoryId: '',
              images: [],
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
                name='categoryId'
                label='Category'
                placeholder='Select a category'
                options={categoriesOption}
                description='Select a category for your blog post'
              />

              <FormSelect
                name='tags'
                label='Tags'
                placeholder='Select or create tags'
                isMulti
                isCreatable
                options={[]}
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

            <FormImageUpload
              name='images'
              label='Blog Images'
              multiple
              maxFiles={5}
            />
            <div className='flex justify-end gap-4'>
              <Button
                type='button'
                variant='outline'
                onClick={() => router.push('/dashboard/blogs')}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={isCreatingBlogLoading}>
                {isCreatingBlogLoading && (
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                )}
                Create Blog
              </Button>
            </div>
          </FormWrapper>
        </CardContent>
      </Card>
    </div>
  );
}
