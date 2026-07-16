import './_links.scss';

interface Props {
    links: { link: string, title: string }[];
    activeLink?: string | null;
    className?: string;
}

export const Links = ({ links = [], activeLink = null, className = "" }: Props) => {
    return (
        <div className={`links ${className}`.trim()}>
            {links.map(link => (
                <a
                    key={link.link}
                    href={link.link}
                    className={`link ${activeLink === link.link ? "is-active" : ""}`}
                    aria-current={activeLink === link.link ? "page" : undefined}
                >
                    {link.title}
                </a>
            ))}
        </div>
    )
}
