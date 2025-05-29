import Image from "next/image";
import Link from "next/link";
import React from "react";

const HeroSection = () => (
  <section className="hero bg-base-200 min-h-screen">
    <div className="hero-content w-full max-w-5xl flex-col lg:flex-row justify-between">
      <div>
        <h1 className="text-5xl font-bold">CROSSBOTS</h1>
        <p className="py-6 text-2xl max-w-md">
          A (talvez) melhor equipe de robótica do Brasil. Estamos aqui para fazer história e conquistar o
          mundo! Venha fazer parte dessa jornada incrível com a gente!
        </p>
        <Link href={"https://www.pudim.com.br/"} className="btn btn-primary">
          Não clique!
        </Link>
      </div>
      <Image
        src={"/crossbots-team.jpeg"}
        alt="Crossbots Team"
        width={800}
        height={800}
        loading="lazy"
        className="max-w-1/2 rounded-lg shadow-2xl"
      />
    </div>
  </section>
);

export default HeroSection;
