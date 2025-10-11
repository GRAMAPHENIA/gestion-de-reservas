import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs';
import "./globals.css";
import LayoutHeader from "@/components/LayoutHeader";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Poppins para encabezados y UI (más parecido a referencia)
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400","600","700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Hoteles",
  description: "Encontra tu alojamiento ideal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      // @ts-ignore
      locale="es-ES"
      appearance={{
        theme: 'simple',
      }}
    >
      <html lang="es">
        <body
          className={`${inter.variable} ${poppins.variable} antialiased font-inter`}
        >
          <LayoutHeader />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
