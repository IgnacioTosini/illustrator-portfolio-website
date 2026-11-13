'use client';

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useGSAP } from "@gsap/react";
import { animate, AnimatePresence, LayoutGroup, motion, useMotionValue, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { IoArrowBack, IoChevronBack, IoChevronForward, IoClose, IoContract, IoExpand } from "react-icons/io5";
import { Project } from "@/types";
import { animateWorkPage } from "@/animations/gsap/workPage";
import { useLanguage } from "@/providers/LanguageProvider";
import { useOptionalWorkRouteTransition } from "@/components/layout/WorkRouteTransition/WorkRouteTransition";
import type { AdjacentProject } from "@/actions/project/getAdjacentProjects";
import './_projectGallery.scss';

interface Props {
    project: Project;
    selectedClientParam?: string | null;
    selectedPageParam?: number;
    adjacentProjects?: { previous: AdjacentProject | null; next: AdjacentProject | null };
}

export default function ProjectGallery({ project, selectedClientParam = null, selectedPageParam = 1, adjacentProjects }: Props) {
    const [mainImage, setMainImage] = useState(project.images[0]);
    const [portraitImageIds, setPortraitImageIds] = useState<Set<string>>(() => new Set());
    const [flightSourceId, setFlightSourceId] = useState<string | null>(null);
    const [arrivingId, setArrivingId] = useState<string | null>(null);
    const [viewerIndex, setViewerIndex] = useState<number | null>(null);
    const [viewerOrigin, setViewerOrigin] = useState<DOMRect | null>(null);
    const [viewerZoomed, setViewerZoomed] = useState(false);
    const viewerX = useMotionValue(0);
    const viewerY = useMotionValue(0);
    const workPageRef = useRef<HTMLDivElement | null>(null);
    const imageContainerRef = useRef<HTMLDivElement | null>(null);
    const transitionFrameRef = useRef<number | null>(null);
    const viewerCloseRef = useRef<HTMLButtonElement | null>(null);
    const viewerPointerX = useRef<number | null>(null);
    const viewerIndexRef = useRef<number | null>(null);
    const shouldReduceMotion = useReducedMotion();
    const { t, locale } = useLanguage();
    const navigateToWork = useOptionalWorkRouteTransition();
    const imageLayoutId = (id: string) => `project-${project.id}-image-${id}`;

    useEffect(() => () => {
        if (transitionFrameRef.current !== null) window.cancelAnimationFrame(transitionFrameRef.current);
    }, []);

    useEffect(() => {
        viewerX.set(0);
        viewerY.set(0);
    }, [viewerIndex, viewerX, viewerY]);

    const toggleViewerZoom = () => {
        if (viewerZoomed) {
            if (shouldReduceMotion) {
                viewerX.set(0);
                viewerY.set(0);
            } else {
                animate(viewerX, 0, { type: "spring", stiffness: 300, damping: 32 });
                animate(viewerY, 0, { type: "spring", stiffness: 300, damping: 32 });
            }
        }
        setViewerZoomed((current) => !current);
    };

    useEffect(() => {
        if (viewerIndex === null) return;
        viewerIndexRef.current = viewerIndex;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        viewerCloseRef.current?.focus();
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                if (viewerIndexRef.current !== null) setMainImage(project.images[viewerIndexRef.current]);
                setViewerIndex(null);
                viewerIndexRef.current = null;
            }
            if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
                setViewerZoomed(false);
                setViewerIndex((current) => current === null ? null : (current + (event.key === "ArrowRight" ? 1 : -1) + project.images.length) % project.images.length);
            }
        };
        window.addEventListener("keydown", onKeyDown);
        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", onKeyDown);
        };
    }, [viewerIndex, project.images]);

    const closeViewer = () => {
        if (viewerIndexRef.current !== null) setMainImage(project.images[viewerIndexRef.current]);
        setViewerIndex(null);
        viewerIndexRef.current = null;
        setViewerZoomed(false);
    };

    const openViewer = () => {
        setArrivingId(null);
        setFlightSourceId(null);
        setViewerOrigin(imageContainerRef.current?.getBoundingClientRect() ?? null);
        const index = project.images.findIndex((image) => image.id === mainImage.id);
        viewerIndexRef.current = index;
        setViewerIndex(index);
    };

    const changeViewerImage = (direction: number) => {
        setViewerZoomed(false);
        setViewerIndex((current) => current === null ? null : (current + direction + project.images.length) % project.images.length);
    };

    const setImageOrientation = (imageId: string, isPortrait: boolean) => {
        setPortraitImageIds((current) => {
            if (current.has(imageId) === isPortrait) return current;
            const updated = new Set(current);
            if (isPortrait) updated.add(imageId);
            else updated.delete(imageId);
            return updated;
        });
    };

    const handleSelectImage = (image: Project["images"][number]) => {
        if (mainImage.id === image.id) return;
        if (transitionFrameRef.current !== null) window.cancelAnimationFrame(transitionFrameRef.current);
        if (shouldReduceMotion) {
            setFlightSourceId(null);
            setArrivingId(null);
            setMainImage(image);
            imageContainerRef.current?.scrollIntoView({ behavior: "instant", block: "start" });
            return;
        }

        setFlightSourceId(image.id);
        transitionFrameRef.current = window.requestAnimationFrame(() => {
            setArrivingId(image.id);
            setFlightSourceId(null);
            setMainImage(image);
            imageContainerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            transitionFrameRef.current = null;
        });
    };

    useGSAP(
        () => {
            if (!workPageRef.current) return;
            return animateWorkPage(workPageRef.current);
        },
        { scope: workPageRef }
    );

    const backHref = selectedClientParam || selectedPageParam > 1
        ? {
            pathname: '/works',
            query: {
                ...(selectedClientParam ? { client: selectedClientParam } : {}),
                ...(selectedPageParam > 1 ? { page: String(selectedPageParam) } : {}),
            },
        }
        : '/works';

    return (
        <LayoutGroup id={`project-gallery-${project.id}`}>
        <div ref={workPageRef} className="projectGallery">
            <div ref={imageContainerRef} className="imageContainer">
                <AnimatePresence initial={false}>
                    <motion.div
                        key={mainImage.id}
                        layoutId={arrivingId === mainImage.id ? imageLayoutId(mainImage.id) : undefined}
                        className="projectImageFrame"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={shouldReduceMotion ? { duration: 0 } : { layout: { type: "spring", stiffness: 230, damping: 29 }, opacity: { duration: 0.25 } }}
                        onLayoutAnimationComplete={() => setArrivingId((current) => current === mainImage.id ? null : current)}
                    >
                        <Image
                            src={mainImage.url}
                            alt={mainImage.alt || project.title}
                            draggable={false}
                            fill
                            quality={95}
                            sizes="100vw"
                            className="projectImage"
                        />
                    </motion.div>
                </AnimatePresence>
                <button type="button" className="projectImageOpen" onClick={openViewer} aria-label="Abrir imagen a pantalla completa" />
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

                <motion.div layoutScroll className="imagesList" aria-label={t("projectDetail.gallery")}>
                    {project.images.map((image, index) => (
                        <motion.button
                            type="button"
                            key={image.id}
                            className={`projectCardImage ${mainImage.id === image.id ? "active" : ""}${portraitImageIds.has(image.id) ? " is-portrait" : ""}`}
                            transition={shouldReduceMotion ? { duration: 0 } : { layout: { type: "spring", stiffness: 230, damping: 29 } }}
                            aria-label={`${t("projectDetail.gallery")} ${index + 1}: ${image.alt || project.title}`}
                            aria-pressed={mainImage.id === image.id}
                            onClick={() => handleSelectImage(image)}
                        >
                            <motion.span
                                className="projectThumbnailFrame"
                                layoutId={flightSourceId === image.id ? imageLayoutId(image.id) : undefined}
                            >
                                <Image
                                    src={image.url}
                                    alt=""
                                    draggable={false}
                                    width={400}
                                    height={300}
                                    quality={85}
                                    sizes="(max-width: 768px) 92vw, 400px"
                                    className="projectThumbnailImage"
                                    onLoad={(event) => setImageOrientation(image.id, event.currentTarget.naturalHeight > event.currentTarget.naturalWidth)}
                                />
                            </motion.span>
                        </motion.button>
                    ))}
                </motion.div>
                {adjacentProjects && (adjacentProjects.previous || adjacentProjects.next) && (
                    <nav className="projectAdjacent" aria-label={locale === 'en' ? 'Other projects' : 'Otros proyectos'}>
                        {([['previous', adjacentProjects.previous], ['next', adjacentProjects.next]] as const).map(([direction, adjacent]) => adjacent && (
                            <Link
                                key={direction}
                                href={`/works/${adjacent.slug}`}
                                className={`projectAdjacentLink is-${direction}`}
                                onClick={(event) => navigateToWork?.(event, {
                                    href: `/works/${adjacent.slug}`,
                                    image: adjacent.image,
                                    title: adjacent.title,
                                    source: event.currentTarget.querySelector<HTMLElement>('.projectAdjacentArt') ?? undefined,
                                })}
                            >
                                <motion.span className="projectAdjacentArt" whileHover={shouldReduceMotion ? undefined : { scale: 1.035 }} transition={{ duration: 0.35 }}>
                                    <Image src={adjacent.image} alt="" fill quality={85} sizes="(max-width: 720px) 90vw, 440px" />
                                </motion.span>
                                <span className="projectAdjacentCopy">
                                    <small>{direction === 'previous' ? (locale === 'en' ? '← Previous project' : '← Proyecto anterior') : (locale === 'en' ? 'Next project →' : 'Proyecto siguiente →')}</small>
                                    <strong>{adjacent.title}</strong>
                                </span>
                            </Link>
                        ))}
                    </nav>
                )}
            </div>
        </div>
        {typeof document !== "undefined" && createPortal(
            <AnimatePresence onExitComplete={() => {
                if (viewerIndex === null) setViewerOrigin(null);
            }}>
                {viewerIndex !== null && (
                    <motion.div
                        className="projectViewer"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Visor de imágenes del proyecto"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: shouldReduceMotion ? 0 : 0.25 }}
                    >
                        <motion.div
                            className="projectViewerArt"
                            initial={shouldReduceMotion || !viewerOrigin ? false : { top: viewerOrigin.top, left: viewerOrigin.left, width: viewerOrigin.width, height: viewerOrigin.height }}
                            animate={{ top: 0, left: 0, width: "100vw", height: "100dvh" }}
                            exit={shouldReduceMotion || !viewerOrigin ? undefined : { top: viewerOrigin.top, left: viewerOrigin.left, width: viewerOrigin.width, height: viewerOrigin.height }}
                            transition={{ type: "spring", stiffness: 240, damping: 32, duration: 0.5 }}
                            onPointerDown={(event) => { viewerPointerX.current = event.clientX; }}
                            onPointerUp={(event) => {
                                if (viewerPointerX.current === null) return;
                                const distance = event.clientX - viewerPointerX.current;
                                viewerPointerX.current = null;
                                if (!viewerZoomed && Math.abs(distance) > 70) changeViewerImage(distance < 0 ? 1 : -1);
                            }}
                        >
                            <AnimatePresence mode="wait" initial={false}>
                                <motion.div
                                    key={project.images[viewerIndex].id}
                                    className={`projectViewerImage${viewerZoomed ? " is-zoomed" : ""}`}
                                    initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.97 }}
                                    animate={{ opacity: 1, scale: viewerZoomed ? 2 : 1 }}
                                    exit={{ opacity: 0, scale: shouldReduceMotion ? 1 : 1.03 }}
                                    transition={{ duration: shouldReduceMotion ? 0 : 0.28 }}
                                    style={{ x: viewerX, y: viewerY }}
                                    drag={viewerZoomed}
                                    dragConstraints={{ left: -innerWidth / 2, right: innerWidth / 2, top: -innerHeight / 2, bottom: innerHeight / 2 }}
                                    dragElastic={0.08}
                                    dragMomentum={false}
                                    onDoubleClick={toggleViewerZoom}
                                >
                                    <Image src={project.images[viewerIndex].url} alt={project.images[viewerIndex].alt || project.title} fill quality={95} sizes="100vw" className="projectImage" draggable={false} onDragStart={(event) => event.preventDefault()} />
                                </motion.div>
                            </AnimatePresence>
                        </motion.div>
                        <button ref={viewerCloseRef} type="button" className="projectViewerClose" onClick={closeViewer} aria-label="Cerrar visor"><IoClose /></button>
                        <button type="button" className="projectViewerZoom" onClick={toggleViewerZoom} aria-label={viewerZoomed ? "Reducir imagen" : "Ampliar imagen"}>{viewerZoomed ? <IoContract /> : <IoExpand />}</button>
                        {project.images.length > 1 && <>
                            <button type="button" className="projectViewerPrevious" onClick={() => changeViewerImage(-1)} aria-label="Imagen anterior"><IoChevronBack /></button>
                            <button type="button" className="projectViewerNext" onClick={() => changeViewerImage(1)} aria-label="Imagen siguiente"><IoChevronForward /></button>
                        </>}
                        <span className="projectViewerCount">{viewerIndex + 1} / {project.images.length}</span>
                    </motion.div>
                )}
            </AnimatePresence>, document.body
        )}
        </LayoutGroup>
    );
}
