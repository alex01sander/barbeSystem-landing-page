"use client";

import { Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-20 px-6 bg-background border-t border-border/50">
      <div className="max-w-7xl mx-auto flex flex-col items-center space-y-8">
        <h2 className="font-display text-2xl font-bold tracking-tighter text-white">IdalgoCortes</h2>
        
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted text-center max-w-sm">
          A excelência que você conhece em um ambiente exclusivo para o seu estilo.
        </p>

        <div className="flex items-center gap-6">
           <a 
             href="https://instagram.com/idalgocortes" 
             target="_blank"
             className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:border-accent hover:text-accent transition-all"
           >
             <Instagram className="w-4 h-4" />
           </a>
        </div>

        <div className="pt-8 w-full border-t border-zinc-900 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-medium text-zinc-600 uppercase tracking-widest">
            © 2025 IdalgoCortes. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-6 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
            <a href="#" className="hover:text-white transition-colors">Privacidade</a>
            <a href="#" className="hover:text-white transition-colors">Termos</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
