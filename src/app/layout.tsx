import type { Metadata } from "next";
import { Archivo, Instrument_Sans, Schibsted_Grotesk } from "next/font/google";
import Script from "next/script";
import "./globals.css";

/*
 * Gate 1 typography exploration: three free (OFL) candidates tested in the
 * real hero. Archivo is the default; the others are not preloaded and only
 * download when selected with `?type=instrument` or `?type=schibsted`.
 * Remove the unchosen families once Gate 1 picks one.
 */
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-instrument",
  preload: false,
});

const schibstedGrotesk = Schibsted_Grotesk({
  subsets: ["latin"],
  variable: "--font-schibsted",
  preload: false,
});

const fontVariables = [archivo, instrumentSans, schibstedGrotesk]
  .map((font) => font.variable)
  .join(" ");

/*
 * Runs before paint: marks JS as available so enhanced components (the
 * chapter navigator) may collapse their no-JS layout. The `type` and
 * `guides` parameters are Gate 1 exploration only.
 */
const bootScript = `(function(){var d=document.documentElement;d.dataset.js="";var p=new URLSearchParams(location.search);var t=p.get("type");if(t==="instrument"||t==="schibsted")d.dataset.type=t;if(p.has("guides"))d.dataset.guides="";})();`;

export const metadata: Metadata = {
  title: "Matthew Blanke",
  description: "Portfolio of Matthew Blanke.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // The boot script sets data attributes before hydration.
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <body>
        {children}
        <Script id="boot" strategy="beforeInteractive">
          {bootScript}
        </Script>
      </body>
    </html>
  );
}
