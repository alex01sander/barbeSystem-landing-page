"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Instagram, Clock } from "lucide-react";

export function Contact() {
  return (
    <section id="contato" className="py-32 px-6 bg-secondary/10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-stretch">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">Visite-nos</span>
              <h2 className="font-display text-4xl md:text-5xl font-bold mt-4">Onde nos encontrar</h2>
            </div>

            <div className="space-y-8">
              <ContactItem 
                icon={<MapPin className="w-5 h-5 text-accent" />}
                title="Endereço"
                content="Em breve — Aguardando inauguração oficial"
              />
              <ContactItem 
                icon={<Phone className="w-5 h-5 text-accent" />}
                title="WhatsApp"
                content="Em breve"
              />
              <ContactItem 
                icon={<Clock className="w-5 h-5 text-accent" />}
                title="Horário"
                content="Segunda a Sábado, 08h às 20h"
              />
              <ContactItem 
                link="https://instagram.com/idalgocortes"
                icon={<Instagram className="w-5 h-5 text-accent" />}
                title="Instagram"
                content="@idalgocortes"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="h-full min-h-[400px] bg-secondary border border-border overflow-hidden rounded-sm grayscale"
          >
             {/* Map Placeholder */}
             <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
                <MapPin className="w-12 h-12 text-zinc-800" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">Mapa em breve</span>
             </div>
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
      className={`flex items-start gap-6 group ${link ? 'cursor-pointer' : ''}`}
    >
      <div className="w-12 h-12 rounded-full bg-secondary border border-border flex items-center justify-center transition-all group-hover:border-accent group-hover:bg-accent/5">
        {icon}
      </div>
      <div>
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted group-hover:text-accent transition-colors">{title}</h4>
        <p className="font-body text-zinc-300 mt-1">{content}</p>
      </div>
    </Wrapper>
  );
}
