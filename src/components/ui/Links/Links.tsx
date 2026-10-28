import type { MouseEvent } from 'react';
import './_links.scss';

interface Props {
    links: { link: string, title: string }[];
    activeLink?: string | null;
    className?: string;
    onLinkClick?: (event: MouseEvent<HTMLAnchorElement>, link: string) => void;
    onLinkEnter?: (link: string) => void;
    onLinkKeyDown?: (event: React.KeyboardEvent<HTMLAnchorElement>, link: string) => void;
}

export const Links = ({ links = [], activeLink = null, className = "", onLinkClick, onLinkEnter, onLinkKeyDown }: Props) => {
    return (
        <div className={`links ${className}`.trim()}>
            {links.map(link => (
                <a
                    key={link.link}
                    href={link.link}
                    className={`link ${activeLink === link.link ? "is-active" : ""}`}
                    aria-current={activeLink === link.link ? "page" : undefined}
                    onClick={(event) => onLinkClick?.(event, link.link)}
                    onMouseEnter={() => onLinkEnter?.(link.link)}
                    onFocus={() => onLinkEnter?.(link.link)}
                    onKeyDown={(event) => onLinkKeyDown?.(event, link.link)}
                >
                    {link.title}
                </a>
            ))}
        </div>
    )
}
