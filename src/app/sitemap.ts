import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { getSiteUrl } from "@/lib/utils";

const siteUrl = getSiteUrl();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const projects = await prisma.project.findMany({
        select: { slug: true },
    });

    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: `${siteUrl}/`,
            changeFrequency: "weekly",
            priority: 1,
        },
        {
            url: `${siteUrl}/works`,
            changeFrequency: "weekly",
            priority: 0.9,
        },
    ];

    const projectRoutes: MetadataRoute.Sitemap = projects.map(({ slug }) => ({
        url: `${siteUrl}/works/${slug}`,
        changeFrequency: "monthly",
        priority: 0.8,
    }));

    return [...staticRoutes, ...projectRoutes];
}
