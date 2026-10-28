"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { IoMdArrowRoundDown } from "react-icons/io";
import { Title } from "@/components/ui/Title/Title";
import { animateHeroSection } from "@/animations/gsap/heroSection";
import { useLanguage } from "@/providers/LanguageProvider";
import { useOptionalWorkRouteTransition } from "@/components/layout/WorkRouteTransition/WorkRouteTransition";
import { useOptionalSectionNavigation } from "@/components/layout/SectionNavigation/SectionNavigation";
import Link from "next/link";
import './_heroSection.scss';
import { HomeContent } from '@/types/home-content';
import type { Project } from '@/types';

export default function HeroSection({ homeContent, featuredProject, preview = false, localeOverride }: { homeContent?: HomeContent; featuredProject?: Project; preview?: boolean; localeOverride?: 'es' | 'en' }) {
  const heroRef = useRef<HTMLDivElement | null>(null);
  const { t, locale: currentLocale } = useLanguage();
  const navigateToWork = useOptionalWorkRouteTransition();
  const sectionNavigation = useOptionalSectionNavigation();
  const locale = localeOverride ?? currentLocale;
  const content = homeContent?.[locale].hero;

  useGSAP(
    () => {
      if (!heroRef.current || preview) return;
      return animateHeroSection(heroRef.current, { preview: preview || !featuredProject });
    },
    { scope: heroRef, dependencies: [preview, Boolean(featuredProject)] }
  );

  return (
    <div className="heroStage">
      <div ref={heroRef} className="heroSection">
        <div className="heroScrollScene" aria-hidden="true">
          <Image
            src={featuredProject?.images[0]?.url ?? homeContent?.heroImage ?? '/alukkart.webp'}
            alt=""
            fill
            quality={90}
            sizes="100vw"
            className="heroScrollImage"
          />
          <div className="heroScrollShade" />
        </div>

        <div className="heroImageReveal">
          <Image
            src={homeContent?.heroImage ?? '/alukkart.webp'}
            alt={content?.title ?? 'Alukkart'}
            width={550}
            height={550}
            quality={90}
            priority
            sizes="(max-width: 768px) 86vw, 550px"
            className="heroPortraitImage"
          />
          {featuredProject?.images[0]?.url && (
            <Image
              src={featuredProject.images[0].url}
              alt={featuredProject.images[0].alt ?? featuredProject.title}
              fill
              quality={90}
              priority
              sizes="(max-width: 768px) 86vw, 550px"
              className="heroFeaturedImage"
            />
          )}
        </div>

        <div className="heroCopy">
          <Title headingLevel={1} title={content?.title ?? t("hero.title")} subTitle={content?.subtitle ?? t("hero.subtitle")} />
          <p className="heroProof">{content?.proof ?? t("hero.proof")}</p>
          <div className="heroSectionButton">
            <a href="#works" className="viewButton">
              <span>{content?.ctaViewWorks ?? t("hero.ctaViewWorks")}</span> <IoMdArrowRoundDown />
            </a>
            <Link
              href={preview ? '#contact' : '/#contact'}
              className="contactButton"
              onClick={(event) => {
                if (!preview) sectionNavigation?.navigateSection(event, '/#contact');
              }}
            >
              <span>{content?.ctaContact ?? t("hero.ctaContact")}</span>
            </Link>
          </div>
        </div>

        {featuredProject && (
          <div className="heroProjectPreview">
            <p className="heroProjectEyebrow">{locale === 'es' ? '01 / Proyecto destacado' : '01 / Featured project'}</p>
            <p className="heroProjectTitle">{featuredProject.title}</p>
            <p className="heroProjectMeta">{featuredProject.category.name} · {featuredProject.year}</p>
            <Link
              href={`/works/${featuredProject.slug}`}
              className="heroProjectCta"
              onClick={(event) => {
                if (preview || !navigateToWork) return;
                navigateToWork(event, {
                  href: `/works/${featuredProject.slug}`,
                  image: featuredProject.images[0]?.url || '/alukkart.webp',
                  title: featuredProject.title,
                  source: heroRef.current?.querySelector<HTMLElement>('.heroImageReveal') ?? undefined,
                });
              }}
            >
              {locale === 'es' ? 'Explorar proyecto' : 'Explore project'}
              <span aria-hidden="true">↗</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
