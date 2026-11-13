"use client";

import { useState } from 'react';
import { Project } from '@/types'
import Image from 'next/image';
import Link from 'next/link';
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from 'motion/react';
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
  const [isPortrait, setIsPortrait] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const tiltX = useSpring(useMotionValue(0), { stiffness: 180, damping: 24 });
  const tiltY = useSpring(useMotionValue(0), { stiffness: 180, damping: 24 });
  const imageScale = useSpring(useMotionValue(1), { stiffness: 180, damping: 24 });
  const lightX = useMotionValue(50);
  const lightY = useMotionValue(50);
  const light = useMotionTemplate`radial-gradient(circle at ${lightX}% ${lightY}%, rgba(255, 255, 255, .38), transparent 55%)`;
  const params = new URLSearchParams();
  if (selectedClientParam) params.set('client', selectedClientParam);
  if (selectedPageParam > 1) params.set('page', String(selectedPageParam));
  const query = params.toString();
  const href = `/works/${project.slug}${query ? `?${query}` : ''}`;

  return (
    <Link
      href={href}
      className={`projectCard${featuredLayout ? ' is-featured' : ''}${isPortrait ? ' is-portrait' : ''}`}
      scroll
      onPointerMove={(event) => {
        if (shouldReduceMotion || event.pointerType === 'touch') return;
        const bounds = event.currentTarget.querySelector('.projectCardImageContainer')?.getBoundingClientRect();
        if (!bounds || !bounds.width || !bounds.height) return;
        const x = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
        const y = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height));
        tiltX.set((0.5 - y) * 12);
        tiltY.set((x - 0.5) * 12);
        imageScale.set(isPortrait ? 1.025 : 1.08);
        lightX.set(x * 100);
        lightY.set(y * 100);
      }}
      onPointerLeave={() => {
        tiltX.set(0);
        tiltY.set(0);
        imageScale.set(1);
      }}
      onClick={(event) => navigateToWork(event, {
        href,
        image: project.images?.[0]?.url || '/alukkart.webp',
        title: project.title,
        source: event.currentTarget.querySelector<HTMLElement>('.projectCardImageContainer') ?? undefined,
      })}
    >
      <div className='projectCardImageContainer'>
        <div className="projectCardImageMotion">
          <motion.div className={`projectCardArt${isPortrait ? ' is-portrait' : ''}`} style={{ rotateX: tiltX, rotateY: tiltY, scale: imageScale, transformPerspective: 900 }}>
            <Image
              src={project.images?.[0]?.url || '/alukkart.webp'}
              alt={project.images?.[0]?.alt || project.title}
              fill
              quality={85}
              sizes="(max-width: 640px) 92vw, (max-width: 980px) 46vw, 48vw"
              priority={priority}
              className='projectCardImage'
              onLoad={(event) => setIsPortrait(event.currentTarget.naturalHeight > event.currentTarget.naturalWidth)}
            />
          </motion.div>
          <motion.span className="projectCardLight" style={{ background: light }} aria-hidden="true" />
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
