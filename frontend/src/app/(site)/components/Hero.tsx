"use client";

import { motion } from "framer-motion";

export function Hero() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-center px-6 pt-20 noise-bg overflow-hidden">
      <div className="max-w-7xl mx-auto w-full relative z-20">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-4xl"
        >
          <motion.h1 
            variants={item}
            className="font-display text-5xl md:text-8xl font-bold leading-[1.1] tracking-tight mb-8"
          >
            Precisão que você <br />
            <span className="text-zinc-600">já conhece.</span> <br />
            Espaço que é <span className="text-accent italic">só nosso.</span>
          </motion.h1>

          <motion.p 
            variants={item}
            className="font-body text-lg md:text-xl text-muted max-w-xl mb-12 leading-relaxed"
          >
            IdalgoCortes — Barbearia profissional. No comando, um especialista com anos de história e uma visão única de estilo. Bem-vindo à nova casa.
          </motion.p>

          <motion.div variants={item} className="flex flex-col sm:flex-row gap-4">
            <a
              href="#agendamento"
              className="px-10 py-5 bg-accent text-black text-xs font-bold uppercase tracking-[0.2em] rounded-sm hover:opacity-90 transition-all text-center"
            >
              Agendar agora
            </a>
            <a
              href="#servicos"
              className="px-10 py-5 border border-zinc-800 text-white text-xs font-bold uppercase tracking-[0.2em] rounded-sm hover:bg-zinc-900 transition-all text-center"
            >
              Ver serviços
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative vertical line */}
      <div className="absolute right-12 bottom-0 w-[1px] h-32 bg-zinc-800 hidden md:block" />
    </section>
  );
}
