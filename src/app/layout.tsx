import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
});

export const metadata: Metadata = {
  title: "Memória Viva - Apoio para Alzheimer",
  description: "App gratuito para auxiliar pacientes com Alzheimer e seus cuidadores usando Inteligência Artificial",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Memória Viva",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${openSans.variable} font-sans antialiased bg-memoria-viva min-h-screen text-[20px]`}
        suppressHydrationWarning
      >
        <Providers>
          {children}
        </Providers>
        {/* Anúncio para leitores de tela */}
        <div
          id="screen-reader-announcement"
          role="status"
          aria-live="polite"
          className="sr-only"
        />
      </body>
    </html>
  );
}
