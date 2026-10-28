import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DEFAULT_HOME_CONTENT } from '@/lib/home-content-defaults';
import HomeContentEditor from './HomeContentEditor';

const { saveHomeContent, refresh, success } = vi.hoisted(() => ({
  saveHomeContent: vi.fn(),
  refresh: vi.fn(),
  success: vi.fn(),
}));

vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh }) }));
vi.mock('next/image', () => ({ default: ({ alt }: { alt: string }) => <span role="img" aria-label={alt} /> }));
vi.mock('react-toastify', () => ({ toast: { success, error: vi.fn() } }));
vi.mock('@/actions/home/saveHomeContent', () => ({ saveHomeContent }));
vi.mock('@/lib/client/project-images', () => ({
  dataUrlToImageFile: vi.fn(),
  uploadImageFiles: vi.fn().mockResolvedValue([]),
  deleteUploadedImageUrls: vi.fn(),
}));
vi.mock('@/components/layout/WorkRouteTransition/WorkRouteTransition', () => ({
  WorkRouteTransitionProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
vi.mock('@/components/layout/SectionNavigation/SectionNavigation', () => ({
  SectionNavigationProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
vi.mock('@/components/layout/Header/Header', () => ({ default: () => <div>Header de vista previa</div> }));
vi.mock('@/components/layout/Footer/Footer', () => ({ default: () => <div>Footer de vista previa</div> }));
vi.mock('@/components/sections/HeroSection/HeroSection', () => ({
  default: ({ homeContent }: { homeContent: typeof DEFAULT_HOME_CONTENT }) => <h2>{homeContent.es.hero.title}</h2>,
}));
vi.mock('@/components/sections/WorkSection/WorkSection', () => ({ default: () => <div>Trabajos de vista previa</div> }));
vi.mock('@/components/sections/AboutSection/AboutSection', () => ({ default: () => <div>Sobre mí de vista previa</div> }));
vi.mock('@/components/sections/ProcessSection/ProcessSection', () => ({ default: () => <div>Proceso de vista previa</div> }));
vi.mock('@/components/sections/ContactSection/ContactSection', () => ({ default: () => <div>Contacto de vista previa</div> }));
vi.mock('@/components/admin/components/ui/ImageCropEditor/ImageCropEditor', () => ({ default: () => null }));

describe('editor del home', () => {
  beforeEach(() => {
    saveHomeContent.mockReset();
    refresh.mockReset();
    success.mockReset();
    Object.defineProperty(window, 'scrollTo', { value: vi.fn(), configurable: true });
  });

  it('muestra el borrador en la vista previa y lo conserva al volver', async () => {
    const user = userEvent.setup();
    render(<HomeContentEditor initialContent={structuredClone(DEFAULT_HOME_CONTENT)} projects={[]} />);

    await user.clear(screen.getByLabelText('Título corto'));
    await user.type(screen.getByLabelText('Título corto'), 'Portada de prueba');
    await user.click(screen.getByRole('button', { name: 'Vista previa' }));

    expect(screen.getByText('Portada de prueba')).toBeTruthy();
    expect(document.querySelector('.homePreviewBody')?.hasAttribute('inert')).toBe(true);
    expect(saveHomeContent).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'Volver a editar' }));
    expect((screen.getByLabelText('Título corto') as HTMLInputElement).value).toBe('Portada de prueba');
  });

  it('guarda desde la vista previa el mismo borrador que se está mostrando', async () => {
    const user = userEvent.setup();
    saveHomeContent.mockImplementation(async (content) => content);
    render(<HomeContentEditor initialContent={structuredClone(DEFAULT_HOME_CONTENT)} projects={[]} />);

    await user.clear(screen.getByLabelText('Título corto'));
    await user.type(screen.getByLabelText('Título corto'), 'Nuevo título');
    await user.click(screen.getByRole('button', { name: 'Vista previa' }));
    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }));

    await waitFor(() => expect(saveHomeContent).toHaveBeenCalledOnce());
    expect(saveHomeContent.mock.calls[0][0].es.hero.title).toBe('Nuevo título');
    await waitFor(() => expect(screen.getByRole('heading', { name: 'Editar inicio' })).toBeTruthy());
    expect(refresh).toHaveBeenCalledOnce();
    expect(success).toHaveBeenCalledOnce();
  });
});
