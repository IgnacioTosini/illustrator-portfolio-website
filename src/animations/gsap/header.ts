import gsap from "gsap";
import { prefersReducedMotion } from "./reducedMotion";

export const animateHeader = (headerElement: HTMLElement) => {
    const ctx = gsap.context(() => {
        if (prefersReducedMotion()) return;

        const tl = gsap.timeline({
            defaults: {
                ease: "power3.out",
            },
        });

        gsap.set(headerElement, {
            transformPerspective: 900,
        });

        tl.from(headerElement, {
            y: -28,
            autoAlpha: 0,
            duration: 0.6,
            ease: "power4.out",
        })
            .from(
                ".name",
                {
                    y: -22,
                    scale: 0.9,
                    autoAlpha: 0,
                    duration: 0.55,
                    ease: "back.out(1.8)",
                },
                "-=0.35"
            )
            .from(
            ".link",
            {
                y: -20,
                rotateX: -70,
                autoAlpha: 0,
                stagger: 0.1,
                duration: 0.5,
                ease: "back.out(1.6)",
            },
            "-=0.35"
        );

        gsap.to(".name", {
            y: "+=-2",
            duration: 1.8,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            delay: 1.2,
        });
    }, headerElement);

    return () => ctx.revert();
};