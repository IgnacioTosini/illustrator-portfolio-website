"use client";

import { useQuery } from "@tanstack/react-query";

async function fetchProjects() {
    const res = await fetch("/api/projects", { cache: "no-store" });
    if (!res.ok) throw new Error("Error al obtener proyectos");
    return res.json();
}

export function useProjectsQuery() {
    return useQuery({
        queryKey: ["projects"],
        queryFn: fetchProjects,
    });
}