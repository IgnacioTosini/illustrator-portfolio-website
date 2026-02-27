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
  title: "Alukkart - Ilustrador Freelance",
  description: "Explora el portafolio de Alukkart: diseño de personajes, ilustración editorial y narrativa visual para marcas y editoriales.",
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
