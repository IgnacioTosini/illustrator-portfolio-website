'use server'

import { mapProject } from "@/lib/mappers/project.mapper";
import { prisma } from "@/lib/prisma";
import { Project } from "@/types";

export const getProjects = async (): Promise<Project[]> => {
    try {
        const projects = await prisma.project.findMany({
            include: {
                client: true,
                category: true,
                images: {
                    orderBy: {
                        order: 'asc',
                    },
                },
            },
            orderBy: {
                updatedAt: 'desc',
            },
        });

        return projects.map(mapProject);
    } catch (error) {
        console.error('Error al obtener proyectos', error)
        return []
    }
}

export const getFeaturedProjects = async (take?: number): Promise<Project[]> => {
    try {
        const projects = await prisma.project.findMany({
            where: {
                featured: true,
            },
            include: {
                client: true,
                category: true,
                images: {
                    orderBy: {
                        order: 'asc',
                    },
                },
            },
            orderBy: {
                updatedAt: 'desc',
            },
            take,
        });

        return projects.map(mapProject);
    } catch (error) {
        console.error('Error al obtener proyectos destacados', error)
        return []
    }
}
