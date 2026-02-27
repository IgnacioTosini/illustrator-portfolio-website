import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motionPreset } from "./motionPreset";
import { prefersReducedMotion } from "./reducedMotion";

gsap.registerPlugin(ScrollTrigger);

export const animateContactSection = (contactElement: HTMLElement) => {
    const ctx = gsap.context(() => {
        if (prefersReducedMotion()) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: contactElement,
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
                ".moreInfoContent > p",
                {
                    autoAlpha: 0,
                    y: 18,
                    duration: motionPreset.itemDuration,
                },
                "-=0.2"
            )
            .from(
                ".personalData a, .socialMedias .icon",
                {
                    autoAlpha: 0,
                    y: 14,
                    duration: 0.4,
                    stagger: 0.08,
                },
                "-=0.15"
            )
            .fromTo(
                ".contactForm .field",
                {
                    autoAlpha: 0,
                    y: 22,
                },
                {
                    autoAlpha: 1,
                    y: 0,
                    duration: motionPreset.itemDuration,
                    stagger: 0.1,
                    clearProps: "opacity,visibility,transform",
                },
                "-=0.1"
            )
            .fromTo(
                ".contactForm button",
                {
                    autoAlpha: 0,
                    y: 12,
                    scale: 0.96,
                },
                {
                    autoAlpha: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.4,
                    ease: "back.out(1.7)",
                    clearProps: "opacity,visibility,transform",
                },
                "-=0.15"
            );
    }, contactElement);

    return () => ctx.revert();
};