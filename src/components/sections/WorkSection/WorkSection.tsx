"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { Project } from '@/types';
import { Title } from '@/components/ui/Title/Title';
import { ProjectList } from '@/components/project/ProjectList/ProjectList';
import { animateWorkSection } from '@/animations/gsap/workSection';
import './_workSection.scss';

interface Props {
  projects: Project[];
}

export default function WorkSection({ projects }: Props) {
  const workRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      if (!workRef.current) return;
      return animateWorkSection(workRef.current);
    },
    { scope: workRef }
  );

  return (
    <div ref={workRef} className='workSection' id="works">
      <Title title={"Trabajos Seleccionados"} subTitle={"Proyectos Recientes"} />
      <ProjectList projects={projects} />
    </div>
  )
}
