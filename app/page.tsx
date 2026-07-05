import { Hero } from "@/components/home/Hero";
import { Capabilities } from "@/components/home/Capabilities";
import { Products } from "@/components/home/Products";
import { HowItWorks } from "@/components/home/HowItWorks";
import { DemoChat } from "@/components/home/DemoChat";
import { AboutTeaser } from "@/components/home/AboutTeaser";
import { FinalCTA } from "@/components/home/FinalCTA";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Capabilities />
      <Products />
      <HowItWorks />
      <DemoChat />
      <AboutTeaser />
      <FinalCTA />
    </main>
  );
}
