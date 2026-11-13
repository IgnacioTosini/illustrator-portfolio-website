'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { IoClose, IoFilter, IoSearch } from 'react-icons/io5';
import { useClientsQuery } from '@/hooks/client/useClientsQuery';
import { motionPreset } from '@/animations/gsap/motionPreset';
import { prefersReducedMotion } from '@/animations/gsap/reducedMotion';
import { Client } from '@/types';
import { useLanguage } from "@/providers/LanguageProvider";
import './_clientList.scss';

interface Props {
    selectedClient: string | null;
    onSelectClient: (id: string | null) => void;
}

export const ClientList = ({ selectedClient, onSelectClient }: Props) => {
    const { data: clients = [] } = useClientsQuery();
    const { t } = useLanguage();
    const sortedClients = [...clients].sort((a, b) => {
        const aHasNoProjects = a.projectsCount === 0;
        const bHasNoProjects = b.projectsCount === 0;

        if (aHasNoProjects === bHasNoProjects) {
            return 0;
        }

        return aHasNoProjects ? 1 : -1;
    });

    const listRef = useRef<HTMLUListElement>(null);
    const filterTriggerRef = useRef<HTMLButtonElement>(null);
    const filterPanelRef = useRef<HTMLDivElement>(null);
    const filterSearchRef = useRef<HTMLInputElement>(null);
    const [isScrollable, setIsScrollable] = useState(false);
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
    const [clientSearch, setClientSearch] = useState('');
    const shouldReduceMotion = useReducedMotion();
    const [hasSeenHint, setHasSeenHint] = useState(() => {
        if (typeof window === 'undefined') {
            return true;
        }

        return sessionStorage.getItem('client-list-hint-seen') === 'true';
    });

    useEffect(() => {
        const list = listRef.current;

        if (!list) {
            return;
        }

        const updateScrollableState = () => {
            const hasHorizontalOverflow = list.scrollWidth > list.clientWidth + 4;
            setIsScrollable(hasHorizontalOverflow);
        };

        const frameId = window.requestAnimationFrame(updateScrollableState);
        window.addEventListener('resize', updateScrollableState);

        return () => {
            window.cancelAnimationFrame(frameId);
            window.removeEventListener('resize', updateScrollableState);
        };
    }, [clients.length]);

    useGSAP(() => {
        if (prefersReducedMotion()) {
            return;
        }

        const list = listRef.current;
        if (!list) {
            return;
        }

        const newClientItems = Array.from(
            list.querySelectorAll<HTMLElement>('.client[data-client-item="true"]:not([data-client-animated="true"])')
        );

        if (newClientItems.length === 0) {
            return;
        }

        newClientItems.forEach((item) => {
            item.setAttribute('data-client-animated', 'true');
        });

        gsap.fromTo(
            newClientItems,
            {
                autoAlpha: 0,
                y: 10,
            },
            {
                autoAlpha: 1,
                y: 0,
                duration: 0.3,
                stagger: 0.06,
                ease: motionPreset.ease,
                clearProps: 'opacity,visibility,transform',
            }
        );
    }, [sortedClients.length]);

    const showHint = isScrollable && !hasSeenHint;
    const selectedClientName = sortedClients.find((client) => client.slug === selectedClient || client.id === selectedClient)?.name;
    const visibleClients = sortedClients.filter((client) => client.name.toLocaleLowerCase().includes(clientSearch.trim().toLocaleLowerCase()));

    const closeMobileFilter = useCallback(() => setIsMobileFilterOpen(false), []);

    useEffect(() => {
        if (!isMobileFilterOpen) return;
        const filterTrigger = filterTriggerRef.current;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        filterSearchRef.current?.focus();

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                closeMobileFilter();
                return;
            }
            if (event.key !== 'Tab' || !filterPanelRef.current) return;

            const focusable = filterPanelRef.current.querySelectorAll<HTMLElement>('input:not(:disabled), button:not(:disabled)');
            if (focusable.length === 0) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener('keydown', handleKeyDown);
            filterTrigger?.focus();
        };
    }, [isMobileFilterOpen, closeMobileFilter]);

    const selectClient = (clientSlug: string | null) => {
        onSelectClient(clientSlug);
        closeMobileFilter();
        setClientSearch('');
    };

    const hideHint = () => {
        if (!showHint) {
            return;
        }

        setHasSeenHint(true);
        sessionStorage.setItem('client-list-hint-seen', 'true');
    };

    return (
        <div className={`clientListWrapper ${isScrollable ? 'is-scrollable' : ''}`}>
            <button
                ref={filterTriggerRef}
                type="button"
                className="mobileClientFilterTrigger"
                aria-haspopup="dialog"
                aria-expanded={isMobileFilterOpen}
                onClick={() => setIsMobileFilterOpen(true)}
            >
                <IoFilter aria-hidden="true" />
                <span className="mobileClientFilterLabel">{t('works.filterByClient')}</span>
                <span className="mobileClientFilterValue">{selectedClientName ?? t('works.allClients')}</span>
                {selectedClient !== null && <span className="mobileClientFilterDot" aria-hidden="true" />}
            </button>
            <ul
                ref={listRef}
                className="clientList"
                onScroll={hideHint}
                onTouchStart={hideHint}
            >
                <li>
                    <motion.button
                        type="button"
                        className={`client ${selectedClient === null ? 'selected' : ''}`}
                        aria-pressed={selectedClient === null}
                        onClick={() => { hideHint(); onSelectClient(null); }}
                        whileTap={shouldReduceMotion ? undefined : { scale: .97 }}
                        transition={{ type: 'spring', stiffness: 420, damping: 28 }}
                    >
                        {selectedClient === null && <motion.span className="clientActiveIndicator" layoutId="active-client-filter" transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 34 }} aria-hidden="true" />}
                        <span className="clientLabel">{t("works.allClients")}</span>
                    </motion.button>
                </li>

                {sortedClients.map((client: Client) => {
                    const hasNoProjects = client.projectsCount === 0;

                    return (
                        <li key={client.id}>
                            <motion.button
                                type="button"
                                data-client-item="true"
                                className={`client ${selectedClient === client.slug || selectedClient === client.id ? 'selected' : ''} ${hasNoProjects ? 'disabled' : ''}`}
                                aria-pressed={selectedClient === client.slug || selectedClient === client.id}
                                disabled={hasNoProjects}
                                onClick={() => { hideHint(); onSelectClient(client.slug); }}
                                whileTap={shouldReduceMotion || hasNoProjects ? undefined : { scale: .97 }}
                                transition={{ type: 'spring', stiffness: 420, damping: 28 }}
                            >
                                {(selectedClient === client.slug || selectedClient === client.id) && (
                                    <motion.span
                                        className="clientActiveIndicator"
                                        layoutId="active-client-filter"
                                        transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 34 }}
                                        aria-hidden="true"
                                    />
                                )}
                                <span className="clientLabel">{client.name}</span>
                                {hasNoProjects && <span className="clientStatus">{t("works.clientNoProjects")}</span>}
                            </motion.button>
                        </li>
                    );
                })}
            </ul>

            {showHint && isScrollable && (
                <span className="clientListHint" aria-hidden="true">
                    {t("works.swipeHint")}
                </span>
            )}

            {typeof document !== 'undefined' && createPortal(
                <AnimatePresence>
                    {isMobileFilterOpen && (
                        <motion.div
                            className="mobileClientFilterOverlay"
                            initial={shouldReduceMotion ? false : { opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={shouldReduceMotion ? undefined : { opacity: 0 }}
                            transition={{ duration: shouldReduceMotion ? 0 : .2 }}
                            onPointerDown={(event) => { if (event.target === event.currentTarget) closeMobileFilter(); }}
                        >
                            <motion.div
                                ref={filterPanelRef}
                                className="mobileClientFilterSheet"
                                role="dialog"
                                aria-modal="true"
                                aria-labelledby="mobile-client-filter-title"
                                initial={shouldReduceMotion ? false : { y: '100%' }}
                                animate={{ y: 0 }}
                                exit={shouldReduceMotion ? undefined : { y: '100%' }}
                                transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 360, damping: 34 }}
                            >
                                <div className="mobileClientFilterHeader">
                                    <div>
                                        <span className="mobileClientFilterEyebrow">{t('works.filterByClient')}</span>
                                        <h2 id="mobile-client-filter-title">{t('works.chooseClient')}</h2>
                                    </div>
                                    <button type="button" className="mobileClientFilterClose" onClick={closeMobileFilter} aria-label={t('works.closeClientFilter')}><IoClose /></button>
                                </div>
                                <label className="mobileClientSearch">
                                    <IoSearch aria-hidden="true" />
                                    <input
                                        ref={filterSearchRef}
                                        type="search"
                                        value={clientSearch}
                                        onChange={(event) => setClientSearch(event.target.value)}
                                        placeholder={t('works.searchClients')}
                                        aria-label={t('works.searchClients')}
                                    />
                                </label>
                                <div className="mobileClientFilterOptions">
                                    <button type="button" className={`mobileClientOption ${selectedClient === null ? 'is-selected' : ''}`} aria-pressed={selectedClient === null} onClick={() => selectClient(null)}>
                                        <span>{t('works.allClients')}</span>
                                        {selectedClient === null && <span className="mobileClientOptionCheck" aria-hidden="true">✓</span>}
                                    </button>
                                    {visibleClients.map((client) => {
                                        const isSelected = selectedClient === client.slug || selectedClient === client.id;
                                        const hasNoProjects = client.projectsCount === 0;
                                        return (
                                            <button
                                                key={client.id}
                                                type="button"
                                                className={`mobileClientOption ${isSelected ? 'is-selected' : ''}`}
                                                aria-pressed={isSelected}
                                                disabled={hasNoProjects}
                                                onClick={() => selectClient(client.slug)}
                                            >
                                                <span>{client.name}</span>
                                                {hasNoProjects
                                                    ? <small>{t('works.clientNoProjects')}</small>
                                                    : isSelected && <span className="mobileClientOptionCheck" aria-hidden="true">✓</span>}
                                            </button>
                                        );
                                    })}
                                    {visibleClients.length === 0 && <p className="mobileClientNoResults">{t('works.noClientsFound')}</p>}
                                </div>
                                {selectedClient !== null && <button type="button" className="mobileClientClear" onClick={() => selectClient(null)}>{t('works.clearClientFilter')}</button>}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </div>
    );
};
