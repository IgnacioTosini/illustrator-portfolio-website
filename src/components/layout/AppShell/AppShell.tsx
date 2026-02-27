'use client'

import Header from "@/components/layout/Header/Header";
import Footer from "@/components/layout/Footer/Footer";
import { usePathname } from "next/navigation";

export default function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isDashboard = pathname.startsWith('/dashboard');

    return (
        <>
            {!isDashboard && <Header />}
            {children}
            {!isDashboard && <Footer />}
        </>
    );
}
