import type { Metadata } from "next";
import { getProjectsPage } from "@/actions/project/getProjects";
import WorksPageClient from "./WorksPageClient";
import { PUBLIC_PROJECTS_PAGE_SIZE } from "@/lib/pagination";
import './_worksPage.scss'

export const revalidate = 300;

export const metadata: Metadata = {
    title: "Trabajos",
    description: "Portfolio of comic character illustration projects by Lucas R. (alukkart): character design, concept art and fan art.",
    alternates: {
        canonical: "/works",
    },
};

interface Props {
    searchParams: Promise<{ client?: string | string[]; page?: string | string[] }>;
}

export default async function WorksPage({ searchParams }: Props) {
    const params = await searchParams;
    const client = typeof params.client === 'string' ? params.client : null;
    const requestedPage = typeof params.page === 'string' ? Number(params.page) : 1;
    let pageData: Awaited<ReturnType<typeof getProjectsPage>>;
    try {
        pageData = await getProjectsPage({
            page: requestedPage,
            pageSize: PUBLIC_PROJECTS_PAGE_SIZE,
            client,
        });
    } catch (error) {
        console.error('No se pudieron cargar los trabajos:', error);
        pageData = { projects: [], totalItems: 0, currentPage: 1 };
    }

    return (
        <div className="worksPage">
            <WorksPageClient
                projects={pageData.projects}
                totalItems={pageData.totalItems}
                currentPage={pageData.currentPage}
                selectedClient={client}
            />
        </div>
    );
}
