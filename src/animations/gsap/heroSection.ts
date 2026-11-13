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
        gsap.set(".heroPortraitImage", {
            clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)",
            scale: 1.07,
        });
        gsap.set(".heroRevealLine", { xPercent: -300, autoAlpha: 0 });

        intro.to(".heroRevealLine", {
            xPercent: 450,
            autoAlpha: 0.85,
            duration: 1.05,
            ease: "power3.inOut",
        })
            .to(".heroPortraitImage", {
                clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
                scale: 1,
                duration: 1.05,
                ease: "power3.inOut",
            }, "<")
            .to(".heroRevealLine", { autoAlpha: 0, duration: 0.25 }, "-=0.25")
            .from(
                ".titleContainer .title",
                {
                    autoAlpha: 0,
                    y: 18,
                    duration: 0.5,
                },
                "-=0.75"
            )
            .from(
                ".titleContainer .subTitle",
                {
                    autoAlpha: 0,
                    y: 42,
                    duration: 0.8,
                    ease: "power3.out",
                },
                "-=0.3"
            )
            .from(".heroProof", { autoAlpha: 0, y: 18, duration: 0.55 }, "-=0.5")
            .fromTo(
                ".heroSectionButton > *",
                {
                    autoAlpha: 0,
                    y: 18,
                },
                {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.5,
                    stagger: 0.1,
                    ease: "power3.out",
                    clearProps: "opacity,visibility,transform",
                },
                "-=0.3"
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
