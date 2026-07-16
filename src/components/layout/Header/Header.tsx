"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { usePathname, useRouter } from "next/navigation";
import { getLinksByLocale } from "@/utils/links";
import { animateHeader } from "@/animations/gsap/header";
import { prefersReducedMotion } from "@/animations/gsap/reducedMotion";
import { Links } from "@/components/ui/Links/Links";
import { useLanguage } from "@/providers/LanguageProvider";
import { ThemeSelector } from "../../ui/ThemeSelector/ThemeSelector";
import { LanguageSelector } from "./LanguageSelector";
import Link from "next/link";
import "./_header.scss";

export default function Header() {
    const headerRef = useRef<HTMLDivElement | null>(null);
    const pathname = usePathname();
    const router = useRouter();
    const { locale, t } = useLanguage();
    const links = getLinksByLocale(locale);
    const [activeSectionLink, setActiveSectionLink] = useState<string | null>(null);
    const activeLink = pathname === "/" ? activeSectionLink : pathname === "/works" ? "/works" : null;

    const runTopMicroAnimation = () => {
        if (prefersReducedMotion()) return;

        window.setTimeout(() => {
            const heroElement = document.querySelector(".heroSection");
            if (!heroElement) return;

            gsap.fromTo(
                heroElement,
                {
                    autoAlpha: 0.92,
                    y: 10,
                },
                {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.4,
                    ease: "power2.out",
                }
            );

            gsap.fromTo(
                ".heroSection .titleContainer .subTitle",
                {
                    autoAlpha: 0.7,
                    y: 10,
                },
                {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.5,
                    ease: "power3.out",
                }
            );
        }, 120);
    };

    const handleGoTop = (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();

        if (pathname === "/") {
            window.history.replaceState(null, "", "/");
            window.scrollTo({ top: 0, behavior: "smooth" });
            runTopMicroAnimation();
            return;
        }

        router.push("/");
        window.setTimeout(() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
            runTopMicroAnimation();
        }, 120);
    };

    useGSAP(
        () => {
            if (!headerRef.current) return;
            return animateHeader(headerRef.current);
        },
        { scope: headerRef, dependencies: [], revertOnUpdate: true }
    );

    useEffect(() => {
        if (pathname !== "/") {
            return;
        }

        const sectionIds = ["works", "about", "process", "contact"];
        const sections = sectionIds
            .map((id) => document.getElementById(id))
            .filter((section): section is HTMLElement => Boolean(section));

        if (sections.length === 0) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                const visibleEntry = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

                if (!visibleEntry) return;

                setActiveSectionLink(visibleEntry.target.id === "works" ? "/works" : `/#${visibleEntry.target.id}`);
            },
            {
                rootMargin: "-32% 0px -52% 0px",
                threshold: [0.1, 0.25, 0.5],
            }
        );

        sections.forEach((section) => observer.observe(section));

        return () => observer.disconnect();
    }, [pathname]);

    return (
        <div ref={headerRef} className="header">
            <Link href='/' className="header-link name" onClick={handleGoTop}>Alukkart</Link>
            <nav className="header-nav" aria-label="Principal">
                <Links links={links} activeLink={activeLink} className="header-links" />
            </nav>
            <div className="header-actions">
                <Link href="/#contact" className="header-cta">
                    {t("header.ctaContact")}
                </Link>
                <LanguageSelector />
                <ThemeSelector />
            </div>
        </div>
    )
}
