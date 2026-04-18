"use client";

import { useQuery } from "@tanstack/react-query";
import { getBarbers } from "@/services/api";
import { motion } from "framer-motion";

export function Team() {
  const { data: barbers, isLoading } = useQuery({
    queryKey: ["public-barbers"],
    queryFn: getBarbers,
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
    <section id="equipe" className="py-32 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">Mestre das Lâminas</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-4">Nossa Equipe</h2>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="aspect-[3/4] bg-secondary animate-pulse rounded-sm" />
            ))}
          </div>
        ) : (
          <motion.div 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12"
          >
            {barbers?.map((barber) => (
              <motion.div
                key={barber.id}
                variants={item}
                className="group"
              >
                <div className="relative aspect-[3/4] bg-secondary overflow-hidden border border-border transition-all group-hover:border-accent/40 mb-6">
                  {barber.photo ? (
                    <img 
                      src={barber.photo} 
                      alt={barber.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl font-display text-zinc-800">
                      {barber.name.charAt(0)}
                    </div>
                  )}
                  {/* Subtle overlay */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                
                <h3 className="font-display text-xl font-bold">{barber.name}</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted mt-1">
                  Profissional {barber.role === 'ADMIN' ? 'Sênior' : 'Especialista'}
                </p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
