import Hero from "@/src/components/Hero";
import Marquee from "@/src/components/Marquee";
import Services from "@/src/components/Services";
import Work from "@/src/components/Work";
import Assembly from "@/src/components/Assembly";
import Process from "@/src/components/Process";
import Materials from "@/src/components/Materials";
import Why from "@/src/components/Why";
import Contact from "@/src/components/Contact";
import { getContent } from "@/src/lib/content-store";

// Static, rebuilt when the admin saves (revalidatePath) and hourly as a safety net
export const revalidate = 3600;

export default async function Home() {
  const c = await getContent();
  return (
    <>
      <Hero brand={c.brand} contact={c.contact} hero={c.hero} />
      <Marquee words={c.marquee.words} />
      <Services services={c.services} />
      <Work work={c.work} contact={c.contact} />
      <Assembly assembly={c.assembly} />
      <Process process={c.process} />
      <Materials materials={c.materials} />
      <Why why={c.why} />
      <Contact brand={c.brand} contact={c.contact} section={c.contactSection} />
    </>
  );
}
