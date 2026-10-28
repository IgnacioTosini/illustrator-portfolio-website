'use client';

import { useEffect } from 'react';
import './_adminModal.scss';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    children?: React.ReactNode;
}

export const AdminModal = ({ isOpen, onClose, title, description, children }: Props) => {
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="adminModalOverlay" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
            <section className="adminModal" role="dialog" aria-modal="true" aria-labelledby="admin-modal-title">
                <header className="adminModalHeader">
                    <div>
                        <span className="modalEyebrow">GESTIÓN</span>
                        <h2 id="admin-modal-title">{title}</h2>
                        {description && <p>{description}</p>}
                    </div>
                    <button type="button" className="modalClose" onClick={onClose} aria-label="Cerrar ventana">×</button>
                </header>
                {children}
            </section>
        </div>
    );
}
