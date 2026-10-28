import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Header from './Header';

const { navigateToWork } = vi.hoisted(() => ({ navigateToWork: vi.fn() }));

vi.mock('next/navigation', () => ({ usePathname: () => '/' }));
vi.mock('next/image', () => ({ default: ({ alt }: { alt: string }) => <span role="img" aria-label={alt} /> }));
vi.mock('@gsap/react', () => ({ useGSAP: vi.fn() }));
vi.mock('gsap', () => ({ default: { registerPlugin: vi.fn(), fromTo: vi.fn() } }));
vi.mock('gsap/ScrollTrigger', () => ({ ScrollTrigger: { addEventListener: vi.fn(), removeEventListener: vi.fn() } }));
vi.mock('@/components/layout/WorkRouteTransition/WorkRouteTransition', () => ({ useWorkRouteTransition: () => navigateToWork }));
vi.mock('@/components/layout/SectionNavigation/SectionNavigation', () => ({
  useSectionNavigation: () => ({ activeSectionLink: null, setActiveSectionLink: vi.fn(), navigateSection: vi.fn(), navigateTop: vi.fn() }),
}));
vi.mock('@/providers/LanguageProvider', () => ({
  useLanguage: () => ({ locale: 'es', t: (key: string) => ({ 'workSection.title': 'Trabajos Seleccionados', 'header.openMenu': 'Abrir menú', 'header.closeMenu': 'Cerrar menú' })[key] ?? key }),
}));
vi.mock('@/utils/links', () => ({ getLinksByLocale: () => [{ link: '/works', title: 'Trabajos' }, { link: '/#about', title: 'Sobre Mí' }] }));
vi.mock('./LanguageSelector', () => ({ LanguageSelector: () => null }));
vi.mock('../../ui/ThemeSelector/ThemeSelector', () => ({ ThemeSelector: () => null }));

describe('vista rápida de Trabajos en móvil', () => {
  beforeEach(() => {
    navigateToWork.mockReset();
    navigateToWork.mockImplementation((event: MouseEvent) => event.preventDefault());
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: query.includes('max-width: 768px'),
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ projects: [
        { id: 'one', slug: 'obra-uno', title: 'Obra uno', images: [{ url: '/uno.webp', alt: 'Obra uno' }] },
        { id: 'two', slug: 'obra-dos', title: 'Obra dos', images: [{ url: '/dos.webp', alt: 'Obra dos' }] },
      ] }),
    }));
  });

  it('abre proyectos al tocar Trabajos y envía la obra elegida a la transición de ruta', async () => {
    const user = userEvent.setup();
    render(<Header />);

    await user.click(screen.getByRole('button', { name: 'Abrir menú' }));
    await user.click(screen.getByRole('link', { name: 'Trabajos' }));

    const preview = document.querySelector('.headerWorkPreview') as HTMLElement;
    expect(preview.getAttribute('aria-hidden')).toBe('false');
    expect(screen.getByRole('button', { name: 'Abrir menú' }).getAttribute('aria-expanded')).toBe('false');
    await waitFor(() => expect(within(preview).getByRole('link', { name: /Obra uno/ })).toBeTruthy());

    await user.click(within(preview).getByRole('link', { name: /Obra uno/ }));
    expect(navigateToWork).toHaveBeenCalledOnce();
    expect(navigateToWork.mock.calls[0][1]).toMatchObject({ href: '/works/obra-uno', image: '/uno.webp', title: 'Obra uno' });
    expect(preview.getAttribute('aria-hidden')).toBe('true');
  });

  it('permite abrir la galería completa desde la vista rápida', async () => {
    const user = userEvent.setup();
    render(<Header />);
    await user.click(screen.getByRole('button', { name: 'Abrir menú' }));
    await user.click(screen.getByRole('link', { name: 'Trabajos' }));
    await user.click(screen.getByRole('link', { name: /Abrir la galería/ }));

    expect(navigateToWork).toHaveBeenCalledOnce();
    expect(navigateToWork.mock.calls[0][1]).toMatchObject({ href: '/works' });
  });
});
