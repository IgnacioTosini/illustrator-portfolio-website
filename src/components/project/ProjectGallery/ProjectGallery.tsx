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
import './_projectGallery.scss';

interface Props {
    project: Project;
}

export default function ProjectGallery({ project }: Props) {
    const [mainImage, setMainImage] = useState(project.images[0]);
    const workPageRef = useRef<HTMLDivElement | null>(null);
    const imageContainerRef = useRef<HTMLDivElement | null>(null);
    const hasMountedRef = useRef(false);

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

    return (
        <div ref={workPageRef} className="projectGallery">
            <div ref={imageContainerRef} className="imageContainer">
                <Image
                    src={mainImage.url}
                    alt={mainImage.alt || project.title}
                    fill
                    className="projectImage"
                />
            </div>

            <div className="workPageContainer">
                <Link href="/works" className="backButton">
                    <IoArrowBack /> Volver a Trabajos
                </Link>

                <div className="projectData">
                    <div className="projectDataSidebar">
                        <span>{project.year}</span>
                        <span>{project.client?.name}</span>
                    </div>

                    <div className="projectDataHeader">
                        <h1>{project.title}</h1>
                        <p className="client">{project.category.name}</p>
                        <p className="description">{project.description}</p>
                    </div>
                </div>

                <div className="imagesList">
                    {project.images.map(image => (
                        <Image
                            key={image.id}
                            src={image.url}
                            alt={image.alt || project.title}
                            width={400}
                            height={300}
                            className={`projectCardImage ${mainImage.id === image.id ? "active" : ""}`}
                            onClick={() => handleSelectImage(image)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}