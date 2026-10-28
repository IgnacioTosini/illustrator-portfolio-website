import type { Metadata } from "next";
import AdminHeader from "@/components/admin/components/AdminHeader/AdminHeader";
import "./_dashboardLayout.scss";

export const metadata: Metadata = {
    title: "Dashboard",
    robots: {
        index: false,
        follow: false,
        googleBot: {
            index: false,
            follow: false,
        },
    },
};

export default function AdminLayout({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="adminLayout">
            <AdminHeader />
            {children}
        </div>
    );
}
