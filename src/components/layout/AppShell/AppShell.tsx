'use client'

import Header from "@/components/layout/Header/Header";
import Footer from "@/components/layout/Footer/Footer";
import { WorkRouteTransitionProvider } from "@/components/layout/WorkRouteTransition/WorkRouteTransition";
import { SectionNavigationProvider } from "@/components/layout/SectionNavigation/SectionNavigation";
import { usePathname } from "next/navigation";

export default function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isDashboard = pathname.startsWith('/dashboard');
    const isLogin = pathname === '/login';
    const showPublicLayout = !isDashboard && !isLogin;

    if (!showPublicLayout) return <>{children}</>;

    return (
        <WorkRouteTransitionProvider>
            <SectionNavigationProvider>
                <Header />
                {children}
                <Footer />
            </SectionNavigationProvider>
        </WorkRouteTransitionProvider>
    );
}
