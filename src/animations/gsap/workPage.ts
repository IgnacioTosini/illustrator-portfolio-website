import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motionPreset } from "./motionPreset";
import { prefersReducedMotion } from "./reducedMotion";

gsap.registerPlugin(ScrollTrigger);

export const animateWorkPage = (workPageElement: HTMLElement) => {
    const ctx = gsap.context(() => {
        if (prefersReducedMotion()) return;

        const tl = gsap.timeline({
            defaults: {
                ease: motionPreset.ease,
            },
        });

        gsap.set(".imageContainer", {
            clipPath: "inset(0 0 100% 0)",
        });

        tl.to(".imageContainer", {
            clipPath: "inset(0 0 0% 0)",
            duration: 0.9,
            ease: "power4.inOut",
        })
            .fromTo(
                ".projectImage",
                {
                    autoAlpha: 0,
                    scale: 1.06,
                    filter: "blur(8px)",
                },
                {
                    autoAlpha: 1,
                    scale: 1,
                    filter: "blur(0px)",
                    duration: 1,
                    clearProps: "filter",
                },
                "<+0.06"
            );

        const contentTl = gsap.timeline({
            scrollTrigger: {
                trigger: ".projectData",
                start: "top 88%",
                once: true,
            },
            defaults: {
                ease: motionPreset.ease,
            },
        });

        contentTl
            .from(
                ".backButton",
                {
                    autoAlpha: 0,
                    y: 14,
                    duration: motionPreset.itemDuration,
                },
            )
            .from(
                ".projectDataSidebar span",
                {
                    autoAlpha: 0,
                    y: 12,
                    duration: 0.3,
                    stagger: 0.06,
                },
                "-=0.2"
            )
            .from(
                ".projectDataHeader h1, .projectDataHeader .client, .projectDataHeader .description",
                {
                    autoAlpha: 0,
                    y: 22,
                    duration: motionPreset.itemDuration,
                    stagger: 0.08,
                },
                "-=0.2"
            );

        const imagesTl = gsap.timeline({
            scrollTrigger: {
                trigger: ".imagesList",
                start: "top 92%",
                once: true,
            },
            defaults: {
                ease: motionPreset.ease,
            },
        });

        imagesTl.fromTo(
            ".imagesList .projectCardImage",
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
                stagger: 0.07,
                clearProps: "opacity,visibility,transform",
            }
        );
    }, workPageElement);

    return () => ctx.revert();
};