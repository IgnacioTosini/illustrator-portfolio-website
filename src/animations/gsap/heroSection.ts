import gsap from "gsap";
import { prefersReducedMotion } from "./reducedMotion";

export const animateHeroSection = (heroElement: HTMLElement) => {
    const ctx = gsap.context(() => {
        if (prefersReducedMotion()) return;

        const tl = gsap.timeline({
            defaults: {
                ease: "power3.out",
            },
        });

        gsap.set(heroElement, { autoAlpha: 1 });
        gsap.set(".heroImageReveal", {
            clipPath: "inset(0 0 100% 0)",
        });

        tl.to(".heroImageReveal", {
            clipPath: "inset(0 0 0% 0)",
            duration: 0.95,
            ease: "power4.inOut",
        })
            .fromTo(
                ".heroSection img",
                {
                    autoAlpha: 0,
                    y: 24,
                    scale: 1.08,
                    filter: "blur(10px)",
                },
                {
                    autoAlpha: 1,
                    y: 0,
                    scale: 1,
                    filter: "blur(0px)",
                    duration: 1,
                    ease: "power3.out",
                    clearProps: "filter",
                },
                "<+0.08"
            )
            .from(
                ".titleContainer .title",
                {
                    autoAlpha: 0,
                    y: 20,
                    letterSpacing: "0.45em",
                    duration: 0.45,
                },
                "-=0.45"
            )
            .from(
                ".titleContainer .subTitle",
                {
                    autoAlpha: 0,
                    y: 28,
                    duration: 0.6,
                    ease: "back.out(1.4)",
                },
                "-=0.2"
            )
            .fromTo(
                ".heroSectionButton .viewButton",
                {
                    autoAlpha: 0,
                    y: 16,
                    scale: 0.95,
                },
                {
                    autoAlpha: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.45,
                    ease: "back.out(1.7)",
                    clearProps: "opacity,visibility,transform",
                },
                "-=0.2"
            );

        gsap.to(".heroSectionButton .viewButton svg", {
            y: 5,
            duration: 0.9,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: 1.1,
        });
    }, heroElement);

    return () => ctx.revert();
};