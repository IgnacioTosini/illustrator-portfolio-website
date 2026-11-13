'use client'

import ProjectCard from '../ProjectCard/ProjectCard'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Project } from '@/types';
import { useLanguage } from "@/providers/LanguageProvider";
import './_projectList.scss'

interface Props {
    projects: Project[];
    selectedClientParam?: string | null;
    selectedPageParam?: number;
    priorityImages?: boolean;
    animateChanges?: boolean;
}

export const ProjectList = ({ projects, selectedClientParam = null, selectedPageParam = 1, priorityImages = false, animateChanges = false }: Props) => {
    const { t } = useLanguage();
    const shouldReduceMotion = useReducedMotion();

    const renderCard = (project: Project, index: number) => {
        const cardProps = {
            project,
            selectedClientParam,
            selectedPageParam,
            priority: priorityImages && index === 0,
            featuredLayout: index === 0,
        };

        if (!animateChanges) return <ProjectCard
            key={project.id}
            {...cardProps}
        />;

        return (
            <motion.div
                key={index === 0
                    ? `${project.id}-${selectedClientParam ?? 'all'}-${selectedPageParam}`
                    : project.id}
                layout
                className={`projectCardMotionItem${index === 0 ? ' is-featured' : ''}`}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 18, scale: 0.985 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={shouldReduceMotion ? undefined : { opacity: 0, y: -12, scale: 0.985 }}
                transition={shouldReduceMotion
                    ? { duration: 0 }
                    : { layout: { type: 'spring', stiffness: 260, damping: 30 }, opacity: { duration: 0.2 }, y: { duration: 0.28, ease: [0.22, 1, 0.36, 1] }, scale: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } }}
            >
                <ProjectCard {...cardProps} />
            </motion.div>
        );
    };

    if (projects.length === 0) {
        return (
            <div className="projectsContainer">
                <p className="emptyProjects">{t("works.emptyProjects")}</p>
            </div>
        );
    }

    return (
        <div className="projectsContainer">
            {animateChanges ? (
                <AnimatePresence initial={false} mode="popLayout">{renderCard(projects[0], 0)}</AnimatePresence>
            ) : renderCard(projects[0], 0)}
            {projects.length > 1 && (
                <div className="projectsMasonry">
                    {animateChanges ? (
                        <AnimatePresence initial={false}>{projects.slice(1).map((project, index) => renderCard(project, index + 1))}</AnimatePresence>
                    ) : projects.slice(1).map((project, index) => renderCard(project, index + 1))}
                </div>
            )}
        </div>
    );
};
