"use client";

import { useQuery } from "@tanstack/react-query";
import { getServices } from "@/services/api";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";

export function Services() {
  const { data: services, isLoading } = useQuery({
    queryKey: ["public-services"],
    queryFn: getServices,
  });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section id="servicos" className="relative py-40 px-8 bg-black border-y border-white/5 overflow-hidden">
      {/* Subtle Background Image */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2074')] bg-cover bg-fixed bg-center grayscale opacity-[0.03] mix-blend-luminosity" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-32 text-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-zinc-500">The Menu</span>
          <h2 className="font-display text-5xl md:text-8xl font-black mt-6 uppercase tracking-tighter">
            SERVIÇOS <br />
            <span className="text-stroke">& ESPECIALIDADES</span>
          </h2>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-[400px] bg-zinc-950 animate-pulse border border-white/5" />
            ))}
          </div>
        ) : (
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
                className="bg-black p-12 group hover:bg-zinc-900/50 transition-all duration-700 flex flex-col justify-between aspect-[4/5]"
              >
                <div>
                  <div className="flex justify-between items-start mb-12">
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600 group-hover:text-white transition-colors">
                      0{services.indexOf(service) + 1}
                    </span>
                    <Clock className="w-4 h-4 text-zinc-800 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-display text-3xl font-black mb-6 uppercase tracking-tighter group-hover:translate-x-2 transition-transform duration-500">
                    {service.name}
                  </h3>
                  <p className="font-body text-xs text-zinc-500 leading-relaxed uppercase tracking-widest mb-8">
                    {service.description || "Técnica refinada e acabamento impecável para o seu estilo único."}
                  </p>
                </div>
                
                <div className="pt-12 border-t border-white/5 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-zinc-600 mb-1">Investimento</span>
                    <span className="text-2xl font-black font-display text-white italic">R$ {Number(service.price).toFixed(0)}</span>
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                    {service.durationMinutes} MIN
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
