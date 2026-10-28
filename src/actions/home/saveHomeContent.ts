'use server';

import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import type { HomeContent } from '@/types/home-content';
import { mergeHomeContent } from '@/lib/home-content-defaults';
import { uploadBase64ImageToCloudinary } from '@/lib/services/cloudinary.service';
import { requireDashboardAuth } from '@/lib/auth/dashboard';

async function storeImage(value: string, name: string): Promise<string> {
    if (!value.startsWith('data:image/')) {
        if (value.startsWith('/') && !value.startsWith('//')) return value;
        if (value.startsWith('https://res.cloudinary.com/')) return value;
        throw new Error('La imagen debe ser una imagen local o estar alojada en Cloudinary.');
    }

    if (value.length > 18_000_000) throw new Error('La imagen supera el tamaño máximo permitido de 12 MB.');
    if (!/^data:image\/(png|jpeg|webp|avif);base64,/.test(value)) throw new Error('Formato de imagen no compatible.');
    return uploadBase64ImageToCloudinary(value, name);
}

export async function saveHomeContent(input: unknown): Promise<HomeContent> {
    await requireDashboardAuth();

    const homeContentModel = (prisma as unknown as {
        homeContent?: {
            upsert: (args: {
                where: { id: string };
                create: { id: string; content: Prisma.InputJsonValue };
                update: { content: Prisma.InputJsonValue };
            }) => Promise<unknown>;
        };
    }).homeContent;
    if (!homeContentModel) {
        throw new Error('Prisma Client está desactualizado. Detén y vuelve a iniciar el servidor con npm run dev para regenerarlo.');
    }

    const content = mergeHomeContent(input);
    const [heroImage, aboutImage] = await Promise.all([
        storeImage(content.heroImage, 'home-hero'),
        storeImage(content.aboutImage, 'home-about'),
    ]);
    const savedContent = { ...content, heroImage, aboutImage };

    try {
        await homeContentModel.upsert({
            where: { id: 'home' },
            create: { id: 'home', content: savedContent as Prisma.InputJsonValue },
            update: { content: savedContent as Prisma.InputJsonValue },
        });
    } catch (error) {
        if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2021') {
            throw new Error('Falta crear la tabla del contenido de inicio. Ejecuta npx prisma migrate deploy --schema prisma/schema.prisma.');
        }
        throw error;
    }

    revalidatePath('/');
    revalidatePath('/dashboard/home');
    return savedContent;
}
