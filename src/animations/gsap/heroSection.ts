import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "./reducedMotion";

gsap.registerPlugin(ScrollTrigger);

interface HeroAnimationOptions {
    preview?: boolean;
}

export const animateHeroSection = (heroElement: HTMLElement, { preview = false }: HeroAnimationOptions = {}) => {
    const media = gsap.matchMedia(heroElement);
    const ctx = gsap.context(() => {
        if (prefersReducedMotion()) return;

        const intro = gsap.timeline({
            defaults: { ease: "power3.out" },
        });

        gsap.set(heroElement, { autoAlpha: 1 });
        gsap.set(".heroImageReveal", {
            clipPath: "inset(0 0 100% 0)",
        });

        intro.to(".heroImageReveal", {
            clipPath: "inset(0 0 0% 0)",
            duration: 0.95,
            ease: "power4.inOut",
        })
            .fromTo(
                ".heroPortraitImage",
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

        if (preview) return;

        media.add("(min-width: 900px) and (min-height: 620px) and (prefers-reduced-motion: no-preference)", () => {
            const scene = gsap.timeline({
                scrollTrigger: {
                    trigger: heroElement,
                    start: "top top+=64",
                    end: () => `+=${Math.round(window.innerHeight * 0.85)}`,
                    pin: heroElement,
                    pinSpacing: true,
                    scrub: 0.55,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                },
            });

            scene
                .fromTo(
                    ".heroScrollScene",
                    {
                        autoAlpha: 0,
                        clipPath: "inset(18% 28% 18% 28% round 24px)",
                    },
                    {
                        autoAlpha: 1,
                        clipPath: "inset(0% 0% 0% 0% round 0px)",
                        scale: 1,
                        duration: 0.55,
                        ease: "none",
                    },
                    0
                )
                .to(
                    ".heroImageReveal",
                    { scale: 1.025, y: -8, duration: 1, ease: "none" },
                    0
                )
                .to(
                    ".heroCopy",
                    { autoAlpha: 0, y: -20, duration: 0.27, ease: "none" },
                    0
                )
                .to(
                    ".heroPortraitImage",
                    { autoAlpha: 0, scale: 1.06, duration: 0.34, ease: "none" },
                    0.2
                )
                .fromTo(
                    ".heroFeaturedImage",
                    { autoAlpha: 0, scale: 1.08 },
                    { autoAlpha: 1, scale: 1, duration: 0.36, ease: "none" },
                    0.2
                )
                .fromTo(
                    ".heroProjectPreview",
                    { autoAlpha: 0, y: 28 },
                    { autoAlpha: 1, y: 0, duration: 0.3, ease: "none" },
                    0.4
                );
        });
    }, heroElement);

    return () => {
        ctx.revert();
        media.revert();
    };
};
