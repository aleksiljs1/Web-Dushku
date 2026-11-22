import Hero from "@/src/components/Hero";
import Marquee from "@/src/components/Marquee";
import Services from "@/src/components/Services";
import Assembly from "@/src/components/Assembly";
import Process from "@/src/components/Process";
import Materials from "@/src/components/Materials";
import Why from "@/src/components/Why";
import Contact from "@/src/components/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <Services />
      <Assembly />
      <Process />
      <Materials />
      <Why />
      <Contact />
    </>
  );
}
