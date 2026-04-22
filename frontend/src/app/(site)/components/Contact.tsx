"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Instagram, Clock } from "lucide-react";

export function Contact() {
  return (
    <section id="contato" className="py-24 md:py-40 px-6 md:px-8 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-12 md:space-y-16"
          >
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] md:tracking-[0.5em] text-zinc-500">Contact & Location</span>
              <h2 className="font-display text-4xl md:text-8xl font-black mt-6 uppercase tracking-tighter">
                ONDE <br />
                <span className="text-stroke">ESTAMOS</span>
              </h2>
            </div>

            <div className="space-y-8 md:space-y-12">
              <ContactItem 
                icon={<MapPin className="w-4 h-4 md:w-5 md:h-5 text-white" />}
                title="Localização"
                content="Em breve — Aguardando inauguração"
              />
              <ContactItem 
                icon={<Phone className="w-4 h-4 md:w-5 md:h-5 text-white" />}
                title="WhatsApp Direct"
                content="Conecte-se conosco"
                link="https://wa.me/yourphone"
              />
              <ContactItem 
                icon={<Clock className="w-4 h-4 md:w-5 md:h-5 text-white" />}
                title="Disponibilidade"
                content="SEG - SAB | 08:00 - 20:00"
              />
              <ContactItem 
                link="https://instagram.com/idalgocortes"
                icon={<Instagram className="w-4 h-4 md:w-5 md:h-5 text-white" />}
                title="Instagram Social"
                content="@idalgocortes"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative h-[350px] md:h-[500px] lg:h-[600px] bg-zinc-950 border border-white/5 overflow-hidden group"
          >
             {/* Map Placeholder with stylization */}
             <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=2066')] bg-cover bg-center grayscale opacity-20 group-hover:opacity-30 transition-opacity duration-1000" />
             <div className="relative w-full h-full flex flex-col items-center justify-center space-y-6">
                <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center animate-pulse">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">Mapa Interativo Indisponível</span>
             </div>
             
             {/* Corner Accents */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/5 to-transparent" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ContactItem({ icon, title, content, link }: any) {
  const Wrapper = link ? "a" : "div";
  return (
    <Wrapper 
      href={link} 
      target={link ? "_blank" : undefined}
      className={`flex items-center gap-6 md:gap-8 group ${link ? 'cursor-pointer' : ''}`}
    >
      <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-white/5 flex-shrink-0 flex items-center justify-center transition-all duration-500 group-hover:border-white group-hover:bg-white group-hover:text-black">
        {icon}
      </div>
      <div>
        <h4 className="text-[7px] md:text-[8px] font-black uppercase tracking-[0.3em] text-zinc-600 group-hover:text-white transition-colors mb-1">{title}</h4>
        <p className="font-display text-lg md:text-xl font-black uppercase tracking-tight text-white">{content}</p>
      </div>
    </Wrapper>
  );
}
