import 'server-only';

import { cache } from 'react';
import { mapProject } from "@/lib/mappers/project.mapper";
import { prisma } from "@/lib/prisma"
import type { Project } from "@/types";

export const getProjectBySlug = cache(async (slug: string): Promise<Project | null> => {
    try {
        if (!slug?.trim()) return null;
        const project = await prisma.project.findUnique({
            include: {
                client: true,
                category: true,
                images: { orderBy: { order: 'asc' } },
            },
            where: {
                slug
            }
        })

        if (!project) return null;

        return mapProject(project)

    } catch (error) {
        console.log(error)
        throw new Error('Error al obtener project por slug')
    }
});
