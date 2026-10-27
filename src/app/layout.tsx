import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "FORJA | Más fuertes cada día",
    template: "%s | FORJA",
  },
  description:
    "Tienda de equipamiento deportivo para mujeres que se forjan y se hacen más fuertes cada día. Balones, pesas, accesorios y más. Envíos a todo Colombia.",
  metadataBase: new URL("https://forja.example.com"),
  icons: {
    icon: "/favicon.ico",
    apple: "/logo_final.jpeg",
  },
  openGraph: {
    type: "website",
    locale: "es_CO",
    siteName: "FORJA",
    title: "FORJA | Más fuertes cada día",
    description:
      "Equipamiento deportivo diseñado para mujeres que se forjan y se hacen más fuertes cada día.",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export const viewport: Viewport = {
  themeColor: "#FF3D9A", // Nuevo color rosa de la marca
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-brand-purple-900">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4
                     focus:z-50 focus:rounded-lg focus:bg-brand-pink-500
                     focus:px-4 focus:py-2 focus:text-white"
        >
          Saltar al contenido
        </a>
        <SiteHeader />
        <main id="main" className="flex-1 relative">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}