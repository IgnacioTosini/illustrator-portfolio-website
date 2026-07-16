'use client';

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import { IoArrowBack } from "react-icons/io5";
import { Project } from "@/types";
import { animateWorkPage } from "@/animations/gsap/workPage";
import { prefersReducedMotion } from "@/animations/gsap/reducedMotion";
import { useLanguage } from "@/providers/LanguageProvider";
import './_projectGallery.scss';

interface Props {
    project: Project;
    selectedClientParam?: string | null;
}

export default function ProjectGallery({ project, selectedClientParam = null }: Props) {
    const [mainImage, setMainImage] = useState(project.images[0]);
    const workPageRef = useRef<HTMLDivElement | null>(null);
    const imageContainerRef = useRef<HTMLDivElement | null>(null);
    const hasMountedRef = useRef(false);
    const { t } = useLanguage();

    useEffect(() => {
        if (!hasMountedRef.current) {
            hasMountedRef.current = true;
            return;
        }

        if (prefersReducedMotion()) return;

        const imageElement = imageContainerRef.current?.querySelector(".projectImage") as HTMLElement | null;
        if (!imageElement) return;

        gsap.fromTo(
            imageElement,
            {
                autoAlpha: 0,
                scale: 1.04,
                filter: "blur(4px)",
            },
            {
                autoAlpha: 1,
                scale: 1,
                filter: "blur(0px)",
                duration: 0.45,
                ease: "power3.out",
                clearProps: "filter",
            }
        );
    }, [mainImage.id]);

    const handleSelectImage = (image: Project["images"][number]) => {
        if (mainImage.id === image.id) return;

        if (prefersReducedMotion()) {
            setMainImage(image);
            return;
        }

        const imageElement = imageContainerRef.current?.querySelector(".projectImage") as HTMLElement | null;

        if (!imageElement) {
            setMainImage(image);
            return;
        }

        gsap.to(imageElement, {
            autoAlpha: 0,
            scale: 1.03,
            duration: 0.2,
            ease: "power2.out",
            onComplete: () => setMainImage(image),
        });
    };

    useGSAP(
        () => {
            if (!workPageRef.current) return;
            return animateWorkPage(workPageRef.current);
        },
        { scope: workPageRef }
    );

    const backHref = selectedClientParam
        ? {
            pathname: '/works',
            query: { client: selectedClientParam },
        }
        : '/works';

    return (
        <div ref={workPageRef} className="projectGallery">
            <div ref={imageContainerRef} className="imageContainer">
                <Image
                    src={mainImage.url}
                    alt={mainImage.alt || project.title}
                    fill
                    sizes="100vw"
                    className="projectImage"
                />
            </div>

            <div className="workPageContainer">
                <Link href={backHref} className="backButton">
                    <IoArrowBack /> {t("projectDetail.back")}
                </Link>

                <div className="projectData">
                    <div className="projectDataHeader">
                        <h1>{project.title}</h1>
                        <p className="description">{project.description}</p>
                    </div>

                    <dl className="projectMeta">
                        <div>
                            <dt>{t("projectDetail.year")}</dt>
                            <dd>{project.year}</dd>
                        </div>
                        <div>
                            <dt>{t("projectDetail.client")}</dt>
                            <dd>{project.client?.name || "Personal"}</dd>
                        </div>
                        <div>
                            <dt>{t("projectDetail.category")}</dt>
                            <dd>{project.category.name}</dd>
                        </div>
                    </dl>
                </div>

                <div className="imagesList" aria-label={t("projectDetail.gallery")}>
                    {project.images.map(image => (
                        <Image
                            key={image.id}
                            src={image.url}
                            alt={image.alt || project.title}
                            width={400}
                            height={300}
                            sizes="(max-width: 768px) 92vw, 400px"
                            className={`projectCardImage ${mainImage.id === image.id ? "active" : ""}`}
                            onClick={() => handleSelectImage(image)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
