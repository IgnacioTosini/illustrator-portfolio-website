import type { Metadata } from "next";
import Script from "next/script";
import AppShell from "@/components/layout/AppShell/AppShell";
import { inter } from "@/config/fonts";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Providers from "@/providers/Providers";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://alukkart.com";
const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
const defaultSocialImage = `${siteUrl}/alukkart.webp`;

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
    images: [
      {
        url: defaultSocialImage,
        width: 750,
        height: 750,
        alt: "Alukkart - Portafolio de Ilustración",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Alukkart - Portafolio de Ilustración",
    description: "Portafolio de ilustración de Alukkart con proyectos de diseño de personajes, ilustración editorial y narrativa visual.",
    images: [defaultSocialImage],
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
        {gtmId ? (
          <Script id="google-tag-manager" strategy="afterInteractive">
            {`
              (function(w,d,s,l,i){
                w[l]=w[l]||[];
                w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
                var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
                j.async=true;
                j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
                f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${gtmId}');
            `}
          </Script>
        ) : null}
        {gtmId ? (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        ) : null}
        <Providers>
          <AppShell>{children}</AppShell>
          <ToastContainer position="top-right" autoClose={2500} />
        </Providers>
      </body>
    </html>
  );
}
