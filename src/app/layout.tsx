import type { Metadata } from "next";
import { Syne, Space_Grotesk, JetBrains_Mono, Cairo } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["600", "700", "800"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600", "700"],
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-arabic",
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Youssef Hegazy — Aviation Systems, Real-Time CFD & Full-Stack Engineering",
  description:
    "Portfolio of Youssef Hegazy: Aviation Information Systems, real-time Navier-Stokes fluid simulation, procedural 3D aircraft engineering, EgSA remote sensing, and production full-stack software.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      dir="ltr"
      suppressHydrationWarning
      className={`${syne.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} ${cairo.variable}`}
    >
      <body
        suppressHydrationWarning
        className="bg-[#04070f] text-[#edf2fa] antialiased selection:bg-[#38bdf8]/30 selection:text-white"
      >
        {children}
      </body>
    </html>
  );
}
