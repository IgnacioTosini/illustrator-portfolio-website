"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { usePathname, useRouter } from "next/navigation";
import { links } from "@/utils/links";
import { animateHeader } from "@/animations/gsap/header";
import { prefersReducedMotion } from "@/animations/gsap/reducedMotion";
import { Links } from "@/components/ui/Links/Links";
import Link from "next/link";
import "./_header.scss";

export default function Header() {
    const headerRef = useRef<HTMLDivElement | null>(null);
    const pathname = usePathname();
    const router = useRouter();

    const runTopMicroAnimation = () => {
        if (prefersReducedMotion()) return;

        window.setTimeout(() => {
            const heroElement = document.querySelector(".heroSection");
            if (!heroElement) return;

            gsap.fromTo(
                heroElement,
                {
                    autoAlpha: 0.92,
                    y: 10,
                },
                {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.4,
                    ease: "power2.out",
                }
            );

            gsap.fromTo(
                ".heroSection .titleContainer .subTitle",
                {
                    autoAlpha: 0.7,
                    y: 10,
                },
                {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.5,
                    ease: "power3.out",
                }
            );
        }, 120);
    };

    const handleGoTop = (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();

        if (pathname === "/") {
            window.history.replaceState(null, "", "/#top");
            window.scrollTo({ top: 0, behavior: "smooth" });
            runTopMicroAnimation();
            return;
        }

        router.push("/#top");
        window.setTimeout(() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
            runTopMicroAnimation();
        }, 120);
    };

    useGSAP(
        () => {
            if (!headerRef.current) return;
            return animateHeader(headerRef.current);
        },
        { scope: headerRef }
    );

    return (
        <div ref={headerRef} className="header">
            <Link href='/' className="header-link name" onClick={handleGoTop}>Alukkart</Link>
            <Links links={links} />
        </div>
    )
}
