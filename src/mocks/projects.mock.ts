import { Project } from "@/types";
import { categories } from "./categories.mock";
import { clients } from "./clients.mock";

export const projects: Project[] = [
    {
        id: "proj-1",
        title: "Design and make an illustration of your comic character I",
        slug: "design-and-make-an-illustration-of-your-comic-character-1",
        description:
            "Another great design from Lucas. The texture detail and final execution made this comic character illustration absolutely worth the wait.",
        year: 2026,
        featured: true,

        categoryId: categories[1].id,
        category: categories[1],
        clientId: clients[0].id,
        client: clients[0],

        images: [
            {
                id: "proj-1-img-1",
                url: "https://placehold.co/800x1000.png",
                alt: "Design and make an illustration of your comic character",
                order: 1,
            },
            {
                id: "proj-1-img-2",
                url: "https://placehold.co/900x800.png",
                alt: "Comic character detail close-up",
                order: 2,
            },
        ],

        createdAt: new Date().toISOString(),
    },

    {
        id: "proj-2",
        title: "Design and make an illustration of your comic character II",
        slug: "design-and-make-an-illustration-of-your-comic-character-2",
        description:
            "Another great experience working with Lucas. He improves initial ideas and handles requested changes with precision and care.",
        year: 2026,
        featured: true,

        categoryId: categories[1].id,
        category: categories[1],
        clientId: clients[1].id,
        client: clients[1],

        images: [
            {
                id: "proj-2-img-1",
                url: "https://placehold.co/800x1000.png",
                alt: "Design and make an illustration of your comic character",
                order: 1,
            },
            {
                id: "proj-2-img-2",
                url: "https://placehold.co/900x1000.png",
                alt: "Comic character detail close-up",
                order: 2,
            },
        ],

        createdAt: new Date().toISOString(),
    },

    {
        id: "proj-3",
        title: "Design and make an illustration of your comic character III",
        slug: "design-and-make-an-illustration-of-your-comic-character-3",
        description:
            "Every time I hire Lucas is better than the last. This piece became one of my favorite artworks ever created.",
        year: 2026,
        featured: true,

        categoryId: categories[1].id,
        category: categories[1],
        clientId: clients[1].id,
        client: clients[1],

        images: [
            {
                id: "proj-3-img-1",
                url: "https://placehold.co/800x1000.png",
                alt: "Design and make an illustration of your comic character",
                order: 1,
            },
            {
                id: "proj-3-img-2",
                url: "https://placehold.co/900x1000.png",
                alt: "Comic character detail close-up",
                order: 2,
            },
        ],

        createdAt: new Date().toISOString(),
    },

    {
        id: "proj-4",
        title: "Design and make an illustration of your comic character IV",
        slug: "design-and-make-an-illustration-of-your-comic-character-4",
        description:
            "Quick sketch delivery and highly accurate full color result. The final composition is the most appealing so far.",
        year: 2025,
        featured: true,

        categoryId: categories[1].id,
        category: categories[1],
        clientId: clients[0].id,
        client: clients[0],

        images: [
            {
                id: "proj-4-img-1",
                url: "https://placehold.co/800x1000.png",
                alt: "Design and make an illustration of your comic character",
                order: 1,
            },
            {
                id: "proj-4-img-2",
                url: "https://placehold.co/900x1000.png",
                alt: "Comic character detail close-up",
                order: 2,
            },
        ],

        createdAt: new Date().toISOString(),
    },

    {
        id: "proj-5",
        title: "Design and make an illustration of your comic character V",
        slug: "design-and-make-an-illustration-of-your-comic-character-5",
        description:
            "Another design by Lucas worth the time and price. The amount of detail in this piece is phenomenal.",
        year: 2025,
        featured: true,

        categoryId: categories[1].id,
        category: categories[1],
        clientId: clients[0].id,
        client: clients[0],

        images: [
            {
                id: "proj-5-img-1",
                url: "https://placehold.co/800x1000.png",
                alt: "Design and make an illustration of your comic character",
                order: 1,
            },
            {
                id: "proj-5-img-2",
                url: "https://placehold.co/900x1000.png",
                alt: "Comic character detail close-up",
                order: 2,
            },
        ],

        createdAt: new Date().toISOString(),
    },

    {
        id: "proj-6",
        title: "Design and make an illustration of your comic character VI",
        slug: "design-and-make-an-illustration-of-your-comic-character-6",
        description:
            "High resolution comic character artwork delivered as PNG 2500x3000px at 300 dpi, ready for web or print workflows.",
        year: 2025,
        featured: false,

        categoryId: categories[2].id,
        category: categories[2],
        clientId: clients[0].id,
        client: clients[0],

        images: [
            {
                id: "proj-6-img-1",
                url: "https://placehold.co/1200x800.png",
                alt: "Design and make an illustration of your comic character",
                order: 1,
            },
        ],

        createdAt: new Date().toISOString(),
    },
];