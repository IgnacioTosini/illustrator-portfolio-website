import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motionPreset } from "./motionPreset";
import { prefersReducedMotion } from "./reducedMotion";

gsap.registerPlugin(ScrollTrigger);

export const animateFooter = (footerElement: HTMLElement) => {
    const ctx = gsap.context(() => {
        if (prefersReducedMotion()) return;

        const isMobile = window.matchMedia("(max-width: 768px)").matches;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: footerElement,
                start: isMobile ? "top 120%" : "top 95%",
                once: true,
                invalidateOnRefresh: true,
            },
            defaults: {
                ease: motionPreset.ease,
            },
        });

        tl.fromTo(
            ".name",
            {
                autoAlpha: 0,
                y: 18,
            },
            {
                autoAlpha: 1,
                y: 0,
                duration: motionPreset.titleDuration,
                clearProps: "opacity,visibility,transform",
            }
        )
            .fromTo(
                ".footerLinks .link",
                {
                    autoAlpha: 0,
                    y: 14,
                },
                {
                    autoAlpha: 1,
                    y: 0,
                    duration: motionPreset.itemDuration,
                    stagger: 0.08,
                    clearProps: "opacity,visibility,transform",
                },
                "-=0.2"
            )
            .fromTo(
                ".footerLinks p",
                {
                    autoAlpha: 0,
                    y: 12,
                },
                {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.35,
                    clearProps: "opacity,visibility,transform",
                },
                "-=0.2"
            )
            .fromTo(
                ".socialMedias .icon",
                {
                    autoAlpha: 0,
                    y: 12,
                    scale: 0.9,
                },
                {
                    autoAlpha: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.35,
                    stagger: 0.06,
                    ease: "back.out(1.5)",
                    clearProps: "opacity,visibility,transform",
                },
                "-=0.2"
            );
    }, footerElement);

    return () => ctx.revert();
};