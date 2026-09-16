import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/lib/components/Navbar";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IMMO-CI | Votre Partenaire Immobilier de Confiance",
  description: "Trouvez et vendez vos biens immobiliers en toute sécurité à Kinshasa et en RDC.",
  manifest: "/manifest.webmanifest",
  themeColor: "#0f172a",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "IMMO-CI" },
};

// Convention Next.js 16 : `viewport` est un export dédié (metadata.viewport déprécié).
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f172a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-slate-900`}>
        {/* La Navbar apparaîtra en haut de TOUTES tes pages */}
        <Navbar />

        {/* Le padding top (pt-24) est ESSENTIEL car la Navbar est "fixed". 
          Sans lui, le contenu de tes pages serait caché derrière la barre de navigation.
        */}
        <main className="pt-24 min-h-screen">
          {children}
        </main>
        <footer className="border-t border-slate-200 bg-slate-50 py-8 text-center text-sm text-slate-600">
          <p>© 2026 Mulume Izuba Oscar · IMMO-CI. Tous droits réservés.</p>
          <p className="mt-1">
            <Link href="/mentions-legales" className="underline hover:text-slate-900">
              Mentions légales
            </Link>
          </p>
        </footer>
        <script
          dangerouslySetInnerHTML={{
            __html: `if('serviceWorker' in navigator){window.addEventListener('load',()=>{navigator.serviceWorker.register('/sw.js')})}`,
          }}
        />
      </body>
    </html>
  );
}