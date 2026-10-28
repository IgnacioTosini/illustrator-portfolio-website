'use client';

import './_pagination.scss';

export interface PaginationLabels {
    previous?: string;
    next?: string;
    first?: string;
    last?: string;
    page?: (page: number) => string;
    navigation?: string;
    showing?: string;
    of?: string;
}

interface Props {
    currentPage: number;
    totalItems: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    labels?: PaginationLabels;
    className?: string;
}

export function Pagination({ currentPage, totalItems, pageSize, onPageChange, labels, className = '' }: Props) {
    const totalPages = Math.ceil(totalItems / pageSize);
    if (totalPages <= 1) return null;

    const safePage = Math.min(totalPages, Math.max(1, currentPage));
    const startPage = Math.max(1, Math.min(safePage - 2, totalPages - 4));
    const endPage = Math.min(totalPages, startPage + 4);
    const startItem = (safePage - 1) * pageSize + 1;
    const endItem = Math.min(safePage * pageSize, totalItems);
    const previous = labels?.previous ?? 'Anterior';
    const next = labels?.next ?? 'Siguiente';
    const first = labels?.first ?? 'Primera página';
    const last = labels?.last ?? 'Última página';
    const pageLabel = labels?.page ?? ((page: number) => `Página ${page}`);

    const goTo = (page: number) => onPageChange(Math.min(totalPages, Math.max(1, page)));
    const pageNumbers = Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);

    return (
        <div className={`pagination ${className}`.trim()}>
            <p className="paginationSummary" aria-live="polite">
                {labels?.showing ?? 'Mostrando'} <strong>{startItem}–{endItem}</strong> {labels?.of ?? 'de'} <strong>{totalItems}</strong>
            </p>
            <nav className="paginationNav" aria-label={labels?.navigation ?? 'Paginación'}>
                <button type="button" className="paginationArrow" onClick={() => goTo(1)} disabled={safePage === 1} aria-label={first}>«</button>
                <button type="button" className="paginationArrow" onClick={() => goTo(safePage - 1)} disabled={safePage === 1} aria-label={previous}>‹</button>
                {startPage > 1 && <span className="paginationEllipsis" aria-hidden="true">…</span>}
                {pageNumbers.map((page) => (
                    <button
                        type="button"
                        key={page}
                        className={`paginationPage ${page === safePage ? 'is-current' : ''}`}
                        onClick={() => goTo(page)}
                        aria-label={pageLabel(page)}
                        aria-current={page === safePage ? 'page' : undefined}
                    >
                        {page}
                    </button>
                ))}
                {endPage < totalPages && <span className="paginationEllipsis" aria-hidden="true">…</span>}
                <button type="button" className="paginationArrow" onClick={() => goTo(safePage + 1)} disabled={safePage === totalPages} aria-label={next}>›</button>
                <button type="button" className="paginationArrow" onClick={() => goTo(totalPages)} disabled={safePage === totalPages} aria-label={last}>»</button>
            </nav>
        </div>
    );
}
