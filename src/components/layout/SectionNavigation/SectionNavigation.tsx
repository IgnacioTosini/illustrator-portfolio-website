"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import type { Dispatch, MouseEvent, ReactNode, SetStateAction } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname, useRouter } from "next/navigation";
import { prefersReducedMotion } from "@/animations/gsap/reducedMotion";
import { sectionNavigation } from "@/animations/gsap/sectionNavigation";

gsap.registerPlugin(ScrollTrigger);

interface SectionNavigationContextValue {
    activeSectionLink: string | null;
    setActiveSectionLink: Dispatch<SetStateAction<string | null>>;
    navigateSection: (event: MouseEvent<HTMLAnchorElement>, link: string) => void;
    navigateTop: (event: MouseEvent<HTMLAnchorElement>) => void;
}

const SectionNavigationContext = createContext<SectionNavigationContextValue | null>(null);

export function useSectionNavigation() {
    const context = useContext(SectionNavigationContext);
    if (!context) throw new Error("useSectionNavigation debe usarse dentro de SectionNavigationProvider");
    return context;
}

export function useOptionalSectionNavigation() {
    return useContext(SectionNavigationContext);
}

export function SectionNavigationProvider({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [activeSectionLink, setActiveSectionLink] = useState<string | null>(null);
    const pendingSectionRef = useRef<string | null>(null);
    const overlayRef = useRef<HTMLDivElement | null>(null);
    const tweenRef = useRef<gsap.core.Timeline | null>(null);

    const scrollToSection = useCallback((id: string) => {
        const section = document.getElementById(id);
        if (!section && id !== "top") return false;

        const headerHeight = document.querySelector<HTMLElement>(".header")?.getBoundingClientRect().height ?? 64;
        const availableHeight = window.innerHeight - headerHeight;
        const sectionHeight = section?.getBoundingClientRect().height ?? 0;
        const sectionTop = (section?.getBoundingClientRect().top ?? 0) + window.scrollY;
        const heading = section?.querySelector<HTMLElement>(".titleContainer");
        const target = id === "top"
            ? 0
            : sectionHeight < availableHeight - 40
                ? sectionTop - headerHeight - (availableHeight - sectionHeight) / 2
                : (heading?.getBoundingClientRect().top ?? section?.getBoundingClientRect().top ?? 0) + window.scrollY - headerHeight - 28;
        const boundedTarget = Math.max(0, Math.round(target));

        tweenRef.current?.kill();
        sectionNavigation.active = true;
        ScrollTrigger.getAll().forEach((trigger) => {
            const snapTween = trigger.getTween(true);
            if (typeof snapTween?.kill === "function") snapTween.kill();
        });

        const root = document.documentElement;
        const previousScrollBehavior = root.style.scrollBehavior;
        root.style.scrollBehavior = "auto";
        let overlay = overlayRef.current;
        if (!overlay) {
            overlay = document.createElement("div");
            Object.assign(overlay.style, {
                position: "fixed",
                left: "0",
                right: "0",
                bottom: "0",
                background: "var(--color-bg)",
                zIndex: "999",
                pointerEvents: "none",
                opacity: "0",
                visibility: "hidden",
            });
            document.body.appendChild(overlay);
            overlayRef.current = overlay;
        }
        overlay.style.top = `${headerHeight}px`;
        const finish = () => {
            root.style.scrollBehavior = previousScrollBehavior;
            sectionNavigation.active = false;
            window.dispatchEvent(new Event("scroll"));
        };
        if (prefersReducedMotion() || Math.abs(window.scrollY - boundedTarget) < 3) {
            window.scrollTo(0, boundedTarget);
            ScrollTrigger.update();
            gsap.set(overlay, { autoAlpha: 0 });
            finish();
            return true;
        }

        tweenRef.current = gsap.timeline({ onComplete: finish, onInterrupt: finish })
            .to(overlay, { autoAlpha: 1, duration: 0.16, ease: "power1.in" })
            .call(() => {
                window.scrollTo(0, boundedTarget);
                ScrollTrigger.update();
            })
            .to(overlay, { autoAlpha: 0, duration: 0.28, ease: "power2.out" });
        return true;
    }, []);

    const navigateSection = useCallback((event: MouseEvent<HTMLAnchorElement>, link: string) => {
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        const match = link.match(/^\/#(about|process|contact)$/);
        if (!match) return;

        event.preventDefault();
        const id = match[1];
        setActiveSectionLink(link);
        if (pathname !== "/") {
            pendingSectionRef.current = id;
            router.push("/", { scroll: false });
            return;
        }

        window.history.pushState(null, "", link);
        scrollToSection(id);
    }, [pathname, router, scrollToSection]);

    const navigateTop = useCallback((event: MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        setActiveSectionLink(null);
        if (pathname === "/") {
            window.history.replaceState(null, "", "/");
            scrollToSection("top");
            return;
        }
        pendingSectionRef.current = "top";
        router.push("/", { scroll: false });
    }, [pathname, router, scrollToSection]);

    useEffect(() => {
        if (pathname !== "/" || !pendingSectionRef.current) return;
        const id = pendingSectionRef.current;
        pendingSectionRef.current = null;
        let secondFrame = 0;
        const firstFrame = window.requestAnimationFrame(() => {
            secondFrame = window.requestAnimationFrame(() => {
                if (id !== "top") window.history.pushState(null, "", `/#${id}`);
                scrollToSection(id);
            });
        });
        return () => {
            window.cancelAnimationFrame(firstFrame);
            window.cancelAnimationFrame(secondFrame);
        };
    }, [pathname, scrollToSection]);

    useEffect(() => () => {
        tweenRef.current?.kill();
        overlayRef.current?.remove();
        sectionNavigation.active = false;
    }, []);

    return (
        <SectionNavigationContext.Provider value={{ activeSectionLink, setActiveSectionLink, navigateSection, navigateTop }}>
            {children}
        </SectionNavigationContext.Provider>
    );
}
