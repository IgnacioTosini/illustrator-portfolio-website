"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/types";
import { animateNarrativeGallery } from "@/animations/gsap/narrativeGallery";
import { useOptionalWorkRouteTransition } from "@/components/layout/WorkRouteTransition/WorkRouteTransition";
import "./_narrativeGallery.scss";

interface Props {
  projects: Project[];
  locale: "es" | "en";
  preview?: boolean;
}

export default function NarrativeGallery({ projects, locale, preview = false }: Props) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const navigateToWork = useOptionalWorkRouteTransition();

  useGSAP(() => {
    if (!viewportRef.current || preview || projects.length === 0) return;
    return animateNarrativeGallery(viewportRef.current);
  }, { scope: viewportRef, dependencies: [preview, projects.length] });

  return (
    <div className={`narrativeStage${preview ? " narrativeStagePreview" : ""}`}>
      <div className="narrativeViewport" ref={viewportRef}>
        {projects.map((project, index) => {
          const image = project.images[0];
          const description = project.description.trim();
          const excerpt = description.length > 190 ? `${description.slice(0, 187).trimEnd()}…` : description;

          return (
            <article className="narrativePanel" key={project.id}>
              <div className="narrativeArtwork">
                <Image
                  src={image.url}
                  alt={image.alt || project.title}
                  fill
                  quality={90}
                  sizes="(max-width: 899px) 92vw, 60vw"
                  priority={index === 0}
                  draggable={false}
                />
              </div>
              <div className="narrativeContent">
                <p className="narrativeIndex">{String(index + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}</p>
                <p className="narrativeCategory">{project.category.name} · {project.year}</p>
                <h3>{project.title}</h3>
                {excerpt && <p className="narrativeDescription">{excerpt}</p>}
                <Link
                  href={`/works/${project.slug}`}
                  className="narrativeLink"
                  onClick={(event) => {
                    if (preview || !navigateToWork) return;
                    navigateToWork(event, {
                      href: `/works/${project.slug}`,
                      image: image.url,
                      title: project.title,
                      source: event.currentTarget.closest<HTMLElement>('.narrativePanel')?.querySelector<HTMLElement>('.narrativeArtwork') ?? undefined,
                    });
                  }}
                >
                  {locale === "es" ? "Ver proyecto" : "View project"} <span aria-hidden="true">↗</span>
                </Link>
              </div>
            </article>
          );
        })}
        {projects.length > 1 && <div className="narrativeProgress" aria-hidden="true"><span /></div>}
      </div>
    </div>
  );
}
