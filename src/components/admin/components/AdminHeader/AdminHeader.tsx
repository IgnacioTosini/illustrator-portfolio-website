import { adminLinks } from "@/utils/links";
import { Links } from "@/components/ui/Links/Links";
import Link from "next/link";
import { ThemeSelector } from "@/components/ui/ThemeSelector/ThemeSelector";
import "./_adminHeader.scss";

export default function AdminHeader() {
    return (
        <div className="header">
            <Link href='/#' className="header-link name">Alukkart</Link>
            <Links links={adminLinks} />
            <ThemeSelector />
        </div>
    )
}
