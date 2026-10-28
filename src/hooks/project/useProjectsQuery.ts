"use client";

import { useQuery } from "@tanstack/react-query";
import type { Project } from "@/types";
import { ADMIN_PROJECTS_PAGE_SIZE } from "@/lib/pagination";

export interface ProjectPageResult {
    projects: Project[];
    totalItems: number;
    currentPage: number;
}

async function fetchProjects(page: number, search: string): Promise<ProjectPageResult> {
    const params = new URLSearchParams({ page: String(page), pageSize: String(ADMIN_PROJECTS_PAGE_SIZE) });
    if (search.trim()) params.set('search', search.trim());
    const res = await fetch(`/api/projects?${params.toString()}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Error al obtener proyectos");
    return res.json();
}

export function useProjectsQuery(page: number, search: string) {
    return useQuery({
        queryKey: ["projects", page, search.trim()],
        queryFn: () => fetchProjects(page, search),
    });
}
