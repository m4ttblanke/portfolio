import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import Script from "next/script";
import "./globals.css";

/* P1 working typeface (approved at Gate 1; may be revisited later). */
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
});

/*
 * Runs before paint: marks JS as available so enhanced components (the
 * chapter navigator) may collapse their no-JS layout.
 */
const bootScript = `document.documentElement.dataset.js="";`;

export const metadata: Metadata = {
  title: "Matthew Blanke",
  description: "Portfolio of Matthew Blanke.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // The boot script sets a data attribute before hydration.
    <html lang="en" className={archivo.variable} suppressHydrationWarning>
      <body>
        {children}
        <Script id="boot" strategy="beforeInteractive">
          {bootScript}
        </Script>
      </body>
    </html>
  );
}
