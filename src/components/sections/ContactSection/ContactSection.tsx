"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { Title } from '@/components/ui/Title/Title'
import { ContactForm } from './ContactForm/ContactForm'
import { animateContactSection } from '@/animations/gsap/contactSection'
import { useLanguage } from "@/providers/LanguageProvider";
import './_contactSection.scss'

export default function ContactSection() {
  const contactRef = useRef<HTMLDivElement | null>(null)
  const { t } = useLanguage();

  useGSAP(
    () => {
      if (!contactRef.current) return;
      return animateContactSection(contactRef.current)
    },
    { scope: contactRef }
  )

  return (
    <div ref={contactRef} className='contactSection' id={'contact'}>
      <Title title={t("contact.title")} subTitle={t("contact.subtitle")} />
      <div className='moreInfoContent'>
        <p>{t("contact.description")}</p>
      </div>

      <ContactForm />
    </div>
  )
}
