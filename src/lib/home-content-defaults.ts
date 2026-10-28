import type { HomeContent, ProcessIconKey } from '@/types/home-content';

export const DEFAULT_HOME_CONTENT: HomeContent = {
    heroImage: '/alukkart.webp',
    aboutImage: '/alukkart.webp',
    es: {
        hero: { title: 'Ilustrador Freelance', subtitle: 'Diseño de personajes, ilustración editorial y narrativa visual.', proof: 'Comic character illustration · Argentina · Fiverr 5.0', ctaViewWorks: 'Ver Trabajos', ctaContact: 'Consultar Proyecto' },
        workSection: { title: 'Trabajos Seleccionados', subtitle: 'Proyectos Recientes' },
        about: {
            title: 'Sobre Mí', subtitle: 'El Artista', imageAlt: 'Sección sobre mí',
            paragraphs: [
                'Soy Alukkart, ilustrador freelance especializado en diseño de personajes, ilustración editorial y narrativa visual. Con más de ocho años de experiencia profesional, he tenido el privilegio de trabajar con editoriales, agencias y marcas a nivel mundial.',
                'Mi trabajo combina sensibilidades del dibujo tradicional con técnicas digitales para crear imágenes que se sienten atemporales y contemporáneas a la vez. Creo que cada ilustración debe contar una historia y evocar emociones, ya sea en una portada de libro, una revista o una campaña de marca.',
                'He colaborado con clientes como Penguin Random House, Wired Magazine, Riot Games y numerosos estudios independientes. Siempre estoy abierto a nuevos proyectos que empujen los límites creativos.',
                'Cuando no estoy ilustrando, me puedes encontrar dibujando en mercados locales, explorando librerías o experimentando con nuevas técnicas en mi estudio.',
            ],
            abilitiesTitle: 'Habilidades', abilities: ['Comic & cartoon', 'Pen & ink', 'Game', 'Concept art', 'Fan art', 'Anatomy, objects and people'],
            toolsTitle: 'Herramientas', tools: ['Huion Kamvas 13', 'Clip Studio Paint', 'Photoshop'],
        },
        process: {
            title: 'Proceso', subtitle: 'Cómo Trabajo', steps: [
                { title: 'Brief e Investigación', description: 'Cada proyecto comienza con una comprensión profunda de tus objetivos, audiencia y visión. Discutimos referencias, dirección de estilo y entregables.', icon: 'document' },
                { title: 'Bocetos y Conceptos', description: 'Desarrollo bocetos iniciales y variaciones de concepto para tu revisión. Esta etapa es colaborativa e iteramos hasta que la dirección sea la correcta.', icon: 'pencil' },
                { title: 'Refinamiento', description: 'Una vez aprobado el concepto, refino la obra con todo detalle, color y acabado. Se incluyen revisiones menores en esta etapa.', icon: 'images' },
                { title: 'Entrega Final', description: 'La obra terminada se entrega en todos los formatos y resoluciones requeridos, lista para impresión, digital o cualquier medio que necesites.', icon: 'send' },
            ],
        },
        contact: { title: 'Contacto', subtitle: 'Trabajemos juntos', description: '¿Tienes un proyecto en mente? Siempre estoy abierto a nuevos encargos, colaboraciones y alianzas creativas. Hagamos algo hermoso.' },
    },
    en: {
        hero: { title: 'Freelance Illustrator', subtitle: 'Character design, editorial illustration, and visual storytelling.', proof: 'Comic character illustration · Argentina · Fiverr 5.0', ctaViewWorks: 'View Works', ctaContact: 'Start a Project' },
        workSection: { title: 'Selected Works', subtitle: 'Recent Projects' },
        about: {
            title: 'About Me', subtitle: 'The Artist', imageAlt: 'About section',
            paragraphs: [
                'I’m Alukkart, a freelance illustrator specialized in character design, editorial illustration, and visual storytelling. With more than eight years of professional experience, I’ve had the privilege of working with publishers, agencies, and brands worldwide.',
                'My work combines traditional drawing sensibilities with digital techniques to create images that feel both timeless and contemporary. I believe every illustration should tell a story and evoke emotion, whether it’s for a book cover, a magazine, or a brand campaign.',
                'I’ve collaborated with clients such as Penguin Random House, Wired Magazine, Riot Games, and many independent studios. I’m always open to new projects that push creative boundaries.',
                'When I’m not illustrating, you can find me sketching in local markets, exploring bookstores, or experimenting with new techniques in my studio.',
            ],
            abilitiesTitle: 'Skills', abilities: ['Comic & cartoon', 'Pen & ink', 'Game', 'Concept art', 'Fan art', 'Anatomy, objects and people'],
            toolsTitle: 'Tools', tools: ['Huion Kamvas 13', 'Clip Studio Paint', 'Photoshop'],
        },
        process: {
            title: 'Process', subtitle: 'How I Work', steps: [
                { title: 'Brief & Research', description: 'Every project starts with a deep understanding of your goals, audience, and vision. We discuss references, style direction, and deliverables.', icon: 'document' },
                { title: 'Sketches & Concepts', description: 'I develop initial sketches and concept variations for your review. This stage is collaborative, and we iterate until the direction is right.', icon: 'pencil' },
                { title: 'Refinement', description: 'Once the concept is approved, I refine the artwork with full detail, color, and finish. Minor revisions are included at this stage.', icon: 'images' },
                { title: 'Final Delivery', description: 'The final artwork is delivered in all required formats and resolutions, ready for print, digital, or any medium you need.', icon: 'send' },
            ],
        },
        contact: { title: 'Contact', subtitle: 'Let’s Work Together', description: 'Do you have a project in mind? I’m always open to new commissions, collaborations, and creative partnerships. Let’s make something beautiful.' },
    },
};

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value);
const readString = (value: unknown, fallback: string): string => typeof value === 'string' ? value.slice(0, 10000) : fallback;
const readImage = (value: unknown, fallback: string): string => typeof value === 'string' ? value.slice(0, 18_000_000) : fallback;
const readStringArray = (value: unknown, fallback: string[], maxItems = 30): string[] =>
    Array.isArray(value)
        ? value.slice(0, maxItems).map((item, index) => readString(item, fallback[index] ?? ''))
        : fallback;

function mergeLocale(value: unknown, fallback: HomeContent['es']): HomeContent['es'] {
    if (!isRecord(value)) return fallback;
    const hero = isRecord(value.hero) ? value.hero : {};
    const workSection = isRecord(value.workSection) ? value.workSection : {};
    const about = isRecord(value.about) ? value.about : {};
    const process = isRecord(value.process) ? value.process : {};
    const contact = isRecord(value.contact) ? value.contact : {};
    const steps = Array.isArray(process.steps) ? process.steps : [];
    return {
        hero: {
            title: readString(hero.title, fallback.hero.title), subtitle: readString(hero.subtitle, fallback.hero.subtitle),
            proof: readString(hero.proof, fallback.hero.proof), ctaViewWorks: readString(hero.ctaViewWorks, fallback.hero.ctaViewWorks),
            ctaContact: readString(hero.ctaContact, fallback.hero.ctaContact),
        },
        workSection: { title: readString(workSection.title, fallback.workSection.title), subtitle: readString(workSection.subtitle, fallback.workSection.subtitle) },
        about: {
            title: readString(about.title, fallback.about.title), subtitle: readString(about.subtitle, fallback.about.subtitle),
            imageAlt: readString(about.imageAlt, fallback.about.imageAlt), paragraphs: readStringArray(about.paragraphs, fallback.about.paragraphs),
            abilitiesTitle: readString(about.abilitiesTitle, fallback.about.abilitiesTitle), abilities: readStringArray(about.abilities, fallback.about.abilities),
            toolsTitle: readString(about.toolsTitle, fallback.about.toolsTitle), tools: readStringArray(about.tools, fallback.about.tools),
        },
        process: {
            title: readString(process.title, fallback.process.title), subtitle: readString(process.subtitle, fallback.process.subtitle),
            steps: Array.isArray(process.steps)
                ? steps.slice(0, 12).map((value, index) => {
                    const step = isRecord(value) ? value : {};
                    const defaultStep = fallback.process.steps[index];
                    return {
                        title: readString(step.title, defaultStep?.title ?? ''),
                        description: readString(step.description, defaultStep?.description ?? ''),
                        icon: typeof step.icon === 'string' && ['document', 'pencil', 'images', 'send', 'palette', 'check', 'chat', 'rocket'].includes(step.icon)
                            ? step.icon as ProcessIconKey
                            : defaultStep?.icon ?? 'document',
                    };
                })
                : fallback.process.steps,
        },
        contact: { title: readString(contact.title, fallback.contact.title), subtitle: readString(contact.subtitle, fallback.contact.subtitle), description: readString(contact.description, fallback.contact.description) },
    };
}

export function mergeHomeContent(value: unknown): HomeContent {
    if (!isRecord(value)) return DEFAULT_HOME_CONTENT;
    return {
        heroImage: readImage(value.heroImage, DEFAULT_HOME_CONTENT.heroImage),
        aboutImage: readImage(value.aboutImage, DEFAULT_HOME_CONTENT.aboutImage),
        es: mergeLocale(value.es, DEFAULT_HOME_CONTENT.es),
        en: mergeLocale(value.en, DEFAULT_HOME_CONTENT.en),
    };
}
