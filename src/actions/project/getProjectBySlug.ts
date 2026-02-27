'use server'

import { mapProject } from "@/lib/mappers/project.mapper";
import { prisma } from "@/lib/prisma"
import { Project } from "@/types";

export const getProjectBySlug = async (slug: string): Promise<Project | null> => {
    try {
        if (!slug?.trim()) return null;
        const project = await prisma.project.findUnique({
            include: {
                client: true,
                category: true,
                images: true,
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
}