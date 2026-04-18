"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";

export function Gallery() {
  const images = [1, 2, 3, 4, 5, 6];

  return (
    <section id="galeria" className="py-32 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20 text-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">Estilo Editorial</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-4">Nosso Trabalho</h2>
        </div>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
          {images.map((id) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: id * 0.1 }}
              className="relative group cursor-pointer overflow-hidden bg-secondary border border-border aspect-[4/5]"
            >
              <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-800">
                Foto de Corte
              </div>
              
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Search className="w-8 h-8 text-accent scale-50 group-hover:scale-100 transition-transform duration-300" />
              </div>

              {/* Decorative corners */}
              <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-accent opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 -translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0" />
              <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-accent opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
