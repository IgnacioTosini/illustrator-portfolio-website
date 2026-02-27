"use client";

import { useQuery } from "@tanstack/react-query";

async function fetchProjectBySlug(slug: string) {
    const res = await fetch(`/api/projects/by-slug/${encodeURIComponent(slug)}`, {
        cache: "no-store",
    });

    if (res.status === 404) return null; // no lanzar error
    if (!res.ok) throw new Error("Error al obtener proyecto");

    return res.json();
}

export function useProjectBySlugQuery(slug?: string) {
    return useQuery({
        queryKey: ["project", slug],
        queryFn: () => fetchProjectBySlug(slug as string),
        enabled: !!slug?.trim(),
        retry: false,
    });
}