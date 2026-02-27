import { Project } from '@/types'
import Image from 'next/image';
import Link from 'next/link';
import './_projectCard.scss';

interface Props {
  project: Project;
}

export default function AdminProjectCard({ project }: Props) {
  return (
    <Link href={`/works/${project.slug}`} className="projectCard" >
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
      </picture>
      <h3>{project.title}</h3>
      <p>{project.client?.name || 'Personal'}</p>
    </Link>
  )
}
