"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { usePathname } from "next/navigation";
import { Links } from '@/components/ui/Links/Links';
import { SocialMedias } from '@/components/ui/SocialMedias/SocialMedias';
import { links } from '@/utils/links';
import { animateFooter } from '@/animations/gsap/footer';
import './_footer.scss';

export default function Footer() {
  const footerRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();

  useGSAP(
    () => {
      if (!footerRef.current) return;
      return animateFooter(footerRef.current);
    },
    { scope: footerRef, dependencies: [pathname], revertOnUpdate: true }
  );

  return (
    <div ref={footerRef} className='footer'>
      <div className='footerContent'>

      <h4 className='name'>Alukkart</h4>

      <div className='footerLinks'>
        <Links links={links} />
        <p>© {new Date().getFullYear()} Alukkart. Todos los derechos reservados.</p>
      </div>

        <SocialMedias />
      </div>
    </div>
  )
}
