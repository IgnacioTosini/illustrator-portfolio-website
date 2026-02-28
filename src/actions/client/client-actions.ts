'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { toSlug } from '@/lib/utils';

const getUniqueClientSlug = async (name: string, excludeClientId?: string): Promise<string> => {
    const baseSlug = toSlug(name) || 'cliente';
    let candidateSlug = baseSlug;
    let suffix = 2;

    while (true) {
        const existing = await prisma.client.findFirst({
            where: {
                slug: candidateSlug,
                ...(excludeClientId ? { id: { not: excludeClientId } } : {}),
            },
            select: { id: true },
        });

        if (!existing) {
            return candidateSlug;
        }

        candidateSlug = `${baseSlug}-${suffix}`;
        suffix += 1;
    }
};

export async function createClient(formData: FormData) {
    const name = String(formData.get('name') ?? '').trim();
    const website = String(formData.get('website') ?? '').trim();

    if (!name) {
        return { ok: false, message: 'Nombre es requerido.' };
    }

    const existing = await prisma.client.findFirst({ where: { name } });
    if (existing) {
        return { ok: false, message: 'Ya existe un cliente con ese nombre.', error: existing };
    }

    try {
        const slug = await getUniqueClientSlug(name);

        await prisma.client.create({
            data: { name, slug, website }
        });

        revalidatePath('/dashboard/clients');
        return { ok: true, message: 'Cliente creado.' };
    } catch (error) {
        console.error('Error al crear el cliente:', error);
        return { ok: false, message: 'Error al crear el cliente.', error };
    }
}

export async function updatedClient(formData: FormData) {
    const id = String(formData.get('id') ?? '');
    const name = String(formData.get('name') ?? '').trim();
    const website = String(formData.get('website') ?? '').trim();

    if (!id || !name) {
        return { ok: false, message: 'ID y nombre son requeridos.' };
    }

    const existing = await prisma.client.findFirst({ where: { name, id: { not: id } } });
    if (existing) {
        return { ok: false, message: 'Ya existe otro cliente con ese nombre.', error: existing };
    }

    try {
        const slug = await getUniqueClientSlug(name, id);

        await prisma.client.update({
            where: { id },
            data: { name, slug, website },
        });

        revalidatePath('/dashboard/clients');
        return { ok: true, message: 'Cliente actualizado.' };
    } catch (error) {
        console.error('Error al actualizar el cliente:', error);
        return { ok: false, message: 'Error al actualizar el cliente.', error };
    }
}

export async function deleteClient(formData: FormData) {
    const id = String(formData.get('id') ?? '');

    if (!id) {
        return { ok: false, message: 'ID inválido.' };
    }

    const inUse = await prisma.project.count({ where: { clientId: id } });
    if (inUse > 0) {
        return { ok: false, message: 'No se puede eliminar un cliente con proyectos asociados.' };
    }

    try {
        await prisma.client.delete({ where: { id } });
        revalidatePath('/dashboard/clients');
        return { ok: true, message: 'Cliente eliminado.' };
    } catch (error) {
        console.error('Error al eliminar el cliente:', error);
        return { ok: false, message: 'Error al eliminar el cliente.', error };
    }
}