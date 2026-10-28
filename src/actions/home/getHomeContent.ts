import 'server-only';
import { prisma } from '@/lib/prisma';
import { DEFAULT_HOME_CONTENT, mergeHomeContent } from '@/lib/home-content-defaults';

const isMissingHomeContentTable = (error: unknown) =>
    typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2021';

export async function getHomeContent() {
    // Access the model dynamically so an old generated Prisma Client can fall
    // back to defaults while the dev server is being restarted/regenerated.
    const homeContentModel = (prisma as unknown as {
        homeContent?: {
            findUnique: (args: { where: { id: string } }) => Promise<{ content: unknown } | null>;
        };
    }).homeContent;

    if (!homeContentModel) return DEFAULT_HOME_CONTENT;

    try {
        const saved = await homeContentModel.findUnique({ where: { id: 'home' } });
        return saved ? mergeHomeContent(saved.content) : DEFAULT_HOME_CONTENT;
    } catch (error) {
        if (isMissingHomeContentTable(error)) return DEFAULT_HOME_CONTENT;
        console.error('No se pudo cargar el contenido del home:', error);
        return DEFAULT_HOME_CONTENT;
    }
}
