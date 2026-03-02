import gsap from "gsap";
import { prefersReducedMotion } from "./reducedMotion";

export const animateHeader = (headerElement: HTMLElement) => {
    const ctx = gsap.context(() => {
        if (prefersReducedMotion()) return;

        const nameElement = headerElement.querySelector(".name");
        const linkElements = headerElement.querySelectorAll(".link");

        gsap.killTweensOf(headerElement);
        if (nameElement) gsap.killTweensOf(nameElement);
        if (linkElements.length > 0) gsap.killTweensOf(linkElements);

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
            clearProps: "opacity,visibility,transform",
        })

        if (nameElement) {
            tl.from(
                nameElement,
                {
                    y: -22,
                    scale: 0.9,
                    autoAlpha: 0,
                    duration: 0.55,
                    ease: "back.out(1.8)",
                    clearProps: "opacity,visibility,transform",
                },
                "-=0.35"
            );
        }

        if (linkElements.length > 0) {
            tl.from(
                linkElements,
                {
                    y: -20,
                    rotateX: -70,
                    autoAlpha: 0,
                    stagger: 0.1,
                    duration: 0.5,
                    ease: "back.out(1.6)",
                    clearProps: "opacity,visibility,transform",
                },
                "-=0.35"
            );
        }
    }, headerElement);

    return () => ctx.revert();
};