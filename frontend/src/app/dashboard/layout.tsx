"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { 
  BarChart3, 
  Users, 
  Scissors, 
  Calendar, 
  LogOut,
  DollarSign,
  UserCog
} from "lucide-react";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedUser = localStorage.getItem("barber-user");
    const token = localStorage.getItem("barber-token");

    if (!token || !storedUser) {
      router.push("/login");
      return;
    }

    setUser(JSON.parse(storedUser));
  }, [router]);

  function handleLogout() {
    localStorage.removeItem("barber-token");
    localStorage.removeItem("barber-user");
    router.push("/login");
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background flex text-foreground">
      {/* Sidebar */}
      <aside className="w-64 glass border-r border-white/10 hidden md:flex flex-col fixed inset-y-0 z-50">
        <div className="p-8">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-8 h-8 gold-gradient rounded-full flex items-center justify-center">
              <Scissors className="text-black w-4 h-4" />
            </div>
            <span className="font-bold text-lg text-gold tracking-tight">BarberSystem</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <NavItem 
            href="/dashboard" 
            icon={<BarChart3 />} 
            label="Home" 
            active={pathname === "/dashboard"} 
          />
          <NavItem 
            href="/dashboard/appointments" 
            icon={<Calendar />} 
            label="Agenda" 
            active={pathname === "/dashboard/appointments"} 
          />
          <NavItem 
            href="/dashboard/clients" 
            icon={<Users />} 
            label="Clientes" 
            active={pathname === "/dashboard/clients"} 
          />
          <NavItem 
            href="/dashboard/services" 
            icon={<Scissors />} 
            label="Serviços" 
            active={pathname === "/dashboard/services"} 
          />
          <NavItem 
            href="/dashboard/team" 
            icon={<UserCog />} 
            label="Equipe" 
            active={pathname === "/dashboard/team"} 
          />
          <NavItem 
            href="/dashboard/financial" 
            icon={<DollarSign />} 
            label="Financeiro" 
            active={pathname === "/dashboard/financial"} 
          />
        </nav>

        <div className="p-4 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-muted hover:text-white transition-colors rounded-xl"
          >
            <LogOut className="w-5 h-5" />
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 md:pl-64 flex flex-col min-h-screen">
        <header className="h-20 glass flex items-center justify-between px-8 sticky top-0 z-40 border-b border-white/5">
          <h2 className="text-xl font-semibold">
            {pathname === "/dashboard" ? "Dashboard" : 
             pathname.includes("appointments") ? "Agenda" : 
             pathname.includes("clients") ? "Clientes" : 
             pathname.includes("team") ? "Equipe" : "Gestão"}
          </h2>
          <div className="flex items-center gap-4">
             <div className="text-right hidden sm:block">
                <p className="text-sm font-bold">{user.name}</p>
                <p className="text-xs text-muted capitalize">{user.role.toLowerCase()}</p>
             </div>
            <div className="w-10 h-10 rounded-full bg-secondary border border-white/10 flex items-center justify-center font-bold text-primary">
              {user.name.charAt(0)}
            </div>
          </div>
        </header>

        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}

function NavItem({ href, icon, label, active = false }: { href: string, icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <Link href={href} className={`
      flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer group
      ${active ? 'bg-primary text-black font-bold shadow-lg shadow-primary/20' : 'text-muted hover:text-white hover:bg-white/5'}
    `}>
      <span className={active ? 'text-black' : 'text-muted group-hover:text-primary transition-colors'}>
        {icon}
      </span>
      {label}
    </Link>
  );
}
