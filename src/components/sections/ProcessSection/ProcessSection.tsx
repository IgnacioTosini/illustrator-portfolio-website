"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { Title } from '@/components/ui/Title/Title';
import { ProcessCard } from './ProcessCard/ProcessCard';
import { IoDocumentTextOutline, IoPencilOutline } from 'react-icons/io5';
import { LuSend } from 'react-icons/lu';
import { GiPapers } from 'react-icons/gi';
import { animateProcessSection } from '@/animations/gsap/processSection';
import { useLanguage } from "@/providers/LanguageProvider";
import './_processSection.scss';

export default function ProcessSection() {
  const processRef = useRef<HTMLDivElement | null>(null);
  const { t } = useLanguage();

  useGSAP(
    () => {
      if (!processRef.current) return;
      return animateProcessSection(processRef.current);
    },
    { scope: processRef }
  );

  return (
    <div ref={processRef} className='processSection' id={'process'}>
      <Title title={t("process.title")} subTitle={t("process.subtitle")} />
      <div className='processCardsContainer'>
        <ProcessCard number={'01'} title={t("process.step1Title")} description={t("process.step1Description")} icon={<IoDocumentTextOutline className='icon' />} />
        <ProcessCard number={'02'} title={t("process.step2Title")} description={t("process.step2Description")} icon={<IoPencilOutline className='icon' />} />
        <ProcessCard number={'03'} title={t("process.step3Title")} description={t("process.step3Description")} icon={<GiPapers className='icon' />} />
        <ProcessCard number={'04'} title={t("process.step4Title")} description={t("process.step4Description")} icon={<LuSend className='icon' />} />
      </div>
    </div>
  )
}
