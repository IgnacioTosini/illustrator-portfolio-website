import type { Metadata } from "next";
import AboutSection from "@/components/sections/AboutSection/AboutSection"
import ContactSection from "@/components/sections/ContactSection/ContactSection"
import HeroSection from "@/components/sections/HeroSection/HeroSection"
import ProcessSection from "@/components/sections/ProcessSection/ProcessSection"
import WorkSection from "@/components/sections/WorkSection/WorkSection"
import { getFeaturedProjects } from "@/actions/project/getProjects"

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Alukkart - Comic Character Illustration",
  description: "I will design and make an illustration of your comic character. Professional comic illustrator from Argentina with 5.0 reviews on Fiverr.",
  alternates: {
    canonical: "/",
  },
};

export default async function Home() {
  const projects = await getFeaturedProjects(6)

  return (
    <div className="home" id="top">
      <HeroSection />
      <WorkSection projects={projects} />
      <AboutSection />
      <ProcessSection />
      <ContactSection />
    </div>
  )
}
