import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { Project } from '@/types';
import ProjectGallery from './ProjectGallery';

vi.mock('@gsap/react', () => ({ useGSAP: vi.fn() }));
vi.mock('@/animations/gsap/workPage', () => ({ animateWorkPage: vi.fn() }));
vi.mock('next/image', () => ({
    default: ({ src, alt, draggable }: { src: string; alt: string; draggable?: boolean }) => <span role="img" aria-label={alt} data-src={src} draggable={draggable} />,
}));
vi.mock('@/providers/LanguageProvider', () => ({ useLanguage: () => ({ t: (key: string) => key }) }));

const project: Project = {
    id: 'project-1',
    title: 'Personajes',
    slug: 'personajes',
    description: 'Una colección de personajes',
    year: 2026,
    featured: true,
    categoryId: 'category-1',
    category: { id: 'category-1', name: 'Cómic', slug: 'comic' },
    clientId: 'client-1',
    client: { id: 'client-1', name: 'Cliente', slug: 'cliente' },
    images: [
        { id: 'image-1', url: '/first.webp', alt: 'Primera obra', order: 0 },
        { id: 'image-2', url: '/second.webp', alt: 'Segunda obra', order: 1 },
    ],
    createdAt: '2026-01-01',
};

describe('galería de imágenes del proyecto', () => {
    beforeEach(() => {
        Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', { value: vi.fn(), configurable: true });
        vi.stubGlobal('matchMedia', () => ({
            matches: false,
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
        }));
    });

    it('cambia la obra principal y marca la miniatura seleccionada', async () => {
        const user = userEvent.setup();
        render(<ProjectGallery project={project} />);
        const main = document.querySelector('.imageContainer') as HTMLElement;
        expect(within(main).getByRole('img', { name: 'Primera obra' }).getAttribute('data-src')).toBe('/first.webp');

        const second = screen.getByRole('button', { name: /Segunda obra/ });
        await user.click(second);

        await waitFor(() => expect(within(main).getByRole('img', { name: 'Segunda obra' }).getAttribute('data-src')).toBe('/second.webp'));
        expect(second.getAttribute('aria-pressed')).toBe('true');
        expect(screen.getByRole('button', { name: /Primera obra/ }).getAttribute('aria-pressed')).toBe('false');
        expect(HTMLElement.prototype.scrollIntoView).toHaveBeenCalled();
    });

    it('abre el visor, navega y conserva la obra elegida al cerrarlo', async () => {
        const user = userEvent.setup();
        render(<ProjectGallery project={project} />);

        await user.click(screen.getByRole('button', { name: 'Abrir imagen a pantalla completa' }));
        const viewer = screen.getByRole('dialog', { name: 'Visor de imágenes del proyecto' });
        expect(within(viewer).getByRole('img', { name: 'Primera obra' })).toBeTruthy();
        expect(within(viewer).getByRole('img', { name: 'Primera obra' }).getAttribute('draggable')).toBe('false');

        await user.click(within(viewer).getByRole('button', { name: 'Ampliar imagen' }));
        expect(within(viewer).getByRole('button', { name: 'Reducir imagen' })).toBeTruthy();

        await user.click(within(viewer).getByRole('button', { name: 'Imagen siguiente' }));
        await waitFor(() => expect(within(viewer).getByRole('img', { name: 'Segunda obra' })).toBeTruthy());
        expect(within(viewer).getByRole('button', { name: 'Ampliar imagen' })).toBeTruthy();
        await user.click(within(viewer).getByRole('button', { name: 'Cerrar visor' }));

        const main = document.querySelector('.imageContainer') as HTMLElement;
        await waitFor(() => expect(within(main).getByRole('img', { name: 'Segunda obra' }).getAttribute('data-src')).toBe('/second.webp'));
    });
});
