import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Fraunces, Manrope } from "next/font/google";
import { getContent } from "@/src/lib/content-store";
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

export async function generateMetadata(): Promise<Metadata> {
  const { brand } = await getContent();
  return {
    title: { default: `${brand.name} · Mobilje me porosi dhe montim`, template: `%s · ${brand.name}` },
    description: brand.description,
    openGraph: {
      title: `${brand.name} · ${brand.tagline}`,
      description: brand.description,
      locale: "sq_AL",
      type: "website",
      siteName: brand.name,
    },
    twitter: { card: "summary_large_image" },
  };
}

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
        {children}
      </body>
    </html>
  );
}
