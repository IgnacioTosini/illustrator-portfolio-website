"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { getLinksByLocale } from "@/utils/links";
import { animateHeader } from "@/animations/gsap/header";
import { prefersReducedMotion } from "@/animations/gsap/reducedMotion";
import { sectionNavigation } from "@/animations/gsap/sectionNavigation";
import { useSectionNavigation } from "@/components/layout/SectionNavigation/SectionNavigation";
import { useWorkRouteTransition } from "@/components/layout/WorkRouteTransition/WorkRouteTransition";
import { Links } from "@/components/ui/Links/Links";
import { useLanguage } from "@/providers/LanguageProvider";
import { ThemeSelector } from "../../ui/ThemeSelector/ThemeSelector";
import { LanguageSelector } from "./LanguageSelector";
import Link from "next/link";
import "./_header.scss";

gsap.registerPlugin(ScrollTrigger);

interface WorkPreviewItem {
    id: string;
    title: string;
    href: string;
    image: string;
    alt: string;
}

export default function Header() {
    const headerRef = useRef<HTMLDivElement | null>(null);
    const previewRequestedRef = useRef(false);
    const previewAbortRef = useRef<AbortController | null>(null);
    const suppressPreviewFocusRef = useRef(false);
    const pathname = usePathname();
    const { locale, t } = useLanguage();
    const navigateToWork = useWorkRouteTransition();
    const { activeSectionLink, setActiveSectionLink, navigateSection, navigateTop } = useSectionNavigation();
    const links = getLinksByLocale(locale);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isWorksPreviewOpen, setIsWorksPreviewOpen] = useState(false);
    const [previewWorks, setPreviewWorks] = useState<WorkPreviewItem[]>([]);
    const activeLink = pathname === "/" ? activeSectionLink : pathname === "/works" ? "/works" : null;
    const workPreviewItems: WorkPreviewItem[] = previewWorks.length ? previewWorks : [{
        id: "preview",
        title: "Alukkart",
        href: "/works",
        image: "/alukkart.webp",
        alt: "Ilustración de Alukkart",
    }];

    const openWorkRoute = (event: React.MouseEvent<HTMLAnchorElement>, href: string, item: WorkPreviewItem) => {
        setIsMobileMenuOpen(false);
        setIsWorksPreviewOpen(false);
        navigateToWork(event, { href, image: item.image, title: href === "/works" ? t("workSection.title") : item.title });
    };

    const openWorksPreview = () => {
        if (suppressPreviewFocusRef.current) {
            suppressPreviewFocusRef.current = false;
            return;
        }
        if (!window.matchMedia("(min-width: 900px) and (hover: hover)").matches) return;
        setIsWorksPreviewOpen(true);
        if (previewRequestedRef.current) return;
        previewRequestedRef.current = true;
        const controller = new AbortController();
        previewAbortRef.current = controller;
        fetch("/api/projects?page=1&pageSize=6", { signal: controller.signal })
            .then((response) => response.ok ? response.json() : null)
            .then((data: { projects?: Array<{ id: string; slug: string; title: string; images?: Array<{ url: string; alt?: string }> }> } | null) => {
                const projects = Array.isArray(data?.projects) ? data.projects : [];
                const items = projects
                    .filter((project) => typeof project?.images?.[0]?.url === "string")
                    .slice(0, 3)
                    .map((project) => ({
                        id: project.id,
                        title: project.title,
                        href: `/works/${project.slug}`,
                        image: project.images![0].url,
                        alt: project.images![0].alt || project.title,
                    }));
                if (items.length) setPreviewWorks(items);
            })
            .catch(() => {});
    };

    const handleSectionLinkClick = (event: React.MouseEvent<HTMLAnchorElement>, link: string) => {
        if (link === "/works") {
            openWorkRoute(event, link, workPreviewItems[0]);
            return;
        }
        setIsMobileMenuOpen(false);
        setIsWorksPreviewOpen(false);
        navigateSection(event, link);
    };

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
        setIsWorksPreviewOpen(false);
        navigateTop(event);
        if (pathname === "/") runTopMicroAnimation();
    };

    useGSAP(
        () => {
            if (!headerRef.current) return;
            return animateHeader(headerRef.current);
        },
        { scope: headerRef, dependencies: [], revertOnUpdate: true }
    );

    useEffect(() => {
        return () => {
            previewAbortRef.current?.abort();
        };
    }, []);

    useEffect(() => {
        if (!isMobileMenuOpen) return;

        const handlePointerDown = (event: PointerEvent) => {
            if (!headerRef.current?.contains(event.target as Node)) {
                setIsMobileMenuOpen(false);
            }
        };
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") setIsMobileMenuOpen(false);
        };
        const desktopViewport = window.matchMedia("(min-width: 769px)");
        const handleViewportChange = (event: MediaQueryListEvent) => {
            if (event.matches) setIsMobileMenuOpen(false);
        };

        document.addEventListener("pointerdown", handlePointerDown);
        document.addEventListener("keydown", handleKeyDown);
        desktopViewport.addEventListener("change", handleViewportChange);
        return () => {
            document.removeEventListener("pointerdown", handlePointerDown);
            document.removeEventListener("keydown", handleKeyDown);
            desktopViewport.removeEventListener("change", handleViewportChange);
        };
    }, [isMobileMenuOpen]);

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

        let frame = 0;
        const updateActiveSection = () => {
            frame = 0;
            if (sectionNavigation.active) return;
            const headerHeight = headerRef.current?.getBoundingClientRect().height ?? 64;
            const marker = Math.max(headerHeight + 24, window.innerHeight / 2);
            const visible = sections.find((section) => {
                const bounds = section.getBoundingClientRect();
                return bounds.top <= marker && bounds.bottom > marker;
            });
            const next = visible ? visible.id === "works" ? "/works" : `/#${visible.id}` : null;
            setActiveSectionLink((previous) => previous === next ? previous : next);
        };
        const scheduleUpdate = () => {
            if (!frame) frame = window.requestAnimationFrame(updateActiveSection);
        };

        scheduleUpdate();
        window.addEventListener("scroll", scheduleUpdate, { passive: true });
        window.addEventListener("resize", scheduleUpdate);
        ScrollTrigger.addEventListener("refresh", scheduleUpdate);

        return () => {
            window.cancelAnimationFrame(frame);
            window.removeEventListener("scroll", scheduleUpdate);
            window.removeEventListener("resize", scheduleUpdate);
            ScrollTrigger.removeEventListener("refresh", scheduleUpdate);
        };
    }, [pathname, setActiveSectionLink]);

    return (
        <div
            ref={headerRef}
            className="header"
            onMouseLeave={() => setIsWorksPreviewOpen(false)}
            onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node)) setIsWorksPreviewOpen(false);
            }}
            onKeyDown={(event) => {
                if (event.key !== "Escape" || !isWorksPreviewOpen) return;
                setIsWorksPreviewOpen(false);
                const workLink = headerRef.current?.querySelector<HTMLAnchorElement>('.header-links a[href="/works"]');
                if (workLink && document.activeElement !== workLink) {
                    suppressPreviewFocusRef.current = true;
                    workLink.focus();
                }
            }}
        >
            <Link href='/' className="header-link name" onClick={handleGoTop}>Alukkart</Link>
            <nav
                id="primary-navigation"
                className={`header-nav ${isMobileMenuOpen ? "is-open" : ""}`.trim()}
                aria-label={t("header.mainNavigation")}
            >
                <Links
                    links={links}
                    activeLink={activeLink}
                    className="header-links"
                    onLinkClick={handleSectionLinkClick}
                    onLinkEnter={(link) => link === "/works" ? openWorksPreview() : setIsWorksPreviewOpen(false)}
                    onLinkKeyDown={(event, link) => {
                        if (link !== "/works" || event.key !== "ArrowDown") return;
                        event.preventDefault();
                        openWorksPreview();
                        window.requestAnimationFrame(() => headerRef.current?.querySelector<HTMLAnchorElement>(".headerWorkPreviewAction")?.focus());
                    }}
                />
                <Link
                    href="/#contact"
                    className="header-cta header-mobile-cta"
                    onClick={(event) => handleSectionLinkClick(event, "/#contact")}
                >
                    {t("header.ctaContact")}
                </Link>
            </nav>
            <div className="header-actions" onMouseEnter={() => setIsWorksPreviewOpen(false)}>
                <Link href="/#contact" className="header-cta" onClick={(event) => handleSectionLinkClick(event, "/#contact")}>
                    {t("header.ctaContact")}
                </Link>
                <LanguageSelector />
                <ThemeSelector />
                <button
                    type="button"
                    className={`header-menu-toggle ${isMobileMenuOpen ? "is-open" : ""}`.trim()}
                    aria-label={isMobileMenuOpen ? t("header.closeMenu") : t("header.openMenu")}
                    aria-expanded={isMobileMenuOpen}
                    aria-controls="primary-navigation"
                    onClick={() => {
                        setIsWorksPreviewOpen(false);
                        setIsMobileMenuOpen((open) => !open);
                    }}
                >
                    <span className="header-menu-icon" aria-hidden="true">
                        <span />
                        <span />
                    </span>
                </button>
            </div>
            <div className={`headerWorkPreview${isWorksPreviewOpen ? " is-open" : ""}`} aria-hidden={!isWorksPreviewOpen}>
                <div className="headerWorkPreviewIntro">
                    <span className="headerWorkPreviewEyebrow">{locale === "es" ? "VISTA RÁPIDA / 01—03" : "QUICK LOOK / 01—03"}</span>
                    <h2>{t("workSection.title")}</h2>
                    <p>{locale === "es" ? "Una tira de historias antes de entrar a la galería." : "A strip of stories before entering the gallery."}</p>
                    <Link href="/works" onClick={(event) => openWorkRoute(event, "/works", workPreviewItems[0])} className="headerWorkPreviewAction">
                        {locale === "es" ? "Abrir la galería" : "Open the gallery"} <span aria-hidden="true">↗</span>
                    </Link>
                </div>
                <div className={`headerWorkPreviewGallery${workPreviewItems.length === 1 ? " is-single" : ""}`}>
                    {workPreviewItems.map((item, index) => (
                        <Link href={item.href} key={item.id} className="headerWorkPreviewTile" onClick={(event) => openWorkRoute(event, item.href, item)}>
                            <Image src={item.image} alt={item.alt} fill quality={85} sizes="(max-width: 1200px) 28vw, 280px" />
                            <span className="headerWorkPreviewTileLabel"><small>{String(index + 1).padStart(2, "0")}</small>{item.title}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}
