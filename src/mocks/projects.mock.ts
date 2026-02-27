import { Project } from "@/types";
import { categories } from "./categories.mock";
import { clients } from "./clients.mock";

export const projects: Project[] = [
    {
        id: "proj-1",
        title: "Fantasy Character Series I",
        slug: "fantasy-character-series-1",
        description:
            "A collection of fantasy-inspired character illustrations focused on mood, storytelling and detailed costume design.",
        year: 2024,
        featured: true,

        categoryId: categories[1].id,
        category: categories[1],
        clientId: clients[0].id,
        client: clients[0],

        images: [
            {
                id: "proj-1-img-1",
                url: "https://placehold.co/800x1000",
                alt: "Fantasy character illustration",
                order: 1,
            },
            {
                id: "proj-1-img-2",
                url: "https://placehold.co/900x800",
                alt: "Character detail close-up",
                order: 2,
            },
        ],

        createdAt: new Date().toISOString(),
    },

    {
        id: "proj-2",
        title: "Fantasy Character Series II",
        slug: "fantasy-character-series-2",
        description:
            "Second part of the fantasy character exploration with new visual storytelling.",
        year: 2024,
        featured: true,

        categoryId: categories[1].id,
        category: categories[1],
        clientId: clients[0].id,
        client: clients[0],

        images: [
            {
                id: "proj-2-img-1",
                url: "https://placehold.co/800x1000",
                alt: "Fantasy character illustration",
                order: 1,
            },
            {
                id: "proj-2-img-2",
                url: "https://placehold.co/900x1000",
                alt: "Character detail close-up",
                order: 2,
            },
        ],

        createdAt: new Date().toISOString(),
    },

    {
        id: "proj-3",
        title: "Fantasy Character Series III",
        slug: "fantasy-character-series-3",
        description:
            "Third iteration focused on lighting and atmosphere.",
        year: 2024,
        featured: true,

        categoryId: categories[1].id,
        category: categories[1],
        clientId: clients[0].id,
        client: clients[0],

        images: [
            {
                id: "proj-3-img-1",
                url: "https://placehold.co/800x1000",
                alt: "Fantasy character illustration",
                order: 1,
            },
            {
                id: "proj-3-img-2",
                url: "https://placehold.co/900x1000",
                alt: "Character detail close-up",
                order: 2,
            },
        ],

        createdAt: new Date().toISOString(),
    },

    {
        id: "proj-4",
        title: "Fantasy Character Series IV",
        slug: "fantasy-character-series-4",
        description:
            "Exploration of costumes and detailed textures.",
        year: 2024,
        featured: true,

        categoryId: categories[1].id,
        category: categories[1],
        clientId: clients[0].id,
        client: clients[0],

        images: [
            {
                id: "proj-4-img-1",
                url: "https://placehold.co/800x1000",
                alt: "Fantasy character illustration",
                order: 1,
            },
            {
                id: "proj-4-img-2",
                url: "https://placehold.co/900x1000",
                alt: "Character detail close-up",
                order: 2,
            },
        ],

        createdAt: new Date().toISOString(),
    },

    {
        id: "proj-5",
        title: "Fantasy Character Series V",
        slug: "fantasy-character-series-5",
        description:
            "Fifth piece focused on dynamic posing and action scenes.",
        year: 2024,
        featured: true,

        categoryId: categories[1].id,
        category: categories[1],
        clientId: clients[0].id,
        client: clients[0],

        images: [
            {
                id: "proj-5-img-1",
                url: "https://placehold.co/800x1000",
                alt: "Fantasy character illustration",
                order: 1,
            },
            {
                id: "proj-5-img-2",
                url: "https://placehold.co/900x1000",
                alt: "Character detail close-up",
                order: 2,
            },
        ],

        createdAt: new Date().toISOString(),
    },

    {
        id: "proj-6",
        title: "Editorial Illustration for Magazine",
        slug: "editorial-illustration-magazine",
        description:
            "Editorial piece created for a cultural magazine about modern digital identity.",
        year: 2023,
        featured: false,

        categoryId: categories[0].id,
        category: categories[0],
        clientId: clients[1].id,
        client: clients[1],

        images: [
            {
                id: "proj-6-img-1",
                url: "https://placehold.co/1200x800",
                alt: "Editorial illustration",
                order: 1,
            },
        ],

        createdAt: new Date().toISOString(),
    },
];