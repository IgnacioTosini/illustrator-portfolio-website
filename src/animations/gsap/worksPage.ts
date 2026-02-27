import gsap from "gsap";
import { motionPreset } from "./motionPreset";
import { prefersReducedMotion } from "./reducedMotion";

export const animateWorksPage = (worksElement: HTMLElement) => {
    const ctx = gsap.context(() => {
        if (prefersReducedMotion()) return;

        const tl = gsap.timeline({
            defaults: {
                ease: motionPreset.ease,
            },
        });

        tl.from(".titleContainer .title", {
            autoAlpha: 0,
            y: 18,
            letterSpacing: "0.32em",
            duration: motionPreset.titleDuration,
        })
            .from(
                ".titleContainer .subTitle",
                {
                    autoAlpha: 0,
                    y: 24,
                    duration: motionPreset.subtitleDuration,
                    ease: "back.out(1.2)",
                },
                "-=0.2"
            )
            .from(
                ".worksClient .clientList .client",
                {
                    autoAlpha: 0,
                    y: 12,
                    duration: 0.3,
                    stagger: 0.06,
                },
                "-=0.15"
            )
            .from(
                ".worksClient .totalProjects",
                {
                    autoAlpha: 0,
                    y: 12,
                    duration: 0.35,
                },
                "-=0.2"
            )
            .fromTo(
                ".worksClient .projectCard",
                {
                    autoAlpha: 0,
                    y: 26,
                    scale: 0.98,
                },
                {
                    autoAlpha: 1,
                    y: 0,
                    scale: 1,
                    duration: motionPreset.cardDuration,
                    stagger: 0.08,
                    clearProps: "opacity,visibility,transform",
                },
                "-=0.15"
            );
    }, worksElement);

    return () => ctx.revert();
};