import { Project } from '@/types'
import Image from 'next/image';
import Link from 'next/link';
import './_projectCard.scss';

interface Props {
  project: Project;
  selectedClientParam?: string | null;
  priority?: boolean;
}

export default function ProjectCard({ project, selectedClientParam = null, priority = false }: Props) {
  const href = selectedClientParam
    ? {
      pathname: `/works/${project.slug}`,
      query: { client: selectedClientParam },
    }
    : `/works/${project.slug}`;

  return (
    <Link href={href} className="projectCard" scroll>
      <div className='projectCardImageContainer'>
        {project.images?.[0].url && (
          <Image
            src={project.images[0].url}
            alt={project.images[0].alt || project.title}
            width={400}
            height={400}
            sizes="(max-width: 640px) 92vw, (max-width: 1200px) 45vw, 400px"
            priority={priority}
            className='projectCardImage'
          />
        )}
        <div className='projectCardContent'>
          <h3>{project.title}</h3>
          <p>{project.client?.name || 'Personal'}</p>
        </div>
      </div>
      <h3>{project.title}</h3>
      <p>{project.client?.name || 'Personal'}</p>
    </Link>
  )
}
