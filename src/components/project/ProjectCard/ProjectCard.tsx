"use client";

import { Project } from '@/types'
import Image from 'next/image';
import Link from 'next/link';
import { useWorkRouteTransition } from '@/components/layout/WorkRouteTransition/WorkRouteTransition';
import './_projectCard.scss';

interface Props {
  project: Project;
  selectedClientParam?: string | null;
  selectedPageParam?: number;
  priority?: boolean;
  featuredLayout?: boolean;
}

export default function ProjectCard({ project, selectedClientParam = null, selectedPageParam = 1, priority = false, featuredLayout = false }: Props) {
  const navigateToWork = useWorkRouteTransition();
  const params = new URLSearchParams();
  if (selectedClientParam) params.set('client', selectedClientParam);
  if (selectedPageParam > 1) params.set('page', String(selectedPageParam));
  const query = params.toString();
  const href = `/works/${project.slug}${query ? `?${query}` : ''}`;

  return (
    <Link
      href={href}
      className={`projectCard${featuredLayout ? ' is-featured' : ''}`}
      scroll
      onClick={(event) => navigateToWork(event, {
        href,
        image: project.images?.[0]?.url || '/alukkart.webp',
        title: project.title,
        source: event.currentTarget.querySelector<HTMLElement>('.projectCardImageContainer') ?? undefined,
      })}
    >
      <div className='projectCardImageContainer'>
        <div className="projectCardImageMotion">
          <Image
            src={project.images?.[0]?.url || '/alukkart.webp'}
            alt={project.images?.[0]?.alt || project.title}
            width={1200}
            height={900}
            quality={85}
            sizes="(max-width: 640px) 92vw, (max-width: 980px) 46vw, 48vw"
            priority={priority}
            className='projectCardImage'
          />
        </div>
      </div>
      <div className="projectCardInfo">
        <span className="projectCardMeta">{project.category?.name || 'Ilustración'} <span aria-hidden="true">/</span> {project.year}</span>
        <h3>{project.title}</h3>
        {featuredLayout && project.description && <p className="projectCardDescription">{project.description}</p>}
        <div className="projectCardBottom">
          <span>{project.client?.name || 'Personal'}</span>
          <span className="projectCardArrow" aria-hidden="true">↗</span>
        </div>
      </div>
    </Link>
  )
}
