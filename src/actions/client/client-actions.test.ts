import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createClient, deleteClient, updatedClient } from './client-actions';
import { getClients } from './getClients';

const { client, project, revalidatePath, requireDashboardAuth } = vi.hoisted(() => ({
  client: { findFirst: vi.fn(), findMany: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn() },
  project: { count: vi.fn() },
  revalidatePath: vi.fn(),
  requireDashboardAuth: vi.fn(),
}));

vi.mock('@/lib/prisma', () => ({ prisma: { client, project } }));
vi.mock('@/lib/auth/dashboard', () => ({ requireDashboardAuth }));
vi.mock('next/cache', () => ({ revalidatePath }));
vi.mock('@/lib/mappers/client.mapper', () => ({ mapClient: (value: unknown) => value }));

const form = (values: Record<string, string>) => {
  const data = new FormData();
  Object.entries(values).forEach(([key, value]) => data.set(key, value));
  return data;
};

describe('ABM de clientes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    client.findFirst.mockResolvedValue(null);
    project.count.mockResolvedValue(0);
  });

  it('lista clientes con su cantidad de proyectos', async () => {
    client.findMany.mockResolvedValue([{ id: 'client-1', name: 'Estudio', slug: 'estudio', _count: { projects: 2 } }]);
    const result = await getClients();
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Estudio');
  });

  it('crea un cliente con slug único', async () => {
    client.findFirst.mockResolvedValueOnce(null).mockResolvedValueOnce({ id: 'other' }).mockResolvedValueOnce(null);
    const result = await createClient(form({ name: ' Estudio ', website: ' https://example.com ' }));
    expect(result.ok).toBe(true);
    expect(client.create).toHaveBeenCalledWith({ data: { name: 'Estudio', slug: 'estudio-2', website: 'https://example.com' } });
    expect(revalidatePath).toHaveBeenCalledWith('/dashboard/clients');
  });

  it('rechaza un cliente con nombre duplicado', async () => {
    client.findFirst.mockResolvedValueOnce({ id: 'other' });
    const result = await createClient(form({ name: 'Estudio' }));
    expect(result.ok).toBe(false);
    expect(client.create).not.toHaveBeenCalled();
  });

  it('actualiza el nombre, slug y web del cliente', async () => {
    const result = await updatedClient(form({ id: 'client-1', name: 'Nuevo Estudio', website: 'https://example.org' }));
    expect(result.ok).toBe(true);
    expect(client.update).toHaveBeenCalledWith({
      where: { id: 'client-1' },
      data: { name: 'Nuevo Estudio', slug: 'nuevo-estudio', website: 'https://example.org' },
    });
  });

  it('protege clientes usados y permite eliminar los vacíos', async () => {
    project.count.mockResolvedValueOnce(1).mockResolvedValueOnce(0);
    expect((await deleteClient(form({ id: 'client-1' }))).ok).toBe(false);
    expect(client.delete).not.toHaveBeenCalled();
    expect((await deleteClient(form({ id: 'client-1' }))).ok).toBe(true);
    expect(client.delete).toHaveBeenCalledWith({ where: { id: 'client-1' } });
  });

  it('exige autenticación antes de escribir', async () => {
    requireDashboardAuth.mockRejectedValueOnce(new Error('Sin acceso'));
    await expect(deleteClient(form({ id: 'client-1' }))).rejects.toThrow('Sin acceso');
    expect(client.delete).not.toHaveBeenCalled();
  });
});
