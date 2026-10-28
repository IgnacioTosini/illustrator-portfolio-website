"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { Title } from "@/components/ui/Title/Title";
import { animateAboutSection } from "@/animations/gsap/aboutSection";
import { useLanguage } from "@/providers/LanguageProvider";
import './_aboutSection.scss';
import { HomeContent } from '@/types/home-content';

export default function AboutSection({ homeContent, localeOverride }: { homeContent?: HomeContent; localeOverride?: 'es' | 'en' }) {
  const aboutRef = useRef<HTMLDivElement | null>(null);
  const { t, locale: currentLocale } = useLanguage();
  const locale = localeOverride ?? currentLocale;
  const content = homeContent?.[locale].about;

  useGSAP(
    () => {
      if (!aboutRef.current) return;
      return animateAboutSection(aboutRef.current);
    },
    { scope: aboutRef }
  );

  return (
    <div ref={aboutRef} className="aboutSection" id="about">
      <Title title={content?.title ?? t("about.title")} subTitle={content?.subtitle ?? t("about.subtitle")} />
      <div className="aboutSectionContent">
        <Image
          src={homeContent?.aboutImage ?? '/alukkart.webp'}
          alt={content?.imageAlt ?? t("about.imageAlt")}
          width={500}
          height={500}
          quality={90}
          sizes="(max-width: 768px) 92vw, 500px"
        />

        <div className="aboutSectionText">
          {(content?.paragraphs ?? [t("about.paragraph1"), t("about.paragraph2"), t("about.paragraph3"), t("about.paragraph4")]).map((paragraph, index) => (
            <p key={`about-paragraph-${index}`}>{paragraph}</p>
          ))}
          <div className="aboutSectionAbilitiesTools">
            <div className="abilities">
              <h3>{content?.abilitiesTitle ?? t("about.abilitiesTitle")}</h3>
              <ul className="abilitiList">
                {(content?.abilities ?? ['Comic & cartoon', 'Pen & ink', 'Game', 'Concept art', 'Fan art', 'Anatomy, objects and people']).map((ability) => (
                  <li className="abilitie" key={ability}>{ability}</li>
                ))}
              </ul>
            </div>
            <div className="tools">
              <h3>{content?.toolsTitle ?? t("about.toolsTitle")}</h3>
              <ul className="toolList">
                {(content?.tools ?? ['Huion Kamvas 13', 'Clip Studio Paint', 'Photoshop']).map((tool) => (
                  <li className="tool" key={tool}>{tool}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
