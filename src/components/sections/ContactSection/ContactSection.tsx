"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { Title } from '@/components/ui/Title/Title'
import { SocialMedias } from '@/components/ui/SocialMedias/SocialMedias'
import { ContactForm } from './ContactForm/ContactForm'
import { animateContactSection } from '@/animations/gsap/contactSection'
import { trackEvent } from '@/lib/utils'
import './_contactSection.scss'

export default function ContactSection() {
  const contactRef = useRef<HTMLDivElement | null>(null)

  useGSAP(
    () => {
      if (!contactRef.current) return;
      return animateContactSection(contactRef.current)
    },
    { scope: contactRef }
  )

  return (
    <div ref={contactRef} className='contactSection' id={'contact'}>
      <Title title={'Contacto'} subTitle={'Trabajemos juntos'} />
      <div className='moreInfoContent'>
        <p>Tienes un proyecto en mente? Siempre estoy abierto a nuevos encargos, colaboraciones y alianzas creativas. Hagamos algo hermoso.</p>
        <div className='personalData'>
          <a
            href="mailto:hello@alukkart.com"
            onClick={() =>
              trackEvent('contact_click', {
                method: 'email',
                location: 'contact_section',
              })
            }
          >
            hello@alukkart.com
          </a>
          <SocialMedias />
        </div>
      </div>

      <ContactForm />
    </div>
  )
}
