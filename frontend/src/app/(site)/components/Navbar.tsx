"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Serviços", href: "#servicos" },
    { name: "Equipe", href: "#equipe" },
    { name: "Agendamento", href: "#agendamento" },
    { name: "Contato", href: "#contato" },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled || isMobileMenuOpen ? "bg-black/90 backdrop-blur-xl border-b border-white/5 py-4" : "bg-transparent py-8"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8 flex items-center justify-between">
          <Link href="/" className="font-display text-xl md:text-2xl font-bold tracking-[-0.05em] text-white">
            IDALGO<span className="font-light text-zinc-500 italic">CORTES</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-12">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500 hover:text-white transition-all duration-300 relative group"
              >
                {link.name}
                <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
            <a
              href="#agendamento"
              className="text-[10px] font-bold uppercase tracking-[0.3em] px-6 py-2 border border-white/20 hover:border-white hover:bg-white hover:text-black transition-all duration-500"
            >
              Agendar
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white p-2"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-black pt-32 px-8 md:hidden"
          >
            <div className="flex flex-col gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-2xl font-display font-black uppercase tracking-tighter text-zinc-500 hover:text-white transition-all"
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-8 border-t border-white/5">
                <a
                  href="#agendamento"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="bw-button w-full flex items-center justify-center text-center"
                >
                  Agendar Agora
                </a>
              </div>
            </div>
            
            <div className="absolute bottom-12 left-8 right-8">
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-800 text-center italic">
                IDALGOCORTES — EXCELÊNCIA REDEFINIDA
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
