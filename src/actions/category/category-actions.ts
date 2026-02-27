'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';

export async function createCategory(formData: FormData) {
    const name = String(formData.get('name') ?? '').trim();
    const slug = String(formData.get('slug') ?? '').trim();

    if (!name || !slug) {
        return { ok: false, message: 'Nombre y slug son requeridos.' };
    }

    const existing = await prisma.category.findFirst({ where: { slug } });
    if (existing) {
        return { ok: false, message: 'Ya existe una categoría con ese slug.', error: existing };
    }

    try {
        await prisma.category.create({
            data: {
                name,
                slug,
            }
        });

        revalidatePath('/dashboard/categories');
        return { ok: true, message: 'Categoría creada.' };
    } catch (error) {
        console.error('Error al crear la categoría:', error);
        return { ok: false, message: 'Error al crear la categoría.', error };
    }
}

export async function updatedCategory(formData: FormData) {
    const id = String(formData.get('id') ?? '');
    const name = String(formData.get('name') ?? '').trim();
    const slug = String(formData.get('slug') ?? '').trim();

    if (!id || !name || !slug) {
        return { ok: false, message: 'ID, nombre y slug son requeridos.' };
    }
    const category = await prisma.category.findFirst({ where: { id } });
    if (!category) {
        return { ok: false, message: 'Categoría no encontrada.' };
    }

    const existing = await prisma.category.findFirst({ where: { slug, NOT: { id } } });
    if (existing) {
        return { ok: false, message: 'Ya existe otra categoría con ese slug.', error: existing };
    }

    try {
        await prisma.category.update({
            where: { id },
            data: { name, slug },
        });

        revalidatePath('/dashboard/categories');
        return { ok: true, message: 'Categoría actualizada.' };
    } catch (error) {
        console.error('Error al actualizar la categoría:', error);
        return { ok: false, message: 'Error al actualizar la categoría.', error };
    }
}

export async function deleteCategory(formData: FormData) {
    const id = String(formData.get('id') ?? '');

    if (!id) {
        return { ok: false, message: 'ID inválido.' };
    }

    const inUse = await prisma.project.count({ where: { categoryId: id } });
    if (inUse > 0) {
        return { ok: false, message: 'No se puede eliminar una categoría con proyectos asociados.' };
    }

    try {
        await prisma.category.delete({ where: { id } });
        revalidatePath('/dashboard/categories');
        return { ok: true, message: 'Categoría eliminada.' };
    } catch (error) {
        console.error('Error al eliminar la categoría:', error);
        return { ok: false, message: 'Error al eliminar la categoría.', error };
    }
}