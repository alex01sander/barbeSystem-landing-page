"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";

export function Gallery() {
  const images = [
   "https://i.postimg.cc/NGZrg2R2/cortes01.png",
   "https://i.postimg.cc/QdJBk6ww/cortes02.png",
   "https://i.postimg.cc/g0Mn1xYk/cortes03.png",
   "https://i.postimg.cc/50TjNDQ2/cortes04.png",
   "https://i.postimg.cc/Cx71fRn8/cortes5.png",
   "https://i.postimg.cc/DzzzQ7qT/cortes06.png"

  ];

  return (
    <section id="galeria" className="py-24 md:py-40 px-6 md:px-8 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 md:mb-32 text-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] md:tracking-[0.5em] text-zinc-500">Visual Portfolio</span>
          <h2 className="font-display text-4xl md:text-8xl font-black mt-6 uppercase tracking-tighter">
            cortes<br />
            <span className="text-stroke">& Artes</span>
          </h2>
        </div>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-1 space-y-1">
          {images.map((url, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.8 }}
              className="relative group cursor-pointer overflow-hidden bg-zinc-950 border border-white/5 aspect-[3/4]"
            >
              <img 
                src={url} 
                alt={`Corte Editorial ${idx + 1}`}
                className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-110"
              />
              
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-[2px]">
                <div className="flex flex-col items-center gap-4">
                  <Search className="w-8 h-8 text-white scale-50 group-hover:scale-100 transition-transform duration-500" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-500">Ampliar Arte</span>
                </div>
              </div>

              {/* Minimal corner details */}
              <div className="absolute top-6 left-6 w-8 h-[1px] bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
              <div className="absolute top-6 left-6 w-[1px] h-8 bg-white/20 scale-y-0 group-hover:scale-y-100 transition-transform duration-700 origin-top" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
