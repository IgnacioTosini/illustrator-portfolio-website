import type { Metadata } from "next";
import AdminHeader from "@/components/admin/components/AdminHeader/AdminHeader";
import Footer from "@/components/layout/Footer/Footer";
import Providers from "@/providers/Providers";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

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
        <div>
            <Providers>
                <AdminHeader />
                {children}
                <ToastContainer position="top-right" autoClose={2500} />
                <Footer />
            </Providers>
        </div>
    );
}