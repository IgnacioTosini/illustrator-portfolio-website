import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motionPreset } from "./motionPreset";
import { prefersReducedMotion } from "./reducedMotion";

gsap.registerPlugin(ScrollTrigger);

export const animateAboutSection = (aboutElement: HTMLElement) => {
    const ctx = gsap.context(() => {
        if (prefersReducedMotion()) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: aboutElement,
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
                    y: 28,
                    duration: motionPreset.subtitleDuration,
                    ease: "back.out(1.2)",
                },
                "-=0.2"
            )
            .fromTo(
                ".aboutSectionContent img",
                {
                    autoAlpha: 0,
                    x: -24,
                    scale: 1.06,
                    filter: "blur(8px)",
                },
                {
                    autoAlpha: 1,
                    x: 0,
                    scale: 1,
                    filter: "blur(0px)",
                    duration: 0.8,
                    clearProps: "filter",
                },
                "-=0.15"
            )
            .from(
                ".aboutSectionText > p",
                {
                    autoAlpha: 0,
                    y: 20,
                    duration: motionPreset.itemDuration,
                    stagger: 0.1,
                },
                "-=0.45"
            )
            .from(
                ".aboutSectionAbilitiesTools .abilities, .aboutSectionAbilitiesTools .tools",
                {
                    autoAlpha: 0,
                    y: 18,
                    duration: motionPreset.itemDuration,
                    stagger: 0.12,
                },
                "-=0.25"
            )
            .from(
                ".abilitiList .abilitie, .toolList .tool",
                {
                    autoAlpha: 0,
                    y: 10,
                    duration: 0.3,
                    stagger: 0.04,
                },
                "-=0.2"
            );
    }, aboutElement);

    return () => ctx.revert();
};