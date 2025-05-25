'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { toast } from 'sonner';
import { Plus, Loader2, Code, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  FormTextarea,
  FormImageUpload,
} from '@/components/form';
import {
  useGetProjectsQuery,
  useCreateProjectMutation,
  useDeleteProjectMutation,
  CreateProjectPayload,
} from '@/lib/redux/features/project/projectApiSlice';
import { useGetTechnologiesQuery } from '@/lib/redux/features/technology/technologyApiSlice';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProjectCard } from '@/components/project-card';
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

// Define form schema with Zod
const formSchema = z.object({
  title: z.string().min(2, { message: 'Title must be at least 2 characters' }),
  description: z
    .string()
    .min(10, { message: 'Description must be at least 10 characters' }),
  liveUrl: z
    .string()
    .url({ message: 'Please enter a valid URL' })
    .optional()
    .or(z.literal('')),
  githubUrl: z
    .string()
    .url({ message: 'Please enter a valid URL' })
    .optional()
    .or(z.literal('')),
  technologies: z
    .array(z.string())
    .min(1, { message: 'Please select at least one technology' }),
  status: z.enum(['ONGOING', 'COMPLETED']),
  images: z
    .array(z.any())
    .min(1, { message: 'Please upload at least one image' }),
});

type FormValues = z.infer<typeof formSchema>;

const statusOptions = [
  { value: 'ONGOING', label: 'Ongoing' },
  { value: 'COMPLETED', label: 'Completed' },
];

export default function ProjectsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  // Query parameters for API call
  const queryParams = {
    searchTerm: searchTerm || undefined,
    status: activeTab !== 'all' ? activeTab.toUpperCase() : undefined,
    page,
    limit,
  };

  const {
    data: projectsResponse = {
      data: [],
      meta: { page: 1, limit: 6, total: 0, totalPage: 1 },
    },
    isLoading: isLoadingProjects,
  } = useGetProjectsQuery(queryParams);

  const projects = projectsResponse.data || [];
  const meta: TMeta = projectsResponse.meta || {
    page: 1,
    limit: 6,
    total: 0,
    totalPage: 1,
  };

  const { data: technologiesData = [], isLoading: isLoadingTechnologies } =
    useGetTechnologiesQuery();

  const technologies = Array.isArray(technologiesData) ? technologiesData : [];

  const [createProject, { isLoading: isCreating }] = useCreateProjectMutation();
  const [deleteProject, { isLoading: isDeleting }] = useDeleteProjectMutation();

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [searchTerm, activeTab]);

  const technologyOptions = technologies.map((tech) => ({
    value: tech.name,
    label: tech.name,
  }));

  const handleSubmit = async (values: FormValues) => {
    try {
      const formData = new FormData();

      const payload: CreateProjectPayload = {
        title: values.title,
        description: values.description,
        technologies: values.technologies,
        status: values.status,
      };

      if (values.liveUrl) {
        payload.liveUrl = values.liveUrl;
      }

      if (values.githubUrl) {
        payload.githubUrl = values.githubUrl;
      }

      Object.entries(payload).forEach(([key, value]) => {
        if (key === 'technologies') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value as string);
        }
      });

      values.images.forEach((image) => {
        formData.append('images', image);
      });

      await createProject(formData as unknown as CreateProjectPayload).unwrap();
      toast.success('Project created successfully');
      router.refresh();
    } catch (error) {
      console.error('Failed to create project:', error);
      toast.error('Failed to create project');
    }
  };

  const openDeleteDialog = (id: string) => {
    setProjectToDelete(id);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setProjectToDelete(null);
  };

  const confirmDelete = async () => {
    if (!projectToDelete) return;

    try {
      await deleteProject(projectToDelete).unwrap();
      toast.success('Project deleted successfully');
      closeDeleteDialog();
    } catch (error) {
      console.error('Failed to delete project:', error);
      toast.error('Failed to delete project');
      closeDeleteDialog();
    }
  };

  // Generate pagination items
  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    const totalPages = meta.totalPage;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages are less than or equal to max visible pages
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink isActive={page === i} onClick={() => setPage(i)}>
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Always show first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink isActive={page === 1} onClick={() => setPage(1)}>
            1
          </PaginationLink>
        </PaginationItem>
      );

      // Show ellipsis if current page is more than 3
      if (page > 3) {
        items.push(
          <PaginationItem key='ellipsis-1'>
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Show pages around current page
      const startPage = Math.max(2, page - 1);
      const endPage = Math.min(totalPages - 1, page + 1);

      for (let i = startPage; i <= endPage; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink isActive={page === i} onClick={() => setPage(i)}>
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      // Show ellipsis if current page is less than totalPages - 2
      if (page < totalPages - 2) {
        items.push(
          <PaginationItem key='ellipsis-2'>
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Always show last page
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            isActive={page === totalPages}
            onClick={() => setPage(totalPages)}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold'>Projects</h1>
        <Button
          onClick={() =>
            document
              .getElementById('create-project-form')
              ?.scrollIntoView({ behavior: 'smooth' })
          }
        >
          <Plus className='mr-2 h-4 w-4' /> Add Project
        </Button>
      </div>

      {/* Search and filter section */}
      <div className='flex flex-col sm:flex-row gap-4'>
        <div className='relative flex-1'>
          <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
          <Input
            type='search'
            placeholder='Search projects...'
            className='pl-8'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue='all' value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value='all'>All</TabsTrigger>
          <TabsTrigger value='ongoing'>Ongoing</TabsTrigger>
          <TabsTrigger value='completed'>Completed</TabsTrigger>
        </TabsList>
        <TabsContent value={activeTab} className='mt-6'>
          {isLoadingProjects ? (
            <div className='flex justify-center py-10'>
              <Loader2 className='h-10 w-10 animate-spin text-primary' />
            </div>
          ) : projects.length === 0 ? (
            <div className='text-center py-10'>
              <Code className='h-10 w-10 mx-auto text-muted-foreground' />
              <h3 className='mt-4 text-lg font-medium'>No projects found</h3>
              <p className='text-muted-foreground mt-2'>
                {searchTerm
                  ? 'Try a different search term.'
                  : 'Get started by creating a new project.'}
              </p>
            </div>
          ) : (
            <>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {projects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onDelete={() => openDeleteDialog(project.id)}
                    onEdit={() =>
                      router.push(`/dashboard/projects/${project.id}/edit`)
                    }
                  />
                ))}
              </div>

              {/* Pagination */}
              {meta.totalPage > 1 && (
                <Pagination className='mt-8'>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                        aria-disabled={page === 1}
                        className={
                          page === 1 ? 'pointer-events-none opacity-50' : ''
                        }
                      />
                    </PaginationItem>

                    {renderPaginationItems()}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          setPage((prev) => Math.min(prev + 1, meta.totalPage))
                        }
                        aria-disabled={page === meta.totalPage}
                        className={
                          page === meta.totalPage
                            ? 'pointer-events-none opacity-50'
                            : ''
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>

      <Card id='create-project-form' className='mt-10'>
        <CardHeader>
          <CardTitle>Create New Project</CardTitle>
          <CardDescription>
            Add a new project to your portfolio. Fill in the details below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormWrapper
            schema={formSchema}
            onSubmit={handleSubmit}
            defaultValues={{
              title: '',
              description: '',
              liveUrl: '',
              githubUrl: '',
              technologies: [],
              status: 'ONGOING',
              images: [],
            }}
            className='space-y-6'
          >
            <FormInput
              name='title'
              label='Project Title'
              placeholder='Enter project title'
            />

            <FormTextarea
              name='description'
              label='Description'
              placeholder='Describe your project'
              rows={5}
            />

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <FormInput
                name='liveUrl'
                label='Live URL'
                placeholder='https://example.com'
              />

              <FormInput
                name='githubUrl'
                label='GitHub URL'
                placeholder='https://github.com/username/repo'
              />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <FormSelect
                name='technologies'
                label='Technologies'
                placeholder='Select technologies'
                options={technologyOptions}
                isMulti
                isCreatable
                description='Select or create technologies used in this project'
              />
              <FormSelect
                name='status'
                label='Status'
                placeholder='Select project status'
                options={statusOptions}
                description='Current status of the project'
              />
            </div>

            <FormImageUpload
              name='images'
              label='Project Images'
              maxFiles={5}
              multiple
            />

            <Button type='submit' disabled={isCreating}>
              {isCreating && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              Create Project
            </Button>
          </FormWrapper>
        </CardContent>
      </Card>

      <DeleteConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={closeDeleteDialog}
        onConfirm={confirmDelete}
        title='Delete Project'
        description='Are you sure you want to delete this project? This action cannot be undone.'
        isDeleting={isDeleting}
      />
    </div>
  );
}
