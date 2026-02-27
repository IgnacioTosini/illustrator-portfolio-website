import type { Metadata } from "next";
import { getProjects } from "@/actions/project/getProjects";
import WorksPageClient from "./WorksPageClient";
import './_worksPage.scss'

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
    title: "Trabajos",
    description: "Todos los trabajos de ilustración de Alukkart: proyectos recientes, editoriales y diseño de personajes.",
    alternates: {
        canonical: "/works",
    },
};

export default async function WorksPage() {
    const projects = await getProjects()

    return (
        <div className="worksPage">
            <WorksPageClient projects={projects} />
        </div>
    );
}