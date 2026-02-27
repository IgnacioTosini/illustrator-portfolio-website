'use client'

import { Project } from '@/types'
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useDeleteProjectMutation } from '@/hooks/project/useDeleteProjectMutation';
import { toast } from 'react-toastify';
import './_adminProjectCard.scss';

interface Props {
  project: Project;
}

export default function AdminProjectCard({ project }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const deleteMutation = useDeleteProjectMutation();

  const handleDelete = () => {
    if (!confirm(`¿Eliminar el proyecto "${project.title}"?`)) {
      return;
    }

    startTransition(async () => {
      try {
        await deleteMutation.mutateAsync(project.id);
        toast.success('Proyecto eliminado');
        router.refresh();
      } catch (error) {
        console.error('Error al eliminar proyecto:', error);
        toast.error('Error al eliminar proyecto');
      }
    });
  };

  return (
    <article className="projectCard" >
      <picture className='projectCardImageContainer'>
        {project.images?.[0].url && (
          <Image
            src={project.images[0].url}
            alt={project.images[0].alt || project.title}
            width={400}
            height={400}
            className='projectCardImage'
          />
        )}
        <div className='projectCardContent'>
          <h3>{project.title}</h3>
          <p>{project.client?.name || 'Personal'}</p>
        </div>

        <div className='projectCardOverlay'>
          <Link href={`/dashboard/projects/${project.slug}`} className='overlayButton'>
            Editar
          </Link>
          <button
            type="button"
            className='overlayButton overlayButton--danger'
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {isPending ? 'Eliminando...' : 'Eliminar'}
          </button>
        </div>
      </picture>
      <h3>{project.title}</h3>
      <p>{project.client?.name || 'Personal'}</p>
    </article>
  )
}
