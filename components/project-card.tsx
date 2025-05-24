import Image from 'next/image';
import { Edit, Trash2, ExternalLink, Github } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Project } from '@/lib/redux/features/project/projectApiSlice';

type ProjectCardProps = {
  project: Project;
  onEdit: () => void;
  onDelete: () => void;
};

export function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  return (
    <Card className='overflow-hidden h-full flex flex-col'>
      <div className='relative h-48 w-full'>
        {project.images && project.images.length > 0 ? (
          <Image
            src={project.images[0]}
            alt={project.title}
            fill
            className='object-cover'
          />
        ) : (
          <div className='h-full w-full bg-muted flex items-center justify-center'>
            <span className='text-muted-foreground'>No image</span>
          </div>
        )}
        <div className='absolute top-2 right-2'>
          <Badge
            variant={project.status === 'COMPLETED' ? 'default' : 'secondary'}
          >
            {project.status === 'COMPLETED' ? 'Completed' : 'Ongoing'}
          </Badge>
        </div>
      </div>
      <CardContent className='flex-1 p-4'>
        <h3 className='text-lg font-semibold mb-2'>{project.title}</h3>
        <p className='text-muted-foreground text-sm mb-4 line-clamp-3'>
          {project.description}
        </p>
        <div className='flex flex-wrap gap-1 mt-2'>
          {project.technologies.map((tech, index) => (
            <Badge key={index} variant='outline' className='text-xs'>
              {tech}
            </Badge>
          ))}
        </div>
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
        <div className='flex space-x-2'>
          {project.liveUrl && (
            <Button variant='outline' size='icon' asChild>
              <a
                href={project.liveUrl}
                target='_blank'
                rel='noopener noreferrer'
              >
                <ExternalLink className='h-4 w-4' />
              </a>
            </Button>
          )}
          {project.githubUrl && (
            <Button variant='outline' size='icon' asChild>
              <a
                href={project.githubUrl}
                target='_blank'
                rel='noopener noreferrer'
              >
                <Github className='h-4 w-4' />
              </a>
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
