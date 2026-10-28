"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { Project } from '@/types';
import { Title } from '@/components/ui/Title/Title';
import { ProjectList } from '@/components/project/ProjectList/ProjectList';
import { animateWorkSection } from '@/animations/gsap/workSection';
import { useLanguage } from "@/providers/LanguageProvider";
import Link from "next/link";
import './_workSection.scss';
import { HomeContent } from '@/types/home-content';
import NarrativeGallery from './NarrativeGallery';

interface Props {
  projects: Project[];
  homeContent?: HomeContent;
  localeOverride?: 'es' | 'en';
  preview?: boolean;
}

export default function WorkSection({ projects, homeContent, localeOverride, preview = false }: Props) {
  const workRef = useRef<HTMLDivElement | null>(null);
  const { t, locale: currentLocale } = useLanguage();
  const locale = localeOverride ?? currentLocale;
  const content = homeContent?.[locale].workSection;
  const narrativeProjects = projects.filter((project) => project.images[0]?.url).slice(0, 3);
  const narrativeIds = new Set(narrativeProjects.map((project) => project.id));
  const remainingProjects = projects.filter((project) => !narrativeIds.has(project.id));

  useGSAP(
    () => {
      if (!workRef.current || preview) return;
      return animateWorkSection(workRef.current);
    },
    { scope: workRef, dependencies: [preview] }
  );

  return (
    <div ref={workRef} className='workSection' id="works">
      <Title title={content?.title ?? t("workSection.title")} subTitle={content?.subtitle ?? t("workSection.subtitle")} />
      {narrativeProjects.length > 0 && <NarrativeGallery projects={narrativeProjects} locale={locale} preview={preview} />}
      {remainingProjects.length > 0 && (
        <div className="workMoreProjects">
          {narrativeProjects.length > 0 && <h3>{locale === 'es' ? 'Más proyectos' : 'More projects'}</h3>}
          <ProjectList projects={remainingProjects} />
        </div>
      )}
      {projects.length === 0 && <ProjectList projects={projects} />}
      {projects.length > 0 && (
        <Link href="/works" className="workAllProjectsLink">
          {locale === 'es' ? 'Ver todos los trabajos' : 'View all works'} <span aria-hidden="true">↗</span>
        </Link>
      )}
    </div>
  )
}
