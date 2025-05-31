import Image from 'next/image';
import { Edit, Trash2, Calendar } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Blog } from '@/lib/redux/features/blog/blogApiSlice';

type BlogCardProps = {
  blog: Blog;
  onEdit: () => void;
  onDelete: () => void;
};

export function BlogCard({ blog, onEdit, onDelete }: BlogCardProps) {
  // Format date
  const formattedDate = new Date(blog.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  // Get status badge variant
  const getStatusVariant = () => {
    switch (blog.status) {
      case 'PUBLISHED':
        return 'default';
      case 'DRAFT':
        return 'secondary';
      case 'ARCHIVED':
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <Card className='overflow-hidden h-full flex flex-col'>
      <div className='relative h-48 w-full'>
        {blog.featuredImage ? (
          <Image
            src={blog.featuredImage}
            alt={blog.title}
            fill
            className='object-cover'
          />
        ) : (
          <div className='h-full w-full bg-muted flex items-center justify-center'>
            <span className='text-muted-foreground'>No featured image</span>
          </div>
        )}
        <div className='absolute top-2 right-2'>
          <Badge variant={getStatusVariant()}>
            {blog.status.charAt(0) + blog.status.slice(1).toLowerCase()}
          </Badge>
        </div>
      </div>
      <CardContent className='flex-1 p-4'>
        <h3 className='text-lg font-semibold mb-2'>{blog.title}</h3>
        {blog.summary && (
          <p className='text-muted-foreground text-sm mb-4 line-clamp-3'>
            {blog.summary}
          </p>
        )}
        <div className='flex items-center text-xs text-muted-foreground mb-2'>
          <Calendar className='h-3 w-3 mr-1' />
          <span>{formattedDate}</span>
        </div>
        {blog.tags && blog.tags.length > 0 && (
          <div className='flex flex-wrap gap-1 mt-2'>
            {blog.tags.map((tag, index) => (
              <Badge key={index} variant='outline' className='text-xs'>
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className='p-4 pt-0 flex justify-between'>
        <div className='flex space-x-2'>
          <Button variant='outline' size='icon' onClick={onEdit}>
            <Edit className='h-4 w-4' />
          </Button>
          <Button variant='outline' size='icon' onClick={onDelete}>
            <Trash2 className='h-4 w-4' />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
