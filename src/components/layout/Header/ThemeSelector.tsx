"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { useLanguage } from "@/providers/LanguageProvider";

export function ThemeSelector() {
    const themeMenuRef = useRef<HTMLDivElement | null>(null);
    const { t } = useLanguage();
    const { theme, resolvedTheme, setTheme } = useTheme();
    const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
    const selectedTheme = theme ?? "system";

    const themeLabel =
        selectedTheme === "light"
            ? t("header.themeLight")
            : selectedTheme === "dark"
                ? t("header.themeDark")
                : t("header.themeSystem");

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

    return (
        <div className="theme-menu" ref={themeMenuRef}>
            <button
                type="button"
                className="theme-toggle"
                onClick={() => setIsThemeMenuOpen((prev) => !prev)}
                aria-label={t("header.openThemeSelector")}
                title={t("header.changeTheme")}
                aria-expanded={isThemeMenuOpen}
            >
                <span suppressHydrationWarning>{resolvedTheme === "dark" ? "🌙" : "☀️"}</span>
                <span suppressHydrationWarning className="theme-toggle-label">{themeLabel}</span>
            </button>

            {isThemeMenuOpen ? (
                <div className="theme-dropdown" role="menu" aria-label={t("header.themeSelector")}>
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
                        {t("header.themeLight")}
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
                        {t("header.themeDark")}
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
                        {t("header.themeSystem")}
                    </button>
                </div>
            ) : null}
        </div>
    );
}
