import type { Metadata, Viewport } from "next";
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

/*
 * Site metadata. Social images, icons, robots.txt and sitemap.xml come from
 * the file conventions beside this layout (opengraph-image.png,
 * twitter-image.png, icon.png, apple-icon.png, robots.ts, sitemap.ts).
 */
const description =
  "Matthew Blanke is a UC Santa Barbara computer science student building software, interactive products, and secure systems.";

export const metadata: Metadata = {
  metadataBase: new URL("https://matthewblanke.com"),
  title: {
    default: "Matthew Blanke",
    template: "%s — Matthew Blanke",
  },
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Matthew Blanke",
    title: "Matthew Blanke",
    description,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Matthew Blanke",
    description,
  },
  robots: { index: true, follow: true },
};

/* The bone ground, so browser chrome matches the page. */
export const viewport: Viewport = {
  themeColor: "#f2f0eb",
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
