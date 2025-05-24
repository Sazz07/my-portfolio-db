'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { toast } from 'sonner';
import { Plus, Loader2, Code } from 'lucide-react';
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
  images: z
    .array(z.any())
    .min(1, { message: 'Please upload at least one image' }),
});

type FormValues = z.infer<typeof formSchema>;

export default function ProjectsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('all');

  // Ensure projects is always an array
  const { data: projectsData = [], isLoading: isLoadingProjects } =
    useGetProjectsQuery();

  const projects = Array.isArray(projectsData) ? projectsData : [];
  console.log(projects);

  // Ensure technologies is always an array
  const { data: technologiesData = [], isLoading: isLoadingTechnologies } =
    useGetTechnologiesQuery();

  const technologies = Array.isArray(technologiesData) ? technologiesData : [];

  const [createProject, { isLoading: isCreating }] = useCreateProjectMutation();
  const [deleteProject, { isLoading: isDeleting }] = useDeleteProjectMutation();

  // Now this will be safe
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

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(id).unwrap();
        toast.success('Project deleted successfully');
      } catch (error) {
        console.error('Failed to delete project:', error);
        toast.error('Failed to delete project');
      }
    }
  };

  const filteredProjects = Array.isArray(projects)
    ? activeTab === 'all'
      ? projects
      : projects.filter((project) => project.status === activeTab.toUpperCase())
    : [];

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
          ) : filteredProjects.length === 0 ? (
            <div className='text-center py-10'>
              <Code className='h-10 w-10 mx-auto text-muted-foreground' />
              <h3 className='mt-4 text-lg font-medium'>No projects found</h3>
              <p className='text-muted-foreground mt-2'>
                Get started by creating a new project.
              </p>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onDelete={() => handleDelete(project.id)}
                  onEdit={() =>
                    router.push(`/dashboard/projects/${project.id}/edit`)
                  }
                />
              ))}
            </div>
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

            <FormSelect
              name='technologies'
              label='Technologies'
              placeholder='Select technologies'
              options={technologyOptions}
              isMulti
              isCreatable
              description='Select or create technologies used in this project'
            />

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
    </div>
  );
}
