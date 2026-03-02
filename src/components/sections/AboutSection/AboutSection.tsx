"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { Title } from "@/components/ui/Title/Title";
import { animateAboutSection } from "@/animations/gsap/aboutSection";
import { useLanguage } from "@/providers/LanguageProvider";
import './_aboutSection.scss';

export default function AboutSection() {
  const aboutRef = useRef<HTMLDivElement | null>(null);
  const { t } = useLanguage();

  useGSAP(
    () => {
      if (!aboutRef.current) return;
      return animateAboutSection(aboutRef.current);
    },
    { scope: aboutRef }
  );

  return (
    <div ref={aboutRef} className="aboutSection" id="about">
      <Title title={t("about.title")} subTitle={t("about.subtitle")} />
      <div className="aboutSectionContent">
        <Image
          src={'/alukkart.webp'}
          alt={t("about.imageAlt")}
          width={500}
          height={500}
        />

        <div className="aboutSectionText">
          <p>{t("about.paragraph1")}</p>

          <p>{t("about.paragraph2")}</p>

          <p>{t("about.paragraph3")}</p>

          <p>{t("about.paragraph4")}</p>
          <div className="aboutSectionAbilitiesTools">
            <div className="abilities">
              <h3>{t("about.abilitiesTitle")}</h3>
              <ul className="abilitiList">
                <li className="abilitie">Comic & cartoon</li>
                <li className="abilitie">Pen & ink</li>
                <li className="abilitie">Game</li>
                <li className="abilitie">Concept art</li>
                <li className="abilitie">Fan art</li>
                <li className="abilitie">Anatomy, objects and people</li>
              </ul>
            </div>
            <div className="tools">
              <h3>{t("about.toolsTitle")}</h3>
              <ul className="toolList">
                <li className="tool">Huion Kamvas 13</li>
                <li className="tool">Clip Studio Paint</li>
                <li className="tool">Photoshop</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
