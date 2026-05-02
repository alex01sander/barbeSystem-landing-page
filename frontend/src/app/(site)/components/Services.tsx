"use client";

import { getServices } from "@/services/api";
import { useCachedQuery } from "@/hooks/useCachedQuery";
import { motion, Variants } from "framer-motion";
import { Clock } from "lucide-react";

export function Services() {
  const { data: services } = useCachedQuery("public-services", getServices);

  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section
      id="servicos"
      className="relative py-24 md:py-40 px-6 md:px-8 bg-black border-y border-white/5 overflow-hidden"
    >
      {/* Barbershop Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2074')] bg-cover bg-fixed bg-center grayscale opacity-10 mix-blend-luminosity" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='1'%3E%3Cg transform='translate(15,15) rotate(45)'%3E%3Ccircle cx='-8' cy='0' r='5'/%3E%3Ccircle cx='8' cy='0' r='5'/%3E%3Cline x1='-3' y1='0' x2='30' y2='0'/%3E%3Cline x1='-3' y1='0' x2='30' y2='4'/%3E%3C/g%3E%3Cg transform='translate(70,60)'%3E%3Crect x='-15' y='-4' width='30' height='8' rx='2'/%3E%3Crect x='15' y='-6' width='8' height='12' rx='1'/%3E%3C/g%3E%3Cg transform='translate(20,80)'%3E%3Crect x='0' y='0' width='40' height='6' rx='2'/%3E%3Cline x1='5' y1='6' x2='5' y2='14'/%3E%3Cline x1='10' y1='6' x2='10' y2='14'/%3E%3Cline x1='15' y1='6' x2='15' y2='14'/%3E%3Cline x1='20' y1='6' x2='20' y2='14'/%3E%3Cline x1='25' y1='6' x2='25' y2='14'/%3E%3Cline x1='30' y1='6' x2='30' y2='14'/%3E%3Cline x1='35' y1='6' x2='35' y2='14'/%3E%3C/g%3E%3Ccircle cx='95' cy='20' r='2'/%3E%3Ccircle cx='105' cy='30' r='2'/%3E%3Ccircle cx='95' cy='40' r='2'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: "120px 120px",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-16 md:mb-32 text-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] md:tracking-[0.5em] text-zinc-500">
            The Menu
          </span>
          <h2 className="font-display text-4xl md:text-8xl font-black mt-6 uppercase tracking-tighter">
            SERVIÇOS <br />
            <span className="text-stroke">& ESPECIALIDADES</span>
          </h2>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5 border border-white/5"
        >
          {services?.map((service) => (
            <motion.div
              key={service.id}
              variants={item}
              className="bg-black p-8 md:p-12 group hover:bg-zinc-900/50 transition-all duration-700 flex flex-col justify-between aspect-auto md:aspect-[4/5] min-h-[350px]"
            >
              <div>
                <div className="flex justify-between items-start mb-8 md:mb-12">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600 group-hover:text-white transition-colors">
                    0{services.indexOf(service) + 1}
                  </span>
                  <Clock className="w-4 h-4 text-zinc-800 group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-display text-2xl md:text-3xl font-black mb-4 md:mb-6 uppercase tracking-tighter group-hover:translate-x-2 transition-transform duration-500">
                  {service.name}
                </h3>
                <p className="font-body text-[10px] md:text-xs text-zinc-500 leading-relaxed uppercase tracking-widest mb-8">
                  {service.description ||
                    "Técnica refinada e acabamento impecável para o seu estilo único."}
                </p>
              </div>

              <div className="pt-8 md:pt-12 border-t border-white/5 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-zinc-600 mb-1">
                    Investimento
                  </span>
                  <span className="text-xl md:text-2xl font-black font-display text-white italic">
                    R$ {Number(service.price).toFixed(0)}
                  </span>
                </div>
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                  {service.durationMinutes} MIN
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
