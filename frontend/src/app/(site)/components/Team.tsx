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
    <section id="equipe" className="py-40 px-8 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="mb-32">
          <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-zinc-500">Master Barbers</span>
          <h2 className="font-display text-5xl md:text-8xl font-black mt-6 uppercase tracking-tighter">
            NOSSA <br />
            <span className="text-stroke">EQUIPE</span>
          </h2>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="aspect-[3/4] bg-zinc-950 animate-pulse border border-white/5" />
            ))}
          </div>
        ) : (
          <motion.div 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12"
          >
            {barbers?.map((barber) => (
              <motion.div
                key={barber.id}
                variants={item}
                className="group relative"
              >
                <div className="relative aspect-[3/4] overflow-hidden border border-white/5 bg-zinc-950">
                  {barber.photo ? (
                    <img 
                      src={barber.photo} 
                      alt={barber.name} 
                      className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                       <span className="font-display text-8xl font-black text-zinc-900 group-hover:text-zinc-800 transition-colors uppercase">
                        {barber.name.charAt(0)}
                       </span>
                    </div>
                  )}
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                  
                  {/* Info inside image */}
                  <div className="absolute bottom-8 left-8 right-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="font-display text-2xl font-black uppercase tracking-tighter text-white">{barber.name}</h3>
                    <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-zinc-400 mt-2">
                      {barber.role === 'ADMIN' ? 'Mestre Barbeiro' : 'Especialista'}
                    </p>
                  </div>
                </div>

                {/* Vertical accent line on hover */}
                <div className="absolute -left-2 top-10 bottom-10 w-[1px] bg-white scale-y-0 group-hover:scale-y-100 transition-transform duration-700 origin-bottom" />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
