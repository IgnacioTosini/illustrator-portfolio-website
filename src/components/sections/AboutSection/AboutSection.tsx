"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { Title } from "@/components/ui/Title/Title";
import { animateAboutSection } from "@/animations/gsap/aboutSection";
import './_aboutSection.scss';

export default function AboutSection() {
  const aboutRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      if (!aboutRef.current) return;
      return animateAboutSection(aboutRef.current);
    },
    { scope: aboutRef }
  );

  return (
    <div ref={aboutRef} className="aboutSection" id="about">
      <Title title={"Sobre Mi"} subTitle={"El Artista"} />
      <div className="aboutSectionContent">
        <Image
          src={'/alukkart.webp'}
          alt="About Section"
          width={500}
          height={500}
        />

        <div className="aboutSectionText">
          <p>Soy Alukkart, ilustrador freelance especializado en diseno de personajes, ilustracion editorial y narrativa visual. Con mas de ocho anos de experiencia profesional, he tenido el privilegio de trabajar con editoriales, agencias y marcas a nivel mundial.</p>

          <p> Mi trabajo combina sensibilidades del dibujo tradicional con tecnicas digitales para crear imagenes que se sienten atemporales y contemporaneas a la vez. Creo que cada ilustracion debe contar una historia y evocar emociones, ya sea en una portada de libro, una revista o una campana de marca.</p>

          <p>He colaborado con clientes como Penguin Random House, Wired Magazine, Riot Games y numerosos estudios independientes. Siempre estoy abierto a nuevos proyectos que empujen los limites creativos.</p>

          <p>Cuando no estoy ilustrando, me puedes encontrar dibujando en mercados locales, explorando librerias o experimentando con nuevas tecnicas en mi estudio.</p>
          <div className="aboutSectionAbilitiesTools">
            <div className="abilities">
              <h3>Habilidades</h3>
              <ul className="abilitiList">
                <li className="abilitie">Ilustracion Digital</li>
                <li className="abilitie">Diseno de Personajes</li>
                <li className="abilitie">Arte Conceptual</li>
                <li className="abilitie">Ilustracion Editorial</li>
                <li className="abilitie">Narrativa Visual</li>
              </ul>
            </div>
            <div className="tools">
              <h3>Herramientas</h3>
              <ul className="toolList">
                <li className="tool">Procreate</li>
                <li className="tool">Photoshop
                </li>
                <li className="tool">Illustrator</li>
                <li className="tool">Figma</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
