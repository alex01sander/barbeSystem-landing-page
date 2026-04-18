"use client";

import { Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-32 px-8 bg-black border-t border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col items-center space-y-12">
        <h2 className="font-display text-4xl font-black tracking-tighter text-white uppercase italic">
          IDALGO<span className="text-zinc-800 text-stroke">CORTES</span>
        </h2>
        
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-600 text-center max-w-md leading-relaxed">
          A excelência que você conhece em um ambiente exclusivo projetado para o seu estilo.
        </p>

        <div className="flex items-center gap-8">
           <a 
             href="https://instagram.com/idalgocortes" 
             target="_blank"
             className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center hover:border-white hover:bg-white hover:text-black transition-all duration-500"
           >
             <Instagram className="w-5 h-5" />
           </a>
        </div>

        <div className="pt-20 w-full border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[8px] font-black text-zinc-700 uppercase tracking-[0.4em]">
            © 2026 IdalgoCortes. All Rights Reserved.
          </p>
          <div className="flex items-center gap-10 text-[8px] font-black text-zinc-700 uppercase tracking-[0.4em]">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
