'use server'

import { mapProject } from "@/lib/mappers/project.mapper";
import { prisma } from "@/lib/prisma";
import type { Project } from "@/types";
import type { Prisma } from "@prisma/client";

export interface ProjectPage {
    projects: Project[];
    totalItems: number;
    currentPage: number;
}

interface ProjectPageOptions {
    page: number;
    pageSize: number;
    search?: string;
    client?: string | null;
}

export const getProjectsPage = async ({ page, pageSize, search = '', client }: ProjectPageOptions): Promise<ProjectPage> => {
    const normalizedPage = Number.isSafeInteger(page) ? Math.min(1_000_000, Math.max(1, page)) : 1;
    const normalizedPageSize = Number.isSafeInteger(pageSize) ? Math.min(50, Math.max(1, pageSize)) : 12;
    const normalizedSearch = search.trim().slice(0, 100);
    const normalizedClient = client?.trim();

    const filters: Prisma.ProjectWhereInput[] = [];
    if (normalizedClient) {
        filters.push({
            client: { is: { OR: [{ slug: normalizedClient }, { id: normalizedClient }] } },
        });
    }
    if (normalizedSearch) {
        filters.push({
            OR: [
                { title: { contains: normalizedSearch, mode: 'insensitive' } },
                { client: { is: { name: { contains: normalizedSearch, mode: 'insensitive' } } } },
                { category: { is: { name: { contains: normalizedSearch, mode: 'insensitive' } } } },
            ],
        });
    }
    const where: Prisma.ProjectWhereInput = filters.length ? { AND: filters } : {};

    const findPage = (currentPage: number) => prisma.project.findMany({
        where,
        include: {
            client: true,
            category: true,
            images: { orderBy: { order: 'asc' }, take: 1 },
        },
        orderBy: [{ updatedAt: 'desc' }, { id: 'asc' }],
        skip: (currentPage - 1) * normalizedPageSize,
        take: normalizedPageSize,
    });

    const [totalItems, requestedProjects] = await Promise.all([
        prisma.project.count({ where }),
        findPage(normalizedPage),
    ]);
    const totalPages = Math.max(1, Math.ceil(totalItems / normalizedPageSize));
    const currentPage = Math.min(normalizedPage, totalPages);
    const pageProjects = currentPage === normalizedPage ? requestedProjects : await findPage(currentPage);

    return {
        projects: pageProjects.map(mapProject),
        totalItems,
        currentPage,
    };
};

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
                    take: 1,
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
