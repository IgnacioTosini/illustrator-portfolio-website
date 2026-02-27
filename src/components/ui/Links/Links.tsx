import './_links.scss';

interface Props {
    links: { link: string, title: string }[];
}

export const Links = ({ links = [] }: Props) => {
    return (
        <div className="links">
            {links.map(link => (
                <a key={link.link} href={link.link} className="link">{link.title}</a>
            ))}
        </div>
    )
}
