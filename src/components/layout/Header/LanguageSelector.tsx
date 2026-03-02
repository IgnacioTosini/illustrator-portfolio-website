"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/providers/LanguageProvider";

export function LanguageSelector() {
    const languageMenuRef = useRef<HTMLDivElement | null>(null);
    const { locale, setLocale, t } = useLanguage();
    const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
    const languageLabel = locale === "es" ? "ES" : "EN";

    useEffect(() => {
        if (!isLanguageMenuOpen) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (!languageMenuRef.current) return;
            if (!languageMenuRef.current.contains(event.target as Node)) {
                setIsLanguageMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isLanguageMenuOpen]);

    return (
        <div className="theme-menu" ref={languageMenuRef}>
            <button
                type="button"
                className="theme-toggle"
                onClick={() => setIsLanguageMenuOpen((prev) => !prev)}
                aria-label={t("header.openLanguageSelector")}
                title={t("header.changeLanguage")}
                aria-expanded={isLanguageMenuOpen}
            >
                <span className="theme-toggle-label language-toggle-label">{languageLabel}</span>
            </button>

            {isLanguageMenuOpen ? (
                <div className="theme-dropdown" role="menu" aria-label={t("header.languageSelector")}>
                    <button
                        type="button"
                        role="menuitemradio"
                        aria-checked={locale === "es"}
                        className={`theme-option ${locale === "es" ? "is-active" : ""}`}
                        onClick={() => {
                            setLocale("es");
                            setIsLanguageMenuOpen(false);
                        }}
                    >
                        {t("header.languageEs")}
                    </button>
                    <button
                        type="button"
                        role="menuitemradio"
                        aria-checked={locale === "en"}
                        className={`theme-option ${locale === "en" ? "is-active" : ""}`}
                        onClick={() => {
                            setLocale("en");
                            setIsLanguageMenuOpen(false);
                        }}
                    >
                        {t("header.languageEn")}
                    </button>
                </div>
            ) : null}
        </div>
    );
}
