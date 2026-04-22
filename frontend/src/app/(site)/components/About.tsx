"use client";

import { motion } from "framer-motion";

export function About() {
  return (
    <section id="sobre" className="py-24 md:py-40 px-6 md:px-8 bg-black">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-8 md:space-y-12"
        >
          <div className="space-y-4 md:space-y-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] md:tracking-[0.5em] text-zinc-500">The Legacy</span>
            <h2 className="font-display text-4xl md:text-7xl font-black leading-tight uppercase tracking-tighter">
              A ARTE DA <br />
              <span className="text-stroke">TRADIÇÃO</span>
            </h2>
          </div>
          
          <div className="font-body text-zinc-500 leading-relaxed text-sm md:text-lg space-y-6 md:space-y-8 max-w-xl uppercase tracking-wider">
            <p>
              IdalgoCortes não é apenas uma barbearia. É a manifestação de décadas de domínio sobre a lâmina e a tesoura. 
            </p>
            <p className="text-white border-l border-white/20 pl-8 italic">
              "A perfeição não é um objetivo, é o nosso padrão mínimo de entrega."
            </p>
            <p>
              Cada corte é uma assinatura. Cada cliente, uma tela. Bem-vindo ao novo padrão de excelência em cuidados masculinos.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative aspect-[4/5] bg-zinc-900 border border-white/5 overflow-hidden group"
        >
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1593702295094-ada74bc4a39d?q=80&w=2070')] bg-cover bg-center grayscale transition-transform duration-1000 group-hover:scale-110" />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
          
          {/* Decorative frame elements */}
          <div className="absolute top-10 left-10 right-10 bottom-10 border border-white/10 pointer-events-none" />
          <div className="absolute bottom-14 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-[0.6em] text-white/40">
            Est. 2026
          </div>
        </motion.div>
      </div>
    </section>
  );
}
