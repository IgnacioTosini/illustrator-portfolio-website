"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { links } from "@/utils/links";
import { animateHeader } from "@/animations/gsap/header";
import { prefersReducedMotion } from "@/animations/gsap/reducedMotion";
import { Links } from "@/components/ui/Links/Links";
import Link from "next/link";
import "./_header.scss";

export default function Header() {
    const headerRef = useRef<HTMLDivElement | null>(null);
    const themeMenuRef = useRef<HTMLDivElement | null>(null);
    const pathname = usePathname();
    const router = useRouter();
    const { theme, resolvedTheme, setTheme } = useTheme();
    const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
    const selectedTheme = theme ?? "system";

    const themeLabel =
        selectedTheme === "light"
            ? "Claro"
            : selectedTheme === "dark"
                ? "Oscuro"
                : "Sistema";

    useEffect(() => {
        if (!isThemeMenuOpen) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (!themeMenuRef.current) return;
            if (!themeMenuRef.current.contains(event.target as Node)) {
                setIsThemeMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isThemeMenuOpen]);

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
        { scope: headerRef, dependencies: [], revertOnUpdate: true }
    );

    return (
        <div ref={headerRef} className="header">
            <Link href='/' className="header-link name" onClick={handleGoTop}>Alukkart</Link>
            <div className="header-actions">
                <Links links={links} />
                <div className="theme-menu" ref={themeMenuRef}>
                    <button
                        type="button"
                        className="theme-toggle"
                        onClick={() => setIsThemeMenuOpen((prev) => !prev)}
                        aria-label="Abrir selector de tema"
                        title="Cambiar tema"
                        aria-expanded={isThemeMenuOpen}
                    >
                        <span suppressHydrationWarning>{resolvedTheme === "dark" ? "🌙" : "☀️"}</span>
                        <span suppressHydrationWarning className="theme-toggle-label">{themeLabel}</span>
                    </button>

                    {isThemeMenuOpen ? (
                        <div className="theme-dropdown" role="menu" aria-label="Selector de tema">
                            <button
                                type="button"
                                role="menuitemradio"
                                aria-checked={selectedTheme === "light"}
                                className={`theme-option ${selectedTheme === "light" ? "is-active" : ""}`}
                                onClick={() => {
                                    setTheme("light");
                                    setIsThemeMenuOpen(false);
                                }}
                            >
                                Claro
                            </button>
                            <button
                                type="button"
                                role="menuitemradio"
                                aria-checked={selectedTheme === "dark"}
                                className={`theme-option ${selectedTheme === "dark" ? "is-active" : ""}`}
                                onClick={() => {
                                    setTheme("dark");
                                    setIsThemeMenuOpen(false);
                                }}
                            >
                                Oscuro
                            </button>
                            <button
                                type="button"
                                role="menuitemradio"
                                aria-checked={selectedTheme === "system"}
                                className={`theme-option ${selectedTheme === "system" ? "is-active" : ""}`}
                                onClick={() => {
                                    setTheme("system");
                                    setIsThemeMenuOpen(false);
                                }}
                            >
                                Sistema
                            </button>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    )
}
