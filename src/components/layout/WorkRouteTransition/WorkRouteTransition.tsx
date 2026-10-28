"use client";

import { createContext, useCallback, useContext, useEffect, useRef } from "react";
import type { MouseEvent, ReactNode } from "react";
import gsap from "gsap";
import { usePathname, useRouter } from "next/navigation";
import { prefersReducedMotion } from "@/animations/gsap/reducedMotion";
import { useLanguage } from "@/providers/LanguageProvider";
import "./_workRouteTransition.scss";

interface WorkRouteTarget {
    href: string;
    image: string;
    title: string;
    source?: HTMLElement;
}

interface PendingRoute {
    href: string;
    pathname: string;
}

type NavigateToWork = (event: MouseEvent<HTMLAnchorElement>, target: WorkRouteTarget) => void;

const WorkRouteTransitionContext = createContext<NavigateToWork | null>(null);

export function useWorkRouteTransition() {
    const navigate = useContext(WorkRouteTransitionContext);
    if (!navigate) throw new Error("useWorkRouteTransition debe usarse dentro de WorkRouteTransitionProvider");
    return navigate;
}

export function useOptionalWorkRouteTransition() {
    return useContext(WorkRouteTransitionContext);
}

export function WorkRouteTransitionProvider({ children }: { children: ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { locale } = useLanguage();
    const portalRef = useRef<HTMLDivElement | null>(null);
    const tweenRef = useRef<gsap.core.Timeline | null>(null);
    const pendingRouteRef = useRef<PendingRoute | null>(null);
    const timeoutRef = useRef<number | null>(null);

    const clearPortal = useCallback(() => {
        tweenRef.current?.kill();
        tweenRef.current = null;
        portalRef.current?.remove();
        portalRef.current = null;
        pendingRouteRef.current = null;
        if (timeoutRef.current !== null) {
            window.clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    }, []);

    const navigateToWork = useCallback<NavigateToWork>((event, target) => {
        const destination = new URL(target.href, window.location.origin);
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || prefersReducedMotion() || window.location.pathname + window.location.search === destination.pathname + destination.search) return;
        event.preventDefault();
        if (pendingRouteRef.current) return;

        const bounds = (target.source ?? event.currentTarget).getBoundingClientRect();
        const portal = document.createElement("div");
        portal.className = "workRoutePortal";
        portal.setAttribute("aria-hidden", "true");
        Object.assign(portal.style, {
            left: `${bounds.left}px`,
            top: `${bounds.top}px`,
            width: `${bounds.width}px`,
            height: `${bounds.height}px`,
        });

        const art = document.createElement("div");
        art.className = "workRoutePortalArt";
        const image = document.createElement("img");
        image.src = target.image;
        image.alt = "";
        art.appendChild(image);
        const copy = document.createElement("div");
        copy.className = "workRoutePortalCopy";
        const eyebrow = document.createElement("span");
        eyebrow.textContent = locale === "es" ? "ENTRANDO AL PORTFOLIO" : "ENTERING THE PORTFOLIO";
        const title = document.createElement("strong");
        title.textContent = target.title;
        copy.append(eyebrow, title);
        portal.append(art, copy);
        document.body.appendChild(portal);
        portalRef.current = portal;
        pendingRouteRef.current = { href: target.href, pathname: destination.pathname };

        tweenRef.current = gsap.timeline({ onComplete: () => router.push(target.href, { scroll: false }) })
            .to(portal, {
                left: 0,
                top: 0,
                width: window.innerWidth,
                height: window.innerHeight,
                borderRadius: 0,
                duration: 0.62,
                ease: "power3.inOut",
            })
            .to([art, copy], { autoAlpha: 1, y: 0, duration: 0.38, stagger: 0.06, ease: "power2.out" }, "-=0.28");

        timeoutRef.current = window.setTimeout(() => {
            if (pendingRouteRef.current?.href === target.href) {
                clearPortal();
                window.location.assign(target.href);
            }
        }, 12000);
    }, [clearPortal, locale, router]);

    useEffect(() => clearPortal, [clearPortal]);

    useEffect(() => {
        if (pendingRouteRef.current?.pathname !== pathname) return;
        let secondFrame = 0;
        const firstFrame = window.requestAnimationFrame(() => {
            secondFrame = window.requestAnimationFrame(() => {
                window.scrollTo({ top: 0, behavior: "instant" });
                const portal = portalRef.current;
                if (!portal) return;
                tweenRef.current = gsap.timeline({ onComplete: clearPortal })
                    .to(portal, { clipPath: "inset(0 0 100% 0)", duration: 0.68, ease: "power3.inOut" });
            });
        });
        return () => {
            window.cancelAnimationFrame(firstFrame);
            window.cancelAnimationFrame(secondFrame);
        };
    }, [pathname, clearPortal]);

    return <WorkRouteTransitionContext.Provider value={navigateToWork}>{children}</WorkRouteTransitionContext.Provider>;
}
