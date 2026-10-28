import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Link from 'next/link';
import { WorkRouteTransitionProvider, useWorkRouteTransition } from './WorkRouteTransition';

const { push, timelines } = vi.hoisted(() => ({
  push: vi.fn(),
  timelines: [] as Array<{ onComplete?: () => void }>,
}));

vi.mock('next/navigation', () => ({ useRouter: () => ({ push }), usePathname: () => '/' }));
vi.mock('@/providers/LanguageProvider', () => ({ useLanguage: () => ({ locale: 'es' }) }));
vi.mock('@/animations/gsap/reducedMotion', () => ({ prefersReducedMotion: () => false }));
vi.mock('gsap', () => ({
  default: {
    timeline: (options: { onComplete?: () => void }) => {
      timelines.push(options);
      const timeline = { to: vi.fn(), kill: vi.fn() };
      timeline.to.mockReturnValue(timeline);
      return timeline;
    },
  },
}));

function ProjectLink() {
  const navigate = useWorkRouteTransition();
  return <Link href="/works/obra-uno" onClick={(event) => navigate(event, {
    href: '/works/obra-uno', image: '/obra.webp', title: 'Obra uno',
  })}>Ver obra</Link>;
}

describe('transición de entrada a un proyecto', () => {
  beforeEach(() => {
    push.mockReset();
    timelines.length = 0;
  });

  it('muestra la pantalla de entrada antes de cambiar de ruta', async () => {
    const user = userEvent.setup();
    const view = render(<WorkRouteTransitionProvider><ProjectLink /></WorkRouteTransitionProvider>);

    await user.click(screen.getByRole('link', { name: 'Ver obra' }));
    const portal = document.querySelector('.workRoutePortal');
    expect(portal?.textContent).toContain('ENTRANDO AL PORTFOLIO');
    expect(portal?.textContent).toContain('Obra uno');
    expect(push).not.toHaveBeenCalled();

    timelines[0].onComplete?.();
    expect(push).toHaveBeenCalledWith('/works/obra-uno', { scroll: false });
    view.unmount();
    expect(document.querySelector('.workRoutePortal')).toBeNull();
  });
});
