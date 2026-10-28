import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createCategory, deleteCategory, updatedCategory } from './category-actions';
import { getCategories } from './getCategories';

const { category, project, revalidatePath, requireDashboardAuth } = vi.hoisted(() => ({
  category: { findFirst: vi.fn(), findMany: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn() },
  project: { count: vi.fn() },
  revalidatePath: vi.fn(),
  requireDashboardAuth: vi.fn(),
}));

vi.mock('@/lib/prisma', () => ({ prisma: { category, project } }));
vi.mock('@/lib/auth/dashboard', () => ({ requireDashboardAuth }));
vi.mock('next/cache', () => ({ revalidatePath }));
vi.mock('@/lib/mappers/category.mapper', () => ({ mapCategory: (value: unknown) => value }));

const form = (values: Record<string, string>) => {
  const data = new FormData();
  Object.entries(values).forEach(([key, value]) => data.set(key, value));
  return data;
};

describe('ABM de categorías', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    category.findFirst.mockResolvedValue(null);
    project.count.mockResolvedValue(0);
  });

  it('lista las categorías', async () => {
    category.findMany.mockResolvedValue([{ id: 'cat-1', name: 'Cómic', slug: 'comic', projects: [] }]);
    const result = await getCategories();
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Cómic');
  });

  it('crea una categoría y actualiza el dashboard', async () => {
    const result = await createCategory(form({ name: ' Cómic ', slug: ' comic ' }));
    expect(result.ok).toBe(true);
    expect(category.create).toHaveBeenCalledWith({ data: { name: 'Cómic', slug: 'comic' } });
    expect(revalidatePath).toHaveBeenCalledWith('/dashboard/categories');
  });

  it('rechaza un slug duplicado antes de crear', async () => {
    category.findFirst.mockResolvedValueOnce({ id: 'existing' });
    const result = await createCategory(form({ name: 'Otra', slug: 'comic' }));
    expect(result.ok).toBe(false);
    expect(category.create).not.toHaveBeenCalled();
  });

  it('actualiza una categoría existente', async () => {
    category.findFirst.mockResolvedValueOnce({ id: 'cat-1' }).mockResolvedValueOnce(null);
    const result = await updatedCategory(form({ id: 'cat-1', name: 'Editorial', slug: 'editorial' }));
    expect(result.ok).toBe(true);
    expect(category.update).toHaveBeenCalledWith({ where: { id: 'cat-1' }, data: { name: 'Editorial', slug: 'editorial' } });
  });

  it('impide eliminar una categoría con proyectos y elimina una vacía', async () => {
    project.count.mockResolvedValueOnce(2).mockResolvedValueOnce(0);
    expect((await deleteCategory(form({ id: 'cat-1' }))).ok).toBe(false);
    expect(category.delete).not.toHaveBeenCalled();
    expect((await deleteCategory(form({ id: 'cat-1' }))).ok).toBe(true);
    expect(category.delete).toHaveBeenCalledWith({ where: { id: 'cat-1' } });
  });

  it('exige autenticación antes de escribir', async () => {
    requireDashboardAuth.mockRejectedValueOnce(new Error('Sin acceso'));
    await expect(createCategory(form({ name: 'Cómic', slug: 'comic' }))).rejects.toThrow('Sin acceso');
    expect(category.create).not.toHaveBeenCalled();
  });
});
