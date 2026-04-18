"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

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
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/80 backdrop-blur-md border-b border-border py-4" : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="font-display text-2xl font-bold tracking-tighter text-white">
          IdalgoCortes
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-xs font-bold uppercase tracking-[0.2em] text-muted hover:text-white transition-colors"
            >
              {link.name}
            </a>
          ))}
          <a
            href="#agendamento"
            className="px-6 py-2 border border-accent text-accent text-xs font-bold uppercase tracking-[0.2em] hover:bg-accent hover:text-black transition-all rounded-sm"
          >
            Agendar Agora
          </a>
        </div>

        {/* Mobile Menu Toggle (Simplified) */}
        <button className="md:hidden text-white font-display text-sm uppercase tracking-widest">
          Menu
        </button>
      </div>
    </motion.nav>
  );
}
