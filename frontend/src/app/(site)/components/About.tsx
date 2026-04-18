"use client";

import { motion } from "framer-motion";

export function About() {
  return (
    <section id="sobre" className="py-32 px-6 bg-background">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">Nossa História</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight">
              Uma nova casa. <br />
              <span className="italic">A mesma excelência.</span>
            </h2>
          </div>
          
          <div className="font-body text-zinc-400 leading-relaxed text-lg space-y-6 max-w-xl">
            <p>
              IdalgoCortes nasceu da decisão de um barbeiro com anos de experiência de criar seu próprio espaço — um lugar onde cada detalhe importa, do corte ao atendimento.
            </p>
            <p>
              Em anos de estrada, aprendi que barbearia não é apenas sobre o resultado final, mas sobre a jornada. Aqui, você não é mais um cliente. Você é tratado pelo nome em um ambiente pensado para o seu conforto e estilo.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative aspect-square bg-secondary border border-border group"
        >
          <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold uppercase tracking-widest text-zinc-700">
            Foto do Barbeiro
          </div>
          {/* Decorative frame */}
          <div className="absolute -inset-4 border border-zinc-900 -z-10 transition-transform group-hover:translate-x-2 group-hover:translate-y-2" />
        </motion.div>
      </div>
    </section>
  );
}
