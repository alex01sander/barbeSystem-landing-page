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
    <section className="relative min-h-screen flex items-center justify-center px-6 md:px-8 pt-20 overflow-hidden bg-black">
      {/* Background Banner with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=2070')] bg-cover bg-center grayscale opacity-60 mix-blend-luminosity scale-110" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/10 to-black/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black" />
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center text-center"
        >
          <motion.div variants={item} className="mb-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] md:tracking-[0.5em] text-zinc-500">Premium Barbering Experience</span>
          </motion.div>

          <motion.h1 
            variants={item}
            className="font-display text-5xl sm:text-7xl md:text-[120px] font-black leading-[0.9] tracking-[-0.04em] mb-8 uppercase"
          >
            PRECISÃO <br />
            <span className="text-stroke">DEFINIDA</span>
          </motion.h1>

          <motion.p 
            variants={item}
            className="font-body text-xs md:text-base text-zinc-400 max-w-lg mb-12 leading-relaxed tracking-wide uppercase px-4"
          >
            A excelência que você conhece. <br />
            Agora em um espaço exclusivo, projetado para o homem moderno que não abre mão do clássico.
          </motion.p>

          <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto px-6 sm:px-0">
            <a href="#agendamento" className="bw-button w-full sm:w-auto text-center">
              Reservar Horário
            </a>
            <a href="#servicos" className="bw-button-outline w-full sm:w-auto text-center">
              Ver Catálogo
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative vertical lines */}
      <div className="absolute left-8 bottom-0 w-[1px] h-48 bg-gradient-to-t from-white/20 to-transparent hidden lg:block" />
      <div className="absolute right-8 bottom-0 w-[1px] h-48 bg-gradient-to-t from-white/20 to-transparent hidden lg:block" />
      
      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
      >
        <span className="text-[8px] font-bold uppercase tracking-[0.4em] text-zinc-600">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-zinc-800 to-transparent" />
      </motion.div>
    </section>
  );
}
