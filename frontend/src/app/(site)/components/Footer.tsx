"use client";

import { Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative py-20 md:py-32 px-6 md:px-8 bg-black border-t border-white/5 overflow-hidden">
      {/* Barbershop pattern background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.025]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='1'%3E%3Cg transform='translate(15,15) rotate(45)'%3E%3Ccircle cx='-8' cy='0' r='5'/%3E%3Ccircle cx='8' cy='0' r='5'/%3E%3Cline x1='-3' y1='0' x2='30' y2='0'/%3E%3Cline x1='-3' y1='0' x2='30' y2='4'/%3E%3C/g%3E%3Cg transform='translate(70,60)'%3E%3Crect x='-15' y='-4' width='30' height='8' rx='2'/%3E%3Crect x='15' y='-6' width='8' height='12' rx='1'/%3E%3C/g%3E%3Cg transform='translate(20,80)'%3E%3Crect x='0' y='0' width='40' height='6' rx='2'/%3E%3Cline x1='5' y1='6' x2='5' y2='14'/%3E%3Cline x1='10' y1='6' x2='10' y2='14'/%3E%3Cline x1='15' y1='6' x2='15' y2='14'/%3E%3Cline x1='20' y1='6' x2='20' y2='14'/%3E%3Cline x1='25' y1='6' x2='25' y2='14'/%3E%3Cline x1='30' y1='6' x2='30' y2='14'/%3E%3Cline x1='35' y1='6' x2='35' y2='14'/%3E%3C/g%3E%3Ccircle cx='95' cy='20' r='2'/%3E%3Ccircle cx='105' cy='30' r='2'/%3E%3Ccircle cx='95' cy='40' r='2'/%3E%3C/g%3E%3C/svg%3E")`,
        backgroundSize: '120px 120px'
      }} />
      <div className="max-w-7xl mx-auto flex flex-col items-center space-y-8 md:space-y-12 relative z-10">
        <h2 className="font-display text-3xl md:text-4xl font-black tracking-tighter text-white uppercase italic">
          IDALGO<span className="text-zinc-800 text-stroke">CORTES</span>
        </h2>
        
        <p className="text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.5em] text-zinc-600 text-center max-w-md leading-relaxed px-4">
          A excelência que você conhece em um ambiente exclusivo projetado para o seu estilo.
        </p>

        <div className="flex items-center gap-6 md:gap-8">
           <a 
             href="https://instagram.com/idalgocortes" 
             target="_blank"
             className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/5 flex items-center justify-center hover:border-white hover:bg-white hover:text-black transition-all duration-500"
           >
             <Instagram className="w-4 h-4 md:w-5 md:h-5" />
           </a>
        </div>

        <div className="pt-12 md:pt-20 w-full border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8">
          <p className="text-[8px] font-black text-zinc-700 uppercase tracking-[0.4em] text-center">
            © 2026 IdalgoCortes. All Rights Reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-6 md:gap-10 text-[8px] font-black text-zinc-700 uppercase tracking-[0.4em]">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
