"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { Title } from '@/components/ui/Title/Title';
import { ProcessCard } from './ProcessCard/ProcessCard';
import { IoDocumentTextOutline, IoPencilOutline } from 'react-icons/io5';
import { LuSend } from 'react-icons/lu';
import { GiPapers } from 'react-icons/gi';
import { animateProcessSection } from '@/animations/gsap/processSection';
import './_processSection.scss';

export default function ProcessSection() {
  const processRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      if (!processRef.current) return;
      return animateProcessSection(processRef.current);
    },
    { scope: processRef }
  );

  return (
    <div ref={processRef} className='processSection' id={'process'}>
      <Title title={'Proceso'} subTitle={'Como Trabajo'} />
      <div className='processCardsContainer'>
        <ProcessCard number={'01'} title={'Brief e Investigacion'} description={'Cada proyecto comienza con una comprension profunda de tus objetivos, audiencia y vision. Discutimos referencias, direccion de estilo y entregables.'} icon={<IoDocumentTextOutline className='icon' />} />
        <ProcessCard number={'02'} title={'Bocetos y Conceptos'} description={'Desarrollo bocetos iniciales y variaciones de concepto para tu revision. Esta etapa es colaborativa e iteramos hasta que la direccion sea la correcta.'} icon={<IoPencilOutline className='icon' />} />
        <ProcessCard number={'03'} title={'Refinamiento'} description={'Una vez aprobado el concepto, refino la obra con todo detalle, color y acabado. Se incluyen revisiones menores en esta etapa.'} icon={<GiPapers className='icon' />} />
        <ProcessCard number={'04'} title={'Entrega Final'} description={'La obra terminada se entrega en todos los formatos y resoluciones requeridos, lista para impresion, digital o cualquier medio que necesites.'} icon={<LuSend className='icon' />} />
      </div>
    </div>
  )
}
