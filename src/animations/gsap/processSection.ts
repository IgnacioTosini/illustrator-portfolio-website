import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motionPreset } from "./motionPreset";
import { prefersReducedMotion } from "./reducedMotion";

gsap.registerPlugin(ScrollTrigger);

export const animateProcessSection = (processElement: HTMLElement) => {
    const ctx = gsap.context(() => {
        if (prefersReducedMotion()) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: processElement,
                start: motionPreset.sectionTriggerStart,
                once: true,
            },
            defaults: {
                ease: motionPreset.ease,
            },
        });

        tl.from(".titleContainer .title", {
            autoAlpha: 0,
            y: 18,
            letterSpacing: "0.35em",
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
            .fromTo(
                ".processCard",
                {
                    autoAlpha: 0,
                    y: 34,
                    scale: 0.96,
                },
                {
                    autoAlpha: 1,
                    y: 0,
                    scale: 1,
                    duration: motionPreset.cardDuration,
                    stagger: 0.1,
                    clearProps: "opacity,visibility,transform",
                },
                "-=0.1"
            )
            .from(
                ".processCard .processIcon",
                {
                    autoAlpha: 0,
                    scale: 0.75,
                    rotate: -8,
                    duration: 0.35,
                    stagger: 0.08,
                    ease: "back.out(1.8)",
                },
                "-=0.45"
            );
    }, processElement);

    return () => ctx.revert();
};