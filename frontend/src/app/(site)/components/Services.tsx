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
    <section id="servicos" className="py-32 px-6 bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20 text-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">Nossas Especialidades</span>
          <h2 className="font-display text-4xl md:text-6xl font-bold mt-4">Serviços</h2>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-secondary/50 animate-pulse border border-border rounded-sm" />
            ))}
          </div>
        ) : (
          <motion.div 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {services?.map((service) => (
              <motion.div
                key={service.id}
                variants={item}
                className="bg-secondary p-10 border border-border group hover:border-accent/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-display text-2xl font-bold mb-4 group-hover:text-accent transition-colors">{service.name}</h3>
                  <p className="font-body text-sm text-muted leading-relaxed line-clamp-3 mb-8">
                    {service.description || "Técnica refinada e acabamento impecável para o seu estilo único."}
                  </p>
                </div>
                
                <div className="pt-8 border-t border-zinc-800 flex items-center justify-between">
                  <span className="text-xl font-bold font-display text-accent">R$ {Number(service.price).toFixed(0)}</span>
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted">
                    <Clock className="w-3.5 h-3.5" />
                    {service.durationMinutes} min
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
