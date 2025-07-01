'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { skipToken } from '@reduxjs/toolkit/query';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { DeleteConfirmationDialog } from '@/components/delete-confirmation-dialog';
import { Loading } from '@/components/ui/loading';
import { EmptyState } from '@/components/ui/empty-state';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

import {
  useGetSkillsQuery,
  useDeleteSkillMutation,
  useGetSkillCategoriesQuery,
  SkillCategory,
} from '@/lib/redux/features/skill/skillApiSlice';

export default function SkillsPage() {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [skillToDelete, setSkillToDelete] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const { data: categories = [], isLoading: isLoadingCategories } =
    useGetSkillCategoriesQuery();
  const { data: allSkills = [], isLoading: isLoadingAll } =
    useGetSkillsQuery(undefined);
  const [deleteSkill, { isLoading: isDeleting }] = useDeleteSkillMutation();

  const handleCreateClick = () => {
    router.push('/dashboard/skills/create');
  };

  const handleEditClick = (id: string) => {
    router.push(`/dashboard/skills/edit/${id}`);
  };

  const handleDeleteClick = (id: string) => {
    setSkillToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!skillToDelete) return;
    try {
      await deleteSkill(skillToDelete).unwrap();
      toast.success('Skill deleted successfully');
      setDeleteDialogOpen(false);
      setSkillToDelete(null);
    } catch {
      toast.error('Failed to delete skill');
    }
  };

  if (isLoadingAll) {
    return <Loading fullScreen text='Loading skills...' />;
  }

  return (
    <div className='container py-6 space-y-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-3xl font-bold'>Skills</h1>
        <Button onClick={handleCreateClick}>
          <Plus className='mr-2 h-4 w-4' /> Add Skill
        </Button>
      </div>

      <Separator />

      <Tabs
        value={activeCategory}
        onValueChange={setActiveCategory}
        className='w-full'
      >
        <TabsList className='mb-4'>
          <TabsTrigger value='all'>All</TabsTrigger>
          {categories.map((cat: SkillCategory) => (
            <TabsTrigger key={cat.id} value={cat.id}>
              {cat.name}
            </TabsTrigger>
          ))}
        </TabsList>
        {/* All Skills Tab */}
        <TabsContent value='all' className='space-y-8'>
          {isLoadingAll || isLoadingCategories ? (
            <Loading fullScreen text='Loading skills...' />
          ) : allSkills.length === 0 ? (
            <EmptyState
              title='No skills found'
              description='Get started by creating your first skill'
              action={{
                label: 'Add Skill',
                onClick: handleCreateClick,
              }}
            />
          ) : (
            <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
              {allSkills.map((skill) => (
                <Card key={skill.id} className='flex flex-col'>
                  <CardHeader>
                    <div className='flex justify-between items-start'>
                      <CardTitle>{skill.name}</CardTitle>
                      <Badge variant='outline'>{skill.proficiency}%</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className='w-full bg-gray-200 rounded-full h-2.5'>
                      <div
                        className='bg-blue-600 h-2.5 rounded-full'
                        style={{ width: `${skill.proficiency}%` }}
                      ></div>
                    </div>
                  </CardContent>
                  <CardFooter className='flex justify-end space-x-2 mt-auto'>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => handleEditClick(skill.id)}
                    >
                      <Pencil className='h-4 w-4' />
                    </Button>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => handleDeleteClick(skill.id)}
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        {/* Category Tabs */}
        {categories.map((cat) => {
          const filteredSkills = allSkills.filter(
            (skill) => skill.categoryId === cat.id
          );
          return (
            <TabsContent key={cat.id} value={cat.id} className='space-y-8'>
              {isLoadingAll || isLoadingCategories ? (
                <Loading fullScreen text='Loading skills...' />
              ) : filteredSkills.length === 0 ? (
                <EmptyState
                  title='No skills found'
                  description='Get started by creating your first skill'
                  action={{
                    label: 'Add Skill',
                    onClick: handleCreateClick,
                  }}
                />
              ) : (
                <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
                  {filteredSkills.map((skill) => (
                    <Card key={skill.id} className='flex flex-col'>
                      <CardHeader>
                        <div className='flex justify-between items-start'>
                          <CardTitle>{skill.name}</CardTitle>
                          <Badge variant='outline'>{skill.proficiency}%</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className='w-full bg-gray-200 rounded-full h-2.5'>
                          <div
                            className='bg-blue-600 h-2.5 rounded-full'
                            style={{ width: `${skill.proficiency}%` }}
                          ></div>
                        </div>
                      </CardContent>
                      <CardFooter className='flex justify-end space-x-2 mt-auto'>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => handleEditClick(skill.id)}
                        >
                          <Pencil className='h-4 w-4' />
                        </Button>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => handleDeleteClick(skill.id)}
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          );
        })}
      </Tabs>

      <DeleteConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        title='Delete Skill'
        description='Are you sure you want to delete this skill? This action cannot be undone.'
        isDeleting={isDeleting}
      />
    </div>
  );
}
