'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { toast } from 'sonner';
import { Plus, Loader2, FileText, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DeleteConfirmationDialog } from '@/components/delete-confirmation-dialog';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { TMeta } from '@/types/global.type';

import {
  useGetBlogsQuery,
  useDeleteBlogMutation,
} from '@/lib/redux/features/blog/blogApiSlice';
import { BlogCard } from '@/components/blog-card';

export default function BlogsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<string | null>(null);

  // Query parameters for API call
  const queryParams = {
    searchTerm: searchTerm || undefined,
    status: activeTab !== 'all' ? activeTab.toUpperCase() : undefined,
    page,
    limit,
  };

  const {
    data: blogsResponse = {
      data: [],
      meta: { page: 1, limit: 6, total: 0, totalPage: 1 },
    },
    isLoading: isLoadingBlogs,
  } = useGetBlogsQuery(queryParams);

  const blogs = blogsResponse.data || [];
  const meta: TMeta = blogsResponse.meta || {
    page: 1,
    limit: 6,
    total: 0,
    totalPage: 1,
  };

  const [deleteBlog, { isLoading: isDeleting }] = useDeleteBlogMutation();

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [searchTerm, activeTab]);

  const handleCreateBlog = () => {
    router.push('/dashboard/blogs/create');
  };

  const handleEditBlog = (id: string) => {
    router.push(`/dashboard/blogs/${id}`);
  };

  const handleDeleteClick = (id: string) => {
    setBlogToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!blogToDelete) return;

    try {
      await deleteBlog(blogToDelete).unwrap();
      toast.success('Blog deleted successfully');
      setDeleteDialogOpen(false);
      setBlogToDelete(null);
    } catch (error) {
      toast.error('Failed to delete blog');
    }
  };

  const renderPagination = () => {
    if (meta.totalPage <= 1) return null;

    return (
      <Pagination className='mt-6'>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              aria-disabled={page === 1}
              className={page === 1 ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>

          {Array.from({ length: meta.totalPage }, (_, i) => i + 1).map((p) => {
            // Show first page, last page, current page, and pages around current page
            if (
              p === 1 ||
              p === meta.totalPage ||
              (p >= page - 1 && p <= page + 1)
            ) {
              return (
                <PaginationItem key={p}>
                  <PaginationLink
                    isActive={page === p}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              );
            }

            // Show ellipsis for gaps
            if (p === 2 || p === meta.totalPage - 1) {
              return (
                <PaginationItem key={p}>
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }

            return null;
          })}

          <PaginationItem>
            <PaginationNext
              onClick={() => setPage((p) => Math.min(meta.totalPage, p + 1))}
              aria-disabled={page === meta.totalPage}
              className={
                page === meta.totalPage ? 'pointer-events-none opacity-50' : ''
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  return (
    <div className='space-y-4 md:space-y-6'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-2xl md:text-3xl font-bold tracking-tight'>
            Blogs
          </h1>
          <p className='text-muted-foreground mt-2 text-sm md:text-base'>
            Manage your blog posts here.
          </p>
        </div>
        <Button onClick={handleCreateBlog}>
          <Plus className='mr-2 h-4 w-4' /> Create Blog
        </Button>
      </div>

      <div className='flex flex-col md:flex-row gap-4 items-center justify-between'>
        <Tabs
          defaultValue='all'
          value={activeTab}
          onValueChange={setActiveTab}
          className='w-full md:w-auto'
        >
          <TabsList className='grid grid-cols-3 w-full md:w-auto'>
            <TabsTrigger value='all'>All</TabsTrigger>
            <TabsTrigger value='published'>Published</TabsTrigger>
            <TabsTrigger value='draft'>Drafts</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className='relative w-full md:w-64'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='Search blogs...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='pl-10'
          />
        </div>
      </div>

      {isLoadingBlogs ? (
        <div className='flex justify-center items-center py-12'>
          <Loader2 className='h-8 w-8 animate-spin text-primary' />
        </div>
      ) : blogs.length > 0 ? (
        <>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6'>
            {blogs.map((blog) => (
              <BlogCard
                key={blog.id}
                blog={blog}
                onEdit={() => handleEditBlog(blog.id)}
                onDelete={() => handleDeleteClick(blog.id)}
              />
            ))}
          </div>
          {renderPagination()}
        </>
      ) : (
        <Card className='bg-muted/40'>
          <CardContent className='flex flex-col items-center justify-center py-12'>
            <FileText className='h-12 w-12 text-muted-foreground mb-4' />
            <h3 className='text-lg font-medium mb-2'>No blogs found</h3>
            <p className='text-muted-foreground text-center max-w-md mb-4'>
              {searchTerm
                ? `No blogs matching "${searchTerm}" were found.`
                : activeTab !== 'all'
                ? `You don't have any ${activeTab.toLowerCase()} blogs yet.`
                : "You haven't created any blogs yet."}
            </p>
            <Button onClick={handleCreateBlog}>
              <Plus className='mr-2 h-4 w-4' /> Create your first blog
            </Button>
          </CardContent>
        </Card>
      )}

      <DeleteConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
        title='Delete Blog'
        description='Are you sure you want to delete this blog? This action cannot be undone.'
      />
    </div>
  );
}
