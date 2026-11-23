import type { ReactNode } from "react";
import SmoothScroll from "@/src/components/SmoothScroll";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import MobileBar from "@/src/components/MobileBar";
import { getContent } from "@/src/lib/content-store";

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const c = await getContent();
  return (
    <>
      <SmoothScroll />
      <Header brand={c.brand} contact={c.contact} nav={c.nav} ui={c.ui} />
      <main className="flex-1">{children}</main>
      <Footer brand={c.brand} contact={c.contact} nav={c.nav} footer={c.footer} />
      <MobileBar contact={c.contact} ui={c.ui} />
    </>
  );
}
