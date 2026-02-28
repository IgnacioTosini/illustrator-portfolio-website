'use client';

import { useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useClientsQuery } from '@/hooks/client/useClientsQuery';
import { motionPreset } from '@/animations/gsap/motionPreset';
import { prefersReducedMotion } from '@/animations/gsap/reducedMotion';
import { Client } from '@/types';
import './_clientList.scss';

interface Props {
    selectedClient: string | null;
    onSelectClient: (id: string | null) => void;
}

export const ClientList = ({ selectedClient, onSelectClient }: Props) => {
    const { data: clients = [] } = useClientsQuery();
    const sortedClients = [...clients].sort((a, b) => {
        const aHasNoProjects = a.projectsCount === 0;
        const bHasNoProjects = b.projectsCount === 0;

        if (aHasNoProjects === bHasNoProjects) {
            return 0;
        }

        return aHasNoProjects ? 1 : -1;
    });

    const listRef = useRef<HTMLUListElement>(null);
    const [isScrollable, setIsScrollable] = useState(false);
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

    const hideHint = () => {
        if (!showHint) {
            return;
        }

        setHasSeenHint(true);
        sessionStorage.setItem('client-list-hint-seen', 'true');
    };

    return (
        <div className={`clientListWrapper ${isScrollable ? 'is-scrollable' : ''}`}>
            <ul
                ref={listRef}
                className="clientList"
                onScroll={hideHint}
                onTouchStart={hideHint}
            >
                <li
                    className={`client ${selectedClient === null ? 'selected' : ''}`}
                    onClick={() => {
                        hideHint();
                        onSelectClient(null);
                    }}
                >
                    Todos
                </li>

                {sortedClients.map((client: Client) => {
                    const hasNoProjects = client.projectsCount === 0;

                    return (
                        <li
                            key={client.id}
                            data-client-item="true"
                            className={`client ${selectedClient === client.slug ? 'selected' : ''} ${hasNoProjects ? 'disabled' : ''}`}
                            onClick={() => {
                                if (hasNoProjects) {
                                    return;
                                }

                                hideHint();
                                onSelectClient(client.slug);
                            }}
                        >
                            <span>{client.name}</span>
                            {hasNoProjects && <span className="clientStatus">Sin proyectos</span>}
                        </li>
                    );
                })}
            </ul>

            {showHint && isScrollable && (
                <span className="clientListHint" aria-hidden="true">
                    Deslizá para ver más →
                </span>
            )}
        </div>
    );
};