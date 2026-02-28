"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Project } from "@/types";
import { ClientList } from "@/components/project/ClientList/ClientList";
import { ProjectList } from "@/components/project/ProjectList/ProjectList";
import './_worksClient.scss'

interface Props {
    projects: Project[];
}

export default function WorksClient({ projects }: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const clientsBySlug = useMemo(
        () => new Map(projects.flatMap((project) => (project.client?.slug ? [[project.client.slug, project.client]] : []))),
        [projects]
    );

    const clientsById = useMemo(
        () => new Map(projects.flatMap((project) => (project.client?.id ? [[project.client.id, project.client]] : []))),
        [projects]
    );

    const selectedClientFromUrl = searchParams.get('client');
    const selectedClient = selectedClientFromUrl
        ? (clientsBySlug.get(selectedClientFromUrl)?.slug
            ?? clientsById.get(selectedClientFromUrl)?.slug
            ?? null)
        : null;

    const handleSelectClient = useCallback((clientSlug: string | null) => {
        const params = new URLSearchParams(searchParams.toString());

        if (clientSlug) {
            params.set('client', clientSlug);
        } else {
            params.delete('client');
        }

        const nextQuery = params.toString();
        router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
    }, [pathname, router, searchParams]);

    const filteredProjects = selectedClient
        ? projects.filter(project => project.client?.slug === selectedClient)
        : projects;

    return (
        <div className="worksClient">
            <ClientList
                selectedClient={selectedClient}
                onSelectClient={handleSelectClient}
            />
            <span className="totalProjects">{filteredProjects.length} {filteredProjects.length === 1 ? 'proyecto' : 'proyectos'}</span>
            <ProjectList
                projects={filteredProjects}
                selectedClientParam={selectedClient}
            />
        </div>
    );
}