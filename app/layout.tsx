import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Fraunces, Manrope } from "next/font/google";
import SmoothScroll from "@/src/components/SmoothScroll";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import MobileBar from "@/src/components/MobileBar";
import { site } from "@/src/content/site";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  axes: ["SOFT", "opsz"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: { default: `${site.name} · Mobilje me porosi dhe montim`, template: `%s · ${site.name}` },
  description: site.description,
  openGraph: {
    title: `${site.name} · ${site.tagline}`,
    description: site.description,
    locale: "sq_AL",
    type: "website",
    siteName: site.name,
  },
  twitter: { card: "summary_large_image" },
};

// Draw under the notch and tint the browser bars linen to match the page
export const viewport: Viewport = {
  themeColor: "#f4eee4",
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="sq" className={`${fraunces.variable} ${manrope.variable}`}>
      <body id="top" className="grain flex min-h-dvh flex-col">
        <noscript>
          <style>{`.invisible{visibility:visible!important}#intro{display:none}`}</style>
        </noscript>
        <SmoothScroll />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <MobileBar />
      </body>
    </html>
  );
}
