import 'server-only';

import { prisma } from '@/lib/prisma';

export interface AdjacentProject {
    slug: string;
    title: string;
    image: string;
}

export async function getAdjacentProjects(slug: string): Promise<{ previous: AdjacentProject | null; next: AdjacentProject | null }> {
    const current = await prisma.project.findUnique({ where: { slug }, select: { id: true, updatedAt: true } });
    if (!current) return { previous: null, next: null };

    const select = { slug: true, title: true, images: { select: { url: true }, orderBy: { order: 'asc' as const }, take: 1 } };
    const [previous, next] = await Promise.all([
        prisma.project.findFirst({
            where: { OR: [{ updatedAt: { gt: current.updatedAt } }, { updatedAt: current.updatedAt, id: { lt: current.id } }] },
            orderBy: [{ updatedAt: 'asc' }, { id: 'desc' }],
            select,
        }),
        prisma.project.findFirst({
            where: { OR: [{ updatedAt: { lt: current.updatedAt } }, { updatedAt: current.updatedAt, id: { gt: current.id } }] },
            orderBy: [{ updatedAt: 'desc' }, { id: 'asc' }],
            select,
        }),
    ]);

    const map = (project: typeof previous): AdjacentProject | null => project
        ? { slug: project.slug, title: project.title, image: project.images[0]?.url ?? '/alukkart.webp' }
        : null;
    return { previous: map(previous), next: map(next) };
}
