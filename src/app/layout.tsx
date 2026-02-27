import type { Metadata } from "next";
import AppShell from "@/components/layout/AppShell/AppShell";
import { inter } from "@/config/fonts";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Providers from "@/providers/Providers";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://alukkart.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Alukkart - Portafolio de Ilustración",
    template: "%s | Alukkart",
  },
  description: "Portafolio de ilustración de Alukkart con proyectos de diseño de personajes, ilustración editorial y narrativa visual.",
  keywords: [
    "ilustrador freelance",
    "portafolio de ilustración",
    "diseño de personajes",
    "ilustración editorial",
    "narrativa visual",
    "Alukkart",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: siteUrl,
    siteName: "Alukkart",
    title: "Alukkart - Portafolio de Ilustración",
    description: "Portafolio de ilustración de Alukkart con proyectos de diseño de personajes, ilustración editorial y narrativa visual.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Alukkart - Portafolio de Ilustración",
    description: "Portafolio de ilustración de Alukkart con proyectos de diseño de personajes, ilustración editorial y narrativa visual.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/alukkart.webp",
    shortcut: "/alukkart.webp",
    apple: "/alukkart.webp",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable}`}>
        <Providers>
          <AppShell>{children}</AppShell>
          <ToastContainer position="top-right" autoClose={2500} />
        </Providers>
      </body>
    </html>
  );
}
