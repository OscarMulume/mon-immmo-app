import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/lib/components/Navbar";

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
      </body>
    </html>
  );
}