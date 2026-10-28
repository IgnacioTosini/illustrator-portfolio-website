"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Project } from "@/types";
import { ClientList } from "@/components/project/ClientList/ClientList";
import { ProjectList } from "@/components/project/ProjectList/ProjectList";
import { useLanguage } from "@/providers/LanguageProvider";
import { getMessage } from "@/i18n/messages";
import { Pagination } from "@/components/ui/Pagination/Pagination";
import { PUBLIC_PROJECTS_PAGE_SIZE } from "@/lib/pagination";
import './_worksClient.scss'

interface Props {
    projects: Project[];
    totalItems: number;
    currentPage: number;
    selectedClient: string | null;
}

export default function WorksClient({ projects, totalItems, currentPage, selectedClient }: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { locale } = useLanguage();

    const handleSelectClient = useCallback((clientSlug: string | null) => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete('page');

        if (clientSlug) {
            params.set('client', clientSlug);
        } else {
            params.delete('client');
        }

        const nextQuery = params.toString();
        router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
    }, [pathname, router, searchParams]);

    const handlePageChange = useCallback((page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        if (page === 1) params.delete('page');
        else params.set('page', String(page));

        const nextQuery = params.toString();
        router.push(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
    }, [pathname, router, searchParams]);

    const totalProjectsLabel = totalItems === 1
        ? getMessage(locale, "works.projectSingular")
        : getMessage(locale, "works.projectPlural");

    return (
        <div className="worksClient">
            <ClientList
                selectedClient={selectedClient}
                onSelectClient={handleSelectClient}
            />
            <div className="worksGalleryBar">
                <span className="totalProjects">{totalItems} {totalProjectsLabel}</span>
                <span className="worksGalleryCue">{locale === "es" ? "Explorá cada obra" : "Explore each piece"} <span aria-hidden="true">↗</span></span>
            </div>
            <ProjectList
                projects={projects}
                selectedClientParam={selectedClient}
                selectedPageParam={currentPage}
                priorityImages
            />
            <Pagination
                currentPage={currentPage}
                totalItems={totalItems}
                pageSize={PUBLIC_PROJECTS_PAGE_SIZE}
                onPageChange={handlePageChange}
                labels={{
                    navigation: getMessage(locale, 'works.pagination'),
                    previous: getMessage(locale, 'works.previousPage'),
                    next: getMessage(locale, 'works.nextPage'),
                    first: getMessage(locale, 'works.firstPage'),
                    last: getMessage(locale, 'works.lastPage'),
                    page: (page) => `${getMessage(locale, 'works.pageLabel')} ${page}`,
                    showing: getMessage(locale, 'works.showing'),
                    of: getMessage(locale, 'works.of'),
                }}
            />
        </div>
    );
}
