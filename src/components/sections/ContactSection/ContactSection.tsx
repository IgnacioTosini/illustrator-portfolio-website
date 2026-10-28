"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { Title } from '@/components/ui/Title/Title'
import { ContactForm } from './ContactForm/ContactForm'
import { animateContactSection } from '@/animations/gsap/contactSection'
import { useLanguage } from "@/providers/LanguageProvider";
import './_contactSection.scss'
import { HomeContent } from '@/types/home-content';

export default function ContactSection({ homeContent, preview = false, localeOverride }: { homeContent?: HomeContent; preview?: boolean; localeOverride?: 'es' | 'en' }) {
  const contactRef = useRef<HTMLDivElement | null>(null)
  const { t, locale: currentLocale } = useLanguage();
  const locale = localeOverride ?? currentLocale;
  const content = homeContent?.[locale].contact;

  useGSAP(
    () => {
      if (!contactRef.current || preview) return;
      return animateContactSection(contactRef.current)
    },
    { scope: contactRef, dependencies: [preview] }
  )

  return (
    <div ref={contactRef} className='contactSection' id={'contact'}>
      <Title title={content?.title ?? t("contact.title")} subTitle={content?.subtitle ?? t("contact.subtitle")} />
      <div className='moreInfoContent'>
        <p>{content?.description ?? t("contact.description")}</p>
      </div>

      {preview ? <div className="contactPreviewNotice">Formulario de contacto: vista previa no interactiva</div> : <ContactForm />}
    </div>
  )
}
