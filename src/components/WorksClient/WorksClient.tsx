"use client";

import { useState } from "react";
import { Project } from "@/types";
import { ClientList } from "@/components/project/ClientList/ClientList";
import { ProjectList } from "@/components/project/ProjectList/ProjectList";
import './_worksClient.scss'

interface Props {
    projects: Project[];
}

export default function WorksClient({ projects }: Props) {
    const [selectedClient, setSelectedClient] = useState<string | null>(null);
    const filteredProjects = selectedClient
        ? projects.filter(project => project.client?.id === selectedClient)
        : projects;

    return (
        <div className="worksClient">
            <ClientList
                selectedClient={selectedClient}
                onSelectClient={setSelectedClient}
            />
            <span className="totalProjects">{filteredProjects.length} {filteredProjects.length === 1 ? 'proyecto' : 'proyectos'}</span>
            <ProjectList
                projects={filteredProjects}
            />
        </div>
    );
}