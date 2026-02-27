import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motionPreset } from "./motionPreset";
import { prefersReducedMotion } from "./reducedMotion";

gsap.registerPlugin(ScrollTrigger);

export const animateWorkSection = (workElement: HTMLElement) => {
    const ctx = gsap.context(() => {
        if (prefersReducedMotion()) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: workElement,
                start: motionPreset.sectionTriggerStart,
                once: true,
            },
            defaults: {
                ease: motionPreset.ease,
            },
        });

        tl.from(".titleContainer .title", {
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
            )
            .fromTo(
                ".projectCard",
                {
                    autoAlpha: 0,
                    y: 36,
                    scale: 0.97,
                },
                {
                    autoAlpha: 1,
                    y: 0,
                    scale: 1,
                    duration: motionPreset.cardDuration,
                    stagger: 0.12,
                    clearProps: "opacity,visibility,transform",
                },
                "-=0.15"
            );
    }, workElement);

    return () => ctx.revert();
};