import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { sectionNavigation } from "./sectionNavigation";

gsap.registerPlugin(ScrollTrigger);

export const animateNarrativeGallery = (viewport: HTMLElement) => {
    const media = gsap.matchMedia(viewport);

    media.add("(min-width: 900px) and (min-height: 620px) and (prefers-reduced-motion: no-preference)", () => {
        const panels = gsap.utils.toArray<HTMLElement>(".narrativePanel", viewport);
        if (panels.length < 2) return;

        gsap.set(panels.slice(1), { xPercent: 100, autoAlpha: 1 });
        panels.slice(1).forEach((panel) => {
            const link = panel.querySelector<HTMLAnchorElement>(".narrativeLink");
            if (link) link.tabIndex = -1;
        });

        const timelineDuration = panels.length - 1 + 0.15 + 0.25;
        const snapPoints = panels.map((_, index) => {
            if (index === 0) return 0;
            if (index === panels.length - 1) return 1;
            return (index + 0.15) / timelineDuration;
        });
        const nearestSnap = (value: number) => snapPoints.reduce((nearest, point) =>
            Math.abs(value - point) < Math.abs(value - nearest) ? point : nearest, snapPoints[0]);
        let dragging = false;
        let settling = false;
        let settleTween: gsap.core.Tween | undefined;

        const timeline = gsap.timeline({
            scrollTrigger: {
                trigger: viewport,
                start: "top top+=68",
                end: () => `+=${Math.round(window.innerHeight * 0.55 * (panels.length - 1))}`,
                pin: viewport,
                pinSpacing: true,
                scrub: 0.28,
                snap: {
                    snapTo: (value: number) => dragging || settling || sectionNavigation.active ? value : nearestSnap(value),
                    duration: { min: 0.38, max: 0.62 },
                    delay: 0.03,
                    ease: "power2.inOut",
                    inertia: false,
                },
                anticipatePin: 1,
                invalidateOnRefresh: true,
                onUpdate: (self) => {
                    const active = snapPoints.reduce((nearest, point, index) =>
                        Math.abs(self.progress - point) < Math.abs(self.progress - snapPoints[nearest]) ? index : nearest, 0);
                    panels.forEach((panel, index) => {
                        const link = panel.querySelector<HTMLAnchorElement>(".narrativeLink");
                        if (link) link.tabIndex = index === active ? 0 : -1;
                    });
                },
            },
        });

        panels.forEach((panel, index) => {
            if (index === panels.length - 1) return;
            const next = panels[index + 1];
            const position = index + 0.15;

            timeline
                .to(panel, { xPercent: -100, duration: 1, ease: "none" }, position)
                .to(next, { xPercent: 0, duration: 1, ease: "none" }, position)
                .to(panel.querySelector(".narrativeArtwork img"), { scale: 0.92, duration: 1, ease: "none" }, position)
                .fromTo(next.querySelector(".narrativeArtwork img"), { scale: 1.08 }, { scale: 1, duration: 1, ease: "none" }, position);
        });

        const progress = viewport.querySelector(".narrativeProgress span");
        timeline.to(progress, { scaleX: 1, duration: panels.length - 1, ease: "none" }, 0.15);
        timeline.to(progress, { scaleX: 1, duration: 0.25, ease: "none" });

        const trigger = timeline.scrollTrigger;
        if (!trigger) return;
        let pointerId: number | null = null;
        let startX = 0;
        let startScroll = 0;
        let moved = false;
        let didScroll = false;

        const onPointerDown = (event: PointerEvent) => {
            if (event.pointerType === "touch" || event.button !== 0 ||
                (event.target instanceof Element && event.target.closest("a, button"))) return;

            event.preventDefault();
            settleTween?.kill();
            const snapTween = trigger.getTween(true);
            if (typeof snapTween?.kill === "function") snapTween.kill();
            dragging = true;
            pointerId = event.pointerId;
            startX = event.clientX;
            startScroll = Math.max(trigger.start, Math.min(trigger.end, trigger.scroll()));
            moved = false;
            didScroll = false;
            viewport.classList.add("is-dragging");
        };

        const onPointerMove = (event: PointerEvent) => {
            if (pointerId !== event.pointerId) return;
            const deltaX = event.clientX - startX;
            if (Math.abs(deltaX) > 4) moved = true;
            if (!moved) return;

            const scrollRange = trigger.end - trigger.start;
            const dragRange = Math.min(520, viewport.clientWidth * 0.45) * (panels.length - 1);
            const nextScroll = Math.max(trigger.start, Math.min(trigger.end, startScroll - deltaX * scrollRange / dragRange));
            if (Math.abs(nextScroll - startScroll) < 1 && !didScroll) return;
            trigger.scroll(nextScroll);
            ScrollTrigger.update();
            didScroll = true;
            event.preventDefault();
        };

        const onPointerUp = (event: PointerEvent) => {
            if (pointerId !== event.pointerId) return;
            pointerId = null;
            dragging = false;
            viewport.classList.remove("is-dragging");
            if (!didScroll && !trigger.isActive) return;

            const scrollRange = trigger.end - trigger.start;
            const position = (trigger.scroll() - trigger.start) / scrollRange;
            const target = trigger.start + nearestSnap(position) * scrollRange;
            if (Math.abs(target - trigger.scroll()) < 1) return;
            const state = { scroll: trigger.scroll() };
            settling = true;
            settleTween = gsap.to(state, {
                scroll: target,
                duration: 0.45,
                ease: "power2.inOut",
                onUpdate: () => {
                    trigger.scroll(state.scroll);
                    ScrollTrigger.update();
                },
                onComplete: () => { settling = false; settleTween = undefined; },
                onInterrupt: () => { settling = false; settleTween = undefined; },
            });
        };

        const cancelSettle = () => settleTween?.kill();

        viewport.addEventListener("pointerdown", onPointerDown, true);
        window.addEventListener("pointermove", onPointerMove);
        window.addEventListener("pointerup", onPointerUp);
        window.addEventListener("pointercancel", onPointerUp);
        window.addEventListener("wheel", cancelSettle, { passive: true });

        return () => {
            settleTween?.kill();
            viewport.removeEventListener("pointerdown", onPointerDown, true);
            window.removeEventListener("pointermove", onPointerMove);
            window.removeEventListener("pointerup", onPointerUp);
            window.removeEventListener("pointercancel", onPointerUp);
            window.removeEventListener("wheel", cancelSettle);
            viewport.classList.remove("is-dragging");
            panels.forEach((panel) => {
                const link = panel.querySelector<HTMLAnchorElement>(".narrativeLink");
                if (link) link.removeAttribute("tabindex");
            });
        };
    });

    return () => media.revert();
};
