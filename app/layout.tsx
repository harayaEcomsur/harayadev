import type { Metadata } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { buildMetadata, buildPersonOrgJsonLd } from "@/lib/seo";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-body",
});
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-mono" });

export const metadata: Metadata = buildMetadata();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = buildPersonOrgJsonLd();

  return (
    // Archivo cubre heading y body en este diseño; JetBrains Mono es la mono de etiquetas.
    <html lang="es-CL" className={`${archivo.variable} ${mono.variable}`} style={{ ["--font-heading" as string]: "var(--font-body)" }}>
      <body>
        <Header />
        {children}
        <Footer />
        <ChatWidget />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
