import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import { presentationScript } from "@/lib/motion/presentation";
import "./globals.css";

/* P1 working typeface (approved at Gate 1; may be revisited later). */
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
});

/*
 * Inline in <head>, so it runs synchronously before the body is parsed or
 * painted: marks JS as available so enhanced components (the
 * chapter navigator) may collapse their no-JS layout, and mirrors the
 * compact-viewport state for scene CSS (see lib/motion/presentation.ts).
 */
const bootScript = `document.documentElement.dataset.js="";${presentationScript}`;

export const metadata: Metadata = {
  title: "Matthew Blanke",
  description: "Portfolio of Matthew Blanke.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // The boot script sets data attributes on <html> before hydration.
    <html lang="en" className={archivo.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
