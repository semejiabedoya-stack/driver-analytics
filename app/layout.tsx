import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { PwaRegister } from "@/components/PwaRegister";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Driver Analytics",
  description: "Sistema inteligente para conductores de plataformas.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "Driver Analytics",
    statusBarStyle: "black-translucent"
  }
};

export const viewport: Viewport = {
  themeColor: "#16a34a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <PwaRegister />
        {children}
      </body>
    </html>
  );
}
