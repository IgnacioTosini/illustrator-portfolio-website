export type ProcessIconKey = 'document' | 'pencil' | 'images' | 'send' | 'palette' | 'check' | 'chat' | 'rocket';

export type HomeLocale = {
    hero: { title: string; subtitle: string; proof: string; ctaViewWorks: string; ctaContact: string };
    workSection: { title: string; subtitle: string };
    about: {
        title: string; subtitle: string; imageAlt: string; paragraphs: string[];
        abilitiesTitle: string; abilities: string[]; toolsTitle: string; tools: string[];
    };
    process: { title: string; subtitle: string; steps: { title: string; description: string; icon: ProcessIconKey }[] };
    contact: { title: string; subtitle: string; description: string };
};

export type HomeContent = {
    heroImage: string;
    aboutImage: string;
    es: HomeLocale;
    en: HomeLocale;
};
