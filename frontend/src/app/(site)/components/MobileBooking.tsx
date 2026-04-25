"use client";

import { motion } from "framer-motion";
import { Smartphone, Zap, Share2, QrCode } from "lucide-react";

export function MobileBooking() {
  return (
    <section className="relative py-40 px-8 bg-black overflow-hidden border-t border-white/5">
      {/* Background Pattern - Subtle Crosses */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
           style={{ backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          {/* Left Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-12"
          >
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-zinc-600">Agendamento Mobile</span>
              <h2 className="font-display text-5xl md:text-7xl font-black mt-6 uppercase tracking-tighter">
                ESCANEIE E <br />
                <span className="text-stroke">AGENDE</span>
              </h2>
              <p className="font-body text-zinc-500 mt-8 max-w-lg uppercase text-[10px] tracking-[0.2em] leading-relaxed">
                Use seu celular para escanear o QR Code e agendar seu horário de qualquer lugar. Compartilhe com seus amigos e facilite o agendamento!
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 bg-zinc-950 border border-white/5 flex items-center gap-4 group hover:border-white/20 transition-colors">
                <div className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-white">100% Mobile</h4>
                  <p className="text-[8px] text-zinc-600 uppercase mt-1 tracking-widest">Otimizado para celular</p>
                </div>
              </div>

              <div className="p-6 bg-zinc-950 border border-white/5 flex items-center gap-4 group hover:border-white/20 transition-colors">
                <div className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-white">Fácil Acesso</h4>
                  <p className="text-[8px] text-zinc-600 uppercase mt-1 tracking-widest">Escaneie e pronto</p>
                </div>
              </div>
            </div>

            <a 
              href="https://barbe-system-landing-page.vercel.app/agendamentos"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 px-8 py-4 border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all duration-500 group"
            >
              <Share2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
              Compartilhar Link
            </a>
          </motion.div>

          {/* Right Content - QR Code Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative p-12 md:p-16 bg-zinc-950 border border-white/5 shadow-2xl group">
              {/* Decorative Corners */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-zinc-800 group-hover:border-white transition-colors duration-500" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-zinc-800 group-hover:border-white transition-colors duration-500" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-zinc-800 group-hover:border-white transition-colors duration-500" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-zinc-800 group-hover:border-white transition-colors duration-500" />

              <div className="text-center space-y-8">
                <div>
                  <h3 className="font-display text-2xl font-black uppercase tracking-tighter text-white italic">
                    IDALGO<span className="text-zinc-800 text-stroke">CORTES</span>
                  </h3>
                  <p className="text-[8px] font-bold uppercase tracking-[0.4em] text-zinc-600 mt-2">Aponte a câmera e agende</p>
                </div>

                {/* QR Code Placeholder */}
                <div className="relative p-4 bg-white rounded-xl shadow-inner">
                  <img 
                    src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://barbe-system-landing-page.vercel.app/agendamentos&color=000000" 
                    alt="QR Code Agendamento"
                    className="w-[200px] h-[200px] md:w-[250px] md:h-[250px] grayscale"
                  />
                  <div className="absolute inset-0 border-[12px] border-white pointer-events-none" />
                </div>

                <div className="space-y-2">
                  <p className="text-[8px] font-bold uppercase tracking-[0.4em] text-zinc-700">ou acesse direto:</p>
                  <a 
                    href="https://barbe-system-landing-page.vercel.app/agendamentos"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-black uppercase tracking-[0.3em] text-white hover:text-zinc-400 cursor-pointer transition-colors italic block"
                  >
                    .../agendamentos
                  </a>
                </div>
              </div>
            </div>

            {/* Floating Decorative Elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/5 blur-[100px] rounded-full pointer-events-none" />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
