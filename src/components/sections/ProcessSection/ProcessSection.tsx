"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { Title } from '@/components/ui/Title/Title';
import { ProcessCard } from './ProcessCard/ProcessCard';
import { animateProcessSection } from '@/animations/gsap/processSection';
import { useLanguage } from "@/providers/LanguageProvider";
import './_processSection.scss';
import type { HomeContent } from '@/types/home-content';
import { getProcessIcon } from '@/utils/process-icons';

export default function ProcessSection({ homeContent, localeOverride, preview = false }: { homeContent?: HomeContent; localeOverride?: 'es' | 'en'; preview?: boolean }) {
  const processRef = useRef<HTMLDivElement | null>(null);
  const { t, locale: currentLocale } = useLanguage();
  const locale = localeOverride ?? currentLocale;
  const content = homeContent?.[locale].process;
  const steps = content?.steps ?? [
    { title: t('process.step1Title'), description: t('process.step1Description'), icon: 'document' as const },
    { title: t('process.step2Title'), description: t('process.step2Description'), icon: 'pencil' as const },
    { title: t('process.step3Title'), description: t('process.step3Description'), icon: 'images' as const },
    { title: t('process.step4Title'), description: t('process.step4Description'), icon: 'send' as const },
  ];

  useGSAP(
    () => {
      if (!processRef.current || preview) return;
      return animateProcessSection(processRef.current, { preview });
    },
    { scope: processRef, dependencies: [preview] }
  );

  return (
    <div className="processSectionShell" id="process">
      <div ref={processRef} className={`processSection${preview ? ' processSectionPreview' : ''}`}>
        <Title title={content?.title ?? t("process.title")} subTitle={content?.subtitle ?? t("process.subtitle")} />
        {steps.length > 0 && (
          <div className="processStage">
            <div className="processViewport">
              <div className="processCardsContainer">
                {steps.map((step, index) => {
                  const Icon = getProcessIcon(step.icon);
                  return <ProcessCard key={`process-step-${index}`} number={String(index + 1).padStart(2, '0')} title={step.title} description={step.description} icon={<Icon className='icon' />} active={index === 0} />;
                })}
              </div>
              {steps.length > 1 && (
                <div className="processRailFooter" aria-hidden="true">
                  <span className="processCurrentStep">01</span>
                  <div className="processProgressTrack"><span className="processProgress" /></div>
                  <span>{String(steps.length).padStart(2, '0')}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
