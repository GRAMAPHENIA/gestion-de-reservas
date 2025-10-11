import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs';
// localization (experimental) for Clerk UI strings
import { esES } from '@clerk/localizations';
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
      // For Clerk localization (experimental)
      localization={esES}
      appearance={{
        // ensure Tailwind utility classes override Clerk defaults when needed
        cssLayerName: 'clerk',
        // general variables mapped to our design tokens
        variables: {
          colorPrimary: '#111827', // accent / foreground
          colorForeground: '#111827',
          colorMutedForeground: '#6b7280',
          colorMuted: '#f3f4f6',
          colorBackground: '#ffffff',
          colorInput: '#ffffff',
          colorInputForeground: '#111827',
          colorBorder: '#121212',
          colorRing: '#c7d2fe',
          colorShadow: 'rgba(2,6,23,0.08)',
          colorModalBackdrop: 'rgba(2,6,23,0.45)',
          fontFamily: 'var(--font-poppins, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial)',
          fontFamilyButtons: 'var(--font-poppins, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial)',
          borderRadius: '0',
          spacing: '1rem'
        },
        // map Clerk element keys to Tailwind utility classes (fine-grained control)
        elements: {
          // primary action button
          formButtonPrimary: 'bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-md text-sm font-medium',
          // secondary / ghost buttons
          formButtonSecondary: 'bg-transparent text-gray-700 px-3 py-2 text-sm',
          // inputs and selects
          formInput: 'w-full bg-white border border-gray-300 px-3 py-2 rounded-md text-sm text-gray-900',
          formLabel: 'text-sm text-gray-700 font-medium',
          // links inside forms
          anchor: 'text-sm text-gray-700 hover:text-gray-900'
        }
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
