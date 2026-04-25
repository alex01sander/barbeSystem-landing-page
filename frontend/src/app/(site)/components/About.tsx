"use client";

import { motion } from "framer-motion";

export function About() {
  return (
    <section id="sobre" className="relative py-24 md:py-40 px-6 md:px-8 bg-black overflow-hidden">
      {/* Barbershop pattern background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='1'%3E%3C!-- Scissors --%3E%3Cg transform='translate(15,15) rotate(45)'%3E%3Ccircle cx='-8' cy='0' r='5'/%3E%3Ccircle cx='8' cy='0' r='5'/%3E%3Cline x1='-3' y1='0' x2='30' y2='0'/%3E%3Cline x1='-3' y1='0' x2='30' y2='4'/%3E%3C/g%3E%3C!-- Razor --%3E%3Cg transform='translate(70,60)'%3E%3Crect x='-15' y='-4' width='30' height='8' rx='2'/%3E%3Crect x='15' y='-6' width='8' height='12' rx='1'/%3E%3C/g%3E%3C!-- Comb --%3E%3Cg transform='translate(20,80)'%3E%3Crect x='0' y='0' width='40' height='6' rx='2'/%3E%3Cline x1='5' y1='6' x2='5' y2='14'/%3E%3Cline x1='10' y1='6' x2='10' y2='14'/%3E%3Cline x1='15' y1='6' x2='15' y2='14'/%3E%3Cline x1='20' y1='6' x2='20' y2='14'/%3E%3Cline x1='25' y1='6' x2='25' y2='14'/%3E%3Cline x1='30' y1='6' x2='30' y2='14'/%3E%3Cline x1='35' y1='6' x2='35' y2='14'/%3E%3C/g%3E%3C!-- Barber pole dots --%3E%3Ccircle cx='95' cy='20' r='2'/%3E%3Ccircle cx='105' cy='30' r='2'/%3E%3Ccircle cx='95' cy='40' r='2'/%3E%3C/g%3E%3C/svg%3E")`,
        backgroundSize: '120px 120px'
      }} />
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
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
          transition={{ duration: 1.2, ease: "easeOut" }}
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
