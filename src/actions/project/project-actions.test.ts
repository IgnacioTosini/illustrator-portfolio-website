import { beforeEach, describe, expect, it, vi } from 'vitest';
import { addProject, deleteProjectById, updateProject } from './project-actions';
import { getProjectsPage } from './getProjects';
import type { ProjectCreateInput, ProjectUpdateInput } from '@/types';

const { prisma, tx, uploadImages, deleteProjectImagesFromCloudinary, revalidatePath, requireDashboardAuth } = vi.hoisted(() => {
  const tx = {
    category: { upsert: vi.fn(), findUnique: vi.fn() },
    client: { findFirst: vi.fn(), findUnique: vi.fn(), create: vi.fn() },
    project: { create: vi.fn(), update: vi.fn() },
  };
  return {
    tx,
    prisma: {
      project: { findFirst: vi.fn(), findUnique: vi.fn(), findMany: vi.fn(), count: vi.fn(), delete: vi.fn() },
      $transaction: vi.fn(),
    },
    uploadImages: vi.fn(),
    deleteProjectImagesFromCloudinary: vi.fn(),
    revalidatePath: vi.fn(),
    requireDashboardAuth: vi.fn(),
  };
});

vi.mock('@/lib/prisma', () => ({ prisma }));
vi.mock('@/lib/auth/dashboard', () => ({ requireDashboardAuth }));
vi.mock('next/cache', () => ({ revalidatePath }));
vi.mock('@/lib/services', () => ({ uploadImages, deleteProjectImagesFromCloudinary }));
vi.mock('@/lib/mappers/project.mapper', () => ({ mapProject: (value: unknown) => value }));

const image = { id: 'new-image', url: 'data:image/png;base64,YQ==', alt: 'Ilustración', order: 0 };
const createInput: ProjectCreateInput = {
  title: 'Proyecto nuevo', slug: 'proyecto-nuevo', description: 'Descripción', year: 2026, featured: true,
  categoryId: 'cat-1', clientId: 'client-1', newCategoryName: '', newClientName: '', images: [image],
};
const updateInput: ProjectUpdateInput = {
  title: 'Proyecto editado', slug: 'proyecto-editado', description: 'Descripción editada', year: 2026,
  featured: false, categoryId: 'cat-1', clientId: 'client-1', newCategoryName: '', newClientName: '',
  keptExistingImageIds: ['keep'], images: [image],
};

describe('ABM de proyectos', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    prisma.$transaction.mockImplementation(async (callback: (client: typeof tx) => unknown) => callback(tx));
    tx.category.findUnique.mockResolvedValue({ id: 'cat-1' });
    tx.client.findUnique.mockResolvedValue({ id: 'client-1' });
    uploadImages.mockResolvedValue([{ id: 'new-image', url: 'https://res.cloudinary.com/new.webp', alt: 'Ilustración', order: 0 }]);
    deleteProjectImagesFromCloudinary.mockResolvedValue(undefined);
    tx.project.create.mockResolvedValue({ id: 'project-1', images: [], category: {}, client: {} });
    tx.project.update.mockResolvedValue({ id: 'project-1', images: [], category: {}, client: {} });
    prisma.project.findFirst.mockResolvedValue({ id: 'project-1', images: [{ id: 'keep', url: 'https://res.cloudinary.com/keep.webp' }, { id: 'remove', url: 'https://res.cloudinary.com/remove.webp' }] });
  });

  it('lista proyectos paginados y corrige páginas fuera de rango', async () => {
    prisma.project.count.mockResolvedValue(13);
    prisma.project.findMany.mockResolvedValueOnce([]).mockResolvedValueOnce([{ id: 'last-project', images: [], category: {}, client: {} }]);
    const result = await getProjectsPage({ page: 99, pageSize: 12 });
    expect(result.currentPage).toBe(2);
    expect(result.totalItems).toBe(13);
    expect(result.projects).toHaveLength(1);
    expect(prisma.project.findMany).toHaveBeenLastCalledWith(expect.objectContaining({ skip: 12, take: 12 }));
  });

  it('crea un proyecto con categoría, cliente e imagen', async () => {
    const result = await addProject(createInput);
    expect(result.id).toBe('project-1');
    expect(tx.project.create).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({
      title: 'Proyecto nuevo', categoryId: 'cat-1', clientId: 'client-1',
      images: { create: [expect.objectContaining({ url: 'https://res.cloudinary.com/new.webp' })] },
    }) }));
    expect(revalidatePath).toHaveBeenCalledWith('/dashboard/projects');
  });

  it('rechaza proyectos sin imagen antes de tocar la base', async () => {
    await expect(addProject({ ...createInput, images: [] })).rejects.toThrow();
    expect(uploadImages).not.toHaveBeenCalled();
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it('edita imágenes y limpia solo las que fueron retiradas', async () => {
    await updateProject('project-1', updateInput);
    expect(tx.project.update).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({
      images: expect.objectContaining({ deleteMany: { id: { in: ['remove'] } } }),
    }) }));
    expect(deleteProjectImagesFromCloudinary).toHaveBeenCalledWith(['https://res.cloudinary.com/remove.webp']);
  });

  it('limpia la imagen recién subida si falla la edición', async () => {
    tx.project.update.mockRejectedValueOnce(new Error('Fallo de base'));
    await expect(updateProject('project-1', updateInput)).rejects.toThrow('Fallo de base');
    expect(deleteProjectImagesFromCloudinary).toHaveBeenCalledWith(['https://res.cloudinary.com/new.webp']);
    expect(deleteProjectImagesFromCloudinary).not.toHaveBeenCalledWith(['https://res.cloudinary.com/remove.webp']);
  });

  it('no permite dejar un proyecto sin imágenes', async () => {
    await expect(updateProject('project-1', { ...updateInput, keptExistingImageIds: [], images: [] })).rejects.toThrow('al menos una imagen');
    expect(uploadImages).not.toHaveBeenCalled();
  });

  it('elimina el proyecto y luego limpia sus imágenes', async () => {
    prisma.project.findUnique.mockResolvedValue({ id: 'project-1', images: [{ url: 'https://res.cloudinary.com/old.webp' }] });
    await deleteProjectById('project-1');
    expect(prisma.project.delete).toHaveBeenCalledWith({ where: { id: 'project-1' } });
    expect(deleteProjectImagesFromCloudinary).toHaveBeenCalledWith(['https://res.cloudinary.com/old.webp']);
    expect(revalidatePath).toHaveBeenCalledWith('/dashboard/projects');
  });

  it('exige autenticación antes de crear', async () => {
    requireDashboardAuth.mockRejectedValueOnce(new Error('Sin acceso'));
    await expect(addProject(createInput)).rejects.toThrow('Sin acceso');
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });
});
