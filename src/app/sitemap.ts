import type { MetadataRoute } from "next";
import { getProjects } from "@/actions/project/getProjects";
import { getSiteUrl } from "@/lib/utils";

const siteUrl = getSiteUrl();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const projects = await getProjects();

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

    const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
        url: `${siteUrl}/works/${project.slug}`,
        changeFrequency: "monthly",
        priority: 0.8,
    }));

    return [...staticRoutes, ...projectRoutes];
}