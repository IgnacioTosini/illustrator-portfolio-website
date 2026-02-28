import { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectGallery from "@/components/project/ProjectGallery/ProjectGallery";
import { getProjectBySlug } from "@/actions/project/getProjectBySlug";
import './_workPage.scss';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://alukkart.com";

interface Props {
    params: Promise<{ slug: string }>
    searchParams: Promise<{ client?: string | string[] }>
}

export async function generateMetadata(
    { params }: Props,
): Promise<Metadata> {
    const slug = (await params).slug
    const project = await getProjectBySlug(slug);
    const url = `${siteUrl}/works/${slug}`;

    return {
        title: project?.title ?? 'Proyecto no encontrado',
        description: project?.description ?? '',
        alternates: {
            canonical: `/works/${slug}`,
        },
        robots: project
            ? undefined
            : {
                index: false,
                follow: false,
            },
        openGraph: {
            title: project?.title ?? 'Proyecto no encontrado',
            description: project?.description ?? '',
            url,
            images: project?.images.map((img) => img.url) ?? []
        },
        twitter: {
            card: "summary_large_image",
            title: project?.title ?? 'Proyecto no encontrado',
            description: project?.description ?? '',
            images: project?.images.map((img) => img.url) ?? [],
        }
    }
}

export default async function WorkPage({ params, searchParams }: Props) {
    const { slug } = await params;
    const { client } = await searchParams;
    const selectedClientParam = typeof client === 'string' ? client : null;
    const project = await getProjectBySlug(slug)

    if (!project) {
        notFound()
    }

    return (
        <div className="workPage">
            <ProjectGallery project={project} selectedClientParam={selectedClientParam} />
        </div>
    );
}