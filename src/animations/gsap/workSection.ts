import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motionPreset } from "./motionPreset";
import { prefersReducedMotion } from "./reducedMotion";

gsap.registerPlugin(ScrollTrigger);

export const animateWorkSection = (workElement: HTMLElement) => {
    const ctx = gsap.context(() => {
        if (prefersReducedMotion()) return;

        const titleTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: workElement,
                start: motionPreset.sectionTriggerStart,
                once: true,
            },
            defaults: { ease: motionPreset.ease },
        });

        titleTimeline
            .from(".titleContainer .title", {
                autoAlpha: 0,
                y: 20,
                letterSpacing: "0.35em",
                duration: motionPreset.titleDuration,
            })
            .from(
                ".titleContainer .subTitle",
                {
                    autoAlpha: 0,
                    y: 26,
                    duration: motionPreset.subtitleDuration,
                    ease: "back.out(1.3)",
                },
                "-=0.2"
            );

        const cards = workElement.querySelectorAll<HTMLElement>(".projectCard");
        cards.forEach((card) => {
            gsap.fromTo(
                card,
                { autoAlpha: 0, y: 34, scale: 0.985 },
                {
                    autoAlpha: 1,
                    y: 0,
                    scale: 1,
                    duration: motionPreset.cardDuration,
                    ease: motionPreset.ease,
                    clearProps: "opacity,visibility,transform",
                    scrollTrigger: {
                        trigger: card,
                        start: "top 90%",
                        once: true,
                    },
                }
            );

            const imageMotion = card.querySelector<HTMLElement>(".projectCardImageMotion");
            if (!imageMotion) return;

            gsap.fromTo(
                imageMotion,
                { yPercent: 4 },
                {
                    yPercent: -4,
                    ease: "none",
                    scrollTrigger: {
                        trigger: card,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 0.7,
                    },
                }
            );
        });
    }, workElement);

    return () => ctx.revert();
};
