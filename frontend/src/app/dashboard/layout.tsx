"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BarChart3, 
  Users, 
  Scissors, 
  Calendar, 
  LogOut,
  DollarSign,
  UserCog,
  Store,
  ShoppingBag,
  Menu,
  X
} from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

import { User } from "@supabase/supabase-js";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // Fallback para o localStorage que o login antigo usava, ou redireciona
        const storedUser = localStorage.getItem("barber-user");
        if (!storedUser) {
          router.push("/login");
          return;
        }
        setUser(JSON.parse(storedUser));
      } else {
        setUser(session.user);
        // Sincroniza o localStorage para compatibilidade se necessário
        localStorage.setItem("barber-user", JSON.stringify(session.user));
      }
    }

    checkSession();
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    localStorage.removeItem("barber-token");
    localStorage.removeItem("barber-user");
    router.push("/login");
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background flex text-foreground font-sans overflow-x-hidden">
      {/* Mobile Menu Overlay & Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden"
            />
            
            {/* Mobile Sidebar */}
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[280px] bg-background border-r border-border z-[70] md:hidden flex flex-col"
            >
              <div className="h-20 flex items-center justify-between px-8 border-b border-border">
                <Link href="/dashboard" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
                    <Scissors className="text-black w-3.5 h-3.5" />
                  </div>
                  <span className="font-bold text-lg tracking-tight uppercase">Barber<span className="text-muted font-light">Sys</span></span>
                </Link>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-muted">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                <NavItem 
                  href="/dashboard" 
                  icon={<BarChart3 className="w-4 h-4" />} 
                  label="Dashboard" 
                  active={pathname === "/dashboard"} 
                  onClick={() => setIsMobileMenuOpen(false)}
                />
                <NavItem 
                  href="/dashboard/appointments" 
                  icon={<Calendar className="w-4 h-4" />} 
                  label="Agenda" 
                  active={pathname === "/dashboard/appointments"} 
                  onClick={() => setIsMobileMenuOpen(false)}
                />
                <div className="pt-4 pb-2 px-4 text-[10px] font-bold text-muted uppercase tracking-widest">Gestão</div>
                <NavItem 
                  href="/dashboard/clients" 
                  icon={<Users className="w-4 h-4" />} 
                  label="Clientes" 
                  active={pathname === "/dashboard/clients"} 
                  onClick={() => setIsMobileMenuOpen(false)}
                />
                <NavItem 
                  href="/dashboard/services" 
                  icon={<Scissors className="w-4 h-4" />} 
                  label="Serviços" 
                  active={pathname === "/dashboard/services"} 
                  onClick={() => setIsMobileMenuOpen(false)}
                />
                <NavItem 
                  href="/dashboard/team" 
                  icon={<UserCog className="w-4 h-4" />} 
                  label="Equipe" 
                  active={pathname === "/dashboard/team"} 
                  onClick={() => setIsMobileMenuOpen(false)}
                />
                <div className="pt-4 pb-2 px-4 text-[10px] font-bold text-muted uppercase tracking-widest">Vendas</div>
                <NavItem 
                  href="/dashboard/pdv" 
                  icon={<ShoppingBag className="w-4 h-4" />} 
                  label="Ponto de Venda" 
                  active={pathname === "/dashboard/pdv"} 
                  onClick={() => setIsMobileMenuOpen(false)}
                />
                <NavItem 
                  href="/dashboard/products" 
                  icon={<Store className="w-4 h-4" />} 
                  label="Estoque" 
                  active={pathname === "/dashboard/products"} 
                  onClick={() => setIsMobileMenuOpen(false)}
                />
                <NavItem 
                  href="/dashboard/financial" 
                  icon={<DollarSign className="w-4 h-4" />} 
                  label="Financeiro" 
                  active={pathname === "/dashboard/financial"} 
                  onClick={() => setIsMobileMenuOpen(false)}
                />
              </nav>

              <div className="p-4 border-t border-border bg-secondary/30">
                <div className="flex items-center gap-3 px-4 py-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-muted border border-border">
                     {(user.user_metadata?.name || user.name || user.email || "U").charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                     <p className="text-xs font-bold truncate">{user.user_metadata?.name || user.name || user.email}</p>
                     <p className="text-[10px] text-muted capitalize">{(user.user_metadata?.role || user.role || "Membro").toLowerCase()}</p>
                  </div>
                </div>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-muted hover:text-red-400 transition-colors text-sm rounded-lg"
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Sidebar Desktop */}
      <aside className="w-64 bg-background border-r border-border hidden md:flex flex-col fixed inset-y-0 z-50">
        <div className="h-20 flex items-center px-8">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
              <Scissors className="text-black w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-lg tracking-tight uppercase">Barber<span className="text-muted font-light">Sys</span></span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          <NavItem 
            href="/dashboard" 
            icon={<BarChart3 className="w-4 h-4" />} 
            label="Dashboard" 
            active={pathname === "/dashboard"} 
          />
          <NavItem 
            href="/dashboard/appointments" 
            icon={<Calendar className="w-4 h-4" />} 
            label="Agenda" 
            active={pathname === "/dashboard/appointments"} 
          />
          <div className="pt-4 pb-2 px-4 text-[10px] font-bold text-muted uppercase tracking-widest">Gestão</div>
          <NavItem 
            href="/dashboard/clients" 
            icon={<Users className="w-4 h-4" />} 
            label="Clientes" 
            active={pathname === "/dashboard/clients"} 
          />
          <NavItem 
            href="/dashboard/services" 
            icon={<Scissors className="w-4 h-4" />} 
            label="Serviços" 
            active={pathname === "/dashboard/services"} 
          />
          <NavItem 
            href="/dashboard/team" 
            icon={<UserCog className="w-4 h-4" />} 
            label="Equipe" 
            active={pathname === "/dashboard/team"} 
          />
          <div className="pt-4 pb-2 px-4 text-[10px] font-bold text-muted uppercase tracking-widest">Vendas</div>
          <NavItem 
            href="/dashboard/pdv" 
            icon={<ShoppingBag className="w-4 h-4" />} 
            label="Ponto de Venda" 
            active={pathname === "/dashboard/pdv"} 
          />
          <NavItem 
            href="/dashboard/products" 
            icon={<Store className="w-4 h-4" />} 
            label="Estoque" 
            active={pathname === "/dashboard/products"} 
          />
          <NavItem 
            href="/dashboard/financial" 
            icon={<DollarSign className="w-4 h-4" />} 
            label="Financeiro" 
            active={pathname === "/dashboard/financial"} 
          />
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-muted border border-border">
               {(user.user_metadata?.name || user.name || user.email || "U").charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
               <p className="text-xs font-bold truncate">{user.user_metadata?.name || user.name || user.email}</p>
               <p className="text-[10px] text-muted capitalize">{(user.user_metadata?.role || user.role || "Membro").toLowerCase()}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-muted hover:text-red-400 transition-colors text-sm rounded-lg"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 md:pl-64 flex flex-col min-h-screen">
        <header className="h-20 border-b border-border flex items-center justify-between px-8 sticky top-0 z-40 bg-background/80 backdrop-blur-md">
          <h2 className="text-sm font-medium text-muted uppercase tracking-widest">
            {pathname === "/dashboard" ? "Resumo Geral" : 
             pathname.includes("appointments") ? "Agenda de Horários" : 
             pathname.includes("clients") ? "Base de Clientes" : 
             pathname.includes("products") ? "Gestão de Estoque" : 
             pathname.includes("pdv") ? "Balcão / PDV" : 
             pathname.includes("team") ? "Equipe Profissional" : "Gestão"}
          </h2>
          
          <button className="md:hidden p-2 text-muted hover:text-white transition-colors" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>

          <div className="hidden md:flex items-center gap-4">
             <div className="h-8 w-[1px] bg-border mx-2" />
             <div className="flex items-center gap-2 text-xs font-medium text-muted">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Sistema Online
             </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}

function NavItem({ 
  href, 
  icon, 
  label, 
  active = false, 
  onClick 
}: { 
  href: string, 
  icon: React.ReactNode, 
  label: string, 
  active?: boolean,
  onClick?: () => void
}) {
  return (
    <Link 
      href={href} 
      onClick={onClick}
      className={`
        flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm font-medium
        ${active ? 'bg-secondary text-white border border-border shadow-sm' : 'text-muted hover:text-white hover:bg-secondary/50'}
      `}
    >
      <span className={active ? 'text-white' : 'text-muted group-hover:text-white transition-colors'}>
        {icon}
      </span>
      {label}
    </Link>
  );
}
