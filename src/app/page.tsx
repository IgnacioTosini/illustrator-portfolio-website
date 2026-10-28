import type { Metadata } from "next";
import AboutSection from "@/components/sections/AboutSection/AboutSection"
import ContactSection from "@/components/sections/ContactSection/ContactSection"
import HeroSection from "@/components/sections/HeroSection/HeroSection"
import ProcessSection from "@/components/sections/ProcessSection/ProcessSection"
import WorkSection from "@/components/sections/WorkSection/WorkSection"
import { getFeaturedProjects } from "@/actions/project/getProjects"
import { getHomeContent } from "@/actions/home/getHomeContent";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Alukkart - Comic Character Illustration",
  description: "I will design and make an illustration of your comic character. Professional comic illustrator from Argentina with 5.0 reviews on Fiverr.",
  alternates: {
    canonical: "/",
  },
};

export default async function Home() {
  const [projects, homeContent] = await Promise.all([getFeaturedProjects(6), getHomeContent()]);

  return (
    <div className="home" id="top">
      <HeroSection homeContent={homeContent} featuredProject={projects.find((project) => project.images[0]?.url)} />
      <WorkSection projects={projects} homeContent={homeContent} />
      <AboutSection homeContent={homeContent} />
      <ProcessSection homeContent={homeContent} />
      <ContactSection homeContent={homeContent} />
    </div>
  )
}
