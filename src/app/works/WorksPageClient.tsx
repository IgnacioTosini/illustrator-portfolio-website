"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { Title } from "@/components";
import WorksClient from "@/components/WorksClient/WorksClient";
import { Project } from "@/types";
import { animateWorksPage } from "@/animations/gsap/worksPage";
import { useLanguage } from "@/providers/LanguageProvider";

interface Props {
    projects: Project[];
}

export default function WorksPageClient({ projects }: Props) {
    const worksRef = useRef<HTMLDivElement | null>(null);
    const { t } = useLanguage();

    useGSAP(
        () => {
            if (!worksRef.current) return;
            return animateWorksPage(worksRef.current);
        },
        { scope: worksRef }
    );

    return (
        <div ref={worksRef} className="worksContent">
            <Title headingLevel={1} title={t("worksPage.title")} subTitle={t("worksPage.subtitle")} />
            <WorksClient projects={projects} />
        </div>
    );
}