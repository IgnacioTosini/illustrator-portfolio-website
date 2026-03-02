import { AppLocale, defaultLocale, getMessage } from "@/i18n/messages";

export const getLinksByLocale = (locale: AppLocale) => [
    { link: '/works', title: getMessage(locale, "navigation.works") },
    { link: '/#about', title: getMessage(locale, "navigation.about") },
    { link: '/#process', title: getMessage(locale, "navigation.process") },
    { link: '/#contact', title: getMessage(locale, "navigation.contact") },
];

export const links = getLinksByLocale(defaultLocale);

export const adminLinks = [
    { link: '/dashboard/projects', title: 'Proyectos' },
    { link: '/dashboard/categories', title: 'Categorias' },
    { link: '/dashboard/clients', title: 'Clientes' },
]