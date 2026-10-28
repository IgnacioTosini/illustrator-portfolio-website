import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motionPreset } from "./motionPreset";
import { prefersReducedMotion } from "./reducedMotion";

gsap.registerPlugin(ScrollTrigger);

interface ProcessAnimationOptions {
    preview?: boolean;
}

export const animateProcessSection = (processElement: HTMLElement, { preview = false }: ProcessAnimationOptions = {}) => {
    const media = gsap.matchMedia(processElement);
    const ctx = gsap.context(() => {
        if (prefersReducedMotion()) return;

        gsap.timeline({
            scrollTrigger: {
                trigger: processElement,
                start: motionPreset.sectionTriggerStart,
                once: true,
            },
            defaults: { ease: motionPreset.ease },
        })
            .from(".titleContainer .title", {
                autoAlpha: 0,
                y: 18,
                letterSpacing: "0.35em",
                duration: motionPreset.titleDuration,
            })
            .from(".titleContainer .subTitle", {
                autoAlpha: 0,
                y: 24,
                duration: motionPreset.subtitleDuration,
                ease: "back.out(1.2)",
            }, "-=0.2");

        if (preview) return;

        media.add("(min-width: 900px) and (min-height: 620px) and (prefers-reduced-motion: no-preference)", () => {
            const viewport = processElement.querySelector<HTMLElement>(".processViewport");
            const track = processElement.querySelector<HTMLElement>(".processCardsContainer");
            const progress = processElement.querySelector<HTMLElement>(".processProgress");
            const current = processElement.querySelector<HTMLElement>(".processCurrentStep");
            const cards = gsap.utils.toArray<HTMLElement>(".processCard", processElement);
            if (!viewport || !track || !progress || !current || cards.length < 2) return;

            const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);
            if (distance() === 0) return;

            const activate = (value: number) => {
                const active = Math.min(cards.length - 1, Math.round(value * (cards.length - 1)));
                cards.forEach((card, index) => card.classList.toggle("is-active", index === active));
                current.textContent = String(active + 1).padStart(2, "0");
            };

            activate(0);

            const timeline = gsap.timeline({
                scrollTrigger: {
                    trigger: processElement,
                    start: "top top+=64",
                    end: () => `+=${Math.round(Math.max(480, distance() * 0.85))}`,
                    pin: processElement,
                    pinSpacing: true,
                    scrub: true,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                    onUpdate: (self) => activate(Math.min(1, self.progress / 0.86)),
                },
            });

            timeline
                .to(track, { x: () => -distance(), duration: 1, ease: "none" }, 0)
                .to(progress, { scaleX: 1, duration: 1, ease: "none" }, 0)
                .to(progress, { scaleX: 1, duration: 0.16, ease: "none" });

            const trigger = timeline.scrollTrigger;
            if (!trigger) return;
            let pointerId: number | null = null;
            let startX = 0;
            let startScroll = 0;
            let moved = false;

            const onPointerDown = (event: PointerEvent) => {
                if (event.pointerType === "touch" || event.button !== 0) return;
                event.preventDefault();
                pointerId = event.pointerId;
                startX = event.clientX;
                startScroll = Math.max(trigger.start, Math.min(trigger.end, trigger.scroll()));
                moved = false;
                viewport.classList.add("is-dragging");
            };

            const onPointerMove = (event: PointerEvent) => {
                if (pointerId !== event.pointerId) return;
                const deltaX = event.clientX - startX;
                if (Math.abs(deltaX) > 4) moved = true;
                if (!moved) return;

                const scrollRange = trigger.end - trigger.start;
                const dragRange = Math.min(520, viewport.clientWidth * 0.45) * (cards.length - 1);
                const nextScroll = Math.max(trigger.start, Math.min(trigger.end, startScroll - deltaX * scrollRange / dragRange));
                if (Math.abs(nextScroll - startScroll) < 1) return;
                trigger.scroll(nextScroll);
                ScrollTrigger.update();
                event.preventDefault();
            };

            const onPointerUp = (event: PointerEvent) => {
                if (pointerId !== event.pointerId) return;
                pointerId = null;
                viewport.classList.remove("is-dragging");
            };

            viewport.addEventListener("pointerdown", onPointerDown, true);
            window.addEventListener("pointermove", onPointerMove);
            window.addEventListener("pointerup", onPointerUp);
            window.addEventListener("pointercancel", onPointerUp);

            return () => {
                viewport.removeEventListener("pointerdown", onPointerDown, true);
                window.removeEventListener("pointermove", onPointerMove);
                window.removeEventListener("pointerup", onPointerUp);
                window.removeEventListener("pointercancel", onPointerUp);
                viewport.classList.remove("is-dragging");
                cards.forEach((card, index) => card.classList.toggle("is-active", index === 0));
                current.textContent = "01";
            };
        });
    }, processElement);

    return () => {
        ctx.revert();
        media.revert();
    };
};
