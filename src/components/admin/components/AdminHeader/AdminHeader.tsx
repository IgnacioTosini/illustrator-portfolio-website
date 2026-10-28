"use client";

import { usePathname } from "next/navigation";
import { adminLinks } from "@/utils/links";
import { Links } from "@/components/ui/Links/Links";
import Link from "next/link";
import { ThemeSelector } from "@/components/ui/ThemeSelector/ThemeSelector";
import "./_adminHeader.scss";

export default function AdminHeader() {
    const pathname = usePathname();
    const activeLink = pathname === "/dashboard"
        ? "/dashboard"
        : adminLinks.find(({ link }) => link !== "/dashboard" && pathname.startsWith(link))?.link ?? null;

    return (
        <header className="adminHeader">
            <Link href="/dashboard" className="adminBrand">
                <span className="adminBrandMark">A</span>
                <span>Alukkart <small>STUDIO</small></span>
            </Link>
            <nav className="adminNavigation" aria-label="Administración">
                <Links links={adminLinks} activeLink={activeLink} className="adminNavLinks" />
            </nav>
            <div className="adminHeaderActions">
                <Link href="/" className="adminViewSite">Ver portfolio <span aria-hidden="true">↗</span></Link>
                <ThemeSelector />
            </div>
        </header>
    );
}
