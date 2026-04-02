import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";
import { GlobalLoader } from "@/components/global-loader";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Aseguradora XYZ — Sistema de Gestión Técnica",
  description:
    "Plataforma de gestión técnica para procesos de seguros, cobranzas y cancelaciones automáticas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${manrope.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <GlobalLoader />
      </body>
    </html>
  );
}
