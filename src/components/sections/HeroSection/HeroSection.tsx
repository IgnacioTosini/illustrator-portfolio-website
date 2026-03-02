"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { IoMdArrowRoundDown } from "react-icons/io";
import { Title } from "@/components/ui/Title/Title";
import { animateHeroSection } from "@/animations/gsap/heroSection";
import { useLanguage } from "@/providers/LanguageProvider";
import Link from "next/link";
import './_heroSection.scss';

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement | null>(null);
  const { t } = useLanguage();

  useGSAP(
    () => {
      if (!heroRef.current) return;
      return animateHeroSection(heroRef.current);
    },
    { scope: heroRef }
  );

  return (
    <div ref={heroRef} className="heroSection">
      <div className="heroImageReveal">
        <Image src={'/alukkart.webp'} alt="Alukkart" width={550} height={500} />
      </div>

      <Title headingLevel={1} title={t("hero.title")} subTitle={t("hero.subtitle")} />
      <div className="heroSectionButton">
        <Link href={'/#works'} className="viewButton">
          <span>{t("hero.ctaViewWorks")}</span> <IoMdArrowRoundDown />
        </Link>
      </div>
    </div>
  )
}
