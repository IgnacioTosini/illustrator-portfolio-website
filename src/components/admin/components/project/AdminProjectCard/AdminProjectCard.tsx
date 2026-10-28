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
    <article className="projectCard">
      <div className='projectCardImageContainer'>
        {project.images?.[0]?.url ? (
          <Image
            src={project.images[0].url}
            alt={project.images[0].alt || project.title}
            width={400}
            height={400}
            className='projectCardImage'
          />
        ) : <div className="projectCardImagePlaceholder">{project.title.slice(0, 1)}</div>}
        {project.featured && <span className="projectFeaturedBadge">Destacado</span>}
      </div>
      <div className="projectCardDetails">
        <div className="projectCardHeading">
          <div>
            <h2>{project.title}</h2>
            <p>{project.client?.name || 'Personal'} <span aria-hidden="true">·</span> {project.category?.name}</p>
          </div>
          <span className="projectCardYear">{project.year}</span>
        </div>
        <div className="projectCardActions">
          <Link href={`/dashboard/projects/${project.slug}`} className="projectEditAction">Editar proyecto <span aria-hidden="true">↗</span></Link>
          <button
            type="button"
            className="projectDeleteAction"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {isPending || deleteMutation.isPending ? 'Eliminando…' : 'Eliminar'}
          </button>
        </div>
      </div>
    </article>
  )
}
