"use client";

import { useRef } from "react";
import type { MouseEvent } from "react";
import { useGSAP } from "@gsap/react";
import { usePathname } from "next/navigation";
import { Links } from '@/components/ui/Links/Links';
import { SocialMedias } from '@/components/ui/SocialMedias/SocialMedias';
import { getLinksByLocale } from '@/utils/links';
import { animateFooter } from '@/animations/gsap/footer';
import { useLanguage } from "@/providers/LanguageProvider";
import { useSectionNavigation } from "@/components/layout/SectionNavigation/SectionNavigation";
import { useWorkRouteTransition } from "@/components/layout/WorkRouteTransition/WorkRouteTransition";
import Link from "next/link";
import './_footer.scss';

export default function Footer() {
  const footerRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();
  const { locale, t } = useLanguage();
  const { navigateSection } = useSectionNavigation();
  const navigateToWork = useWorkRouteTransition();
  const links = getLinksByLocale(locale);

  const handleLinkClick = (event: MouseEvent<HTMLAnchorElement>, link: string) => {
    if (link === "/works") {
      navigateToWork(event, { href: link, image: "/alukkart.webp", title: t("workSection.title") });
      return;
    }
    navigateSection(event, link);
  };

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
        <div className="footerBrand">
          <h4 className='name'>Alukkart</h4>
          <p>{t("footer.studio")}</p>
        </div>

        <div className='footerLinks'>
          <Links links={links} onLinkClick={handleLinkClick} />
          <div className="footerMeta">
            <p>© {new Date().getFullYear()} Alukkart. {t("footer.rightsReserved")}</p>
            <p>{t("footer.createdBy")}</p>
          </div>
        </div>

        <div className="footerActions">
          <Link href="/#contact" className="footerCta" onClick={(event) => navigateSection(event, "/#contact")}>{t("footer.cta")}</Link>
          <SocialMedias />
        </div>
      </div>
    </div>
  )
}
