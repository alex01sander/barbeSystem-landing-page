"use client";

import { useQuery } from "@tanstack/react-query";
import { getFinancialSummary, getAppointments } from "@/services/api";
import { 
  DollarSign, 
  Calendar, 
  TrendingUp, 
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Clock
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function DashboardHome() {
  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
  const today = new Date().toISOString().split('T')[0];

  const { data: summary } = useQuery({
    queryKey: ["financial-summary", startOfMonth, today],
    queryFn: () => getFinancialSummary(startOfMonth, today)
  });

  const { data: appointments } = useQuery({
    queryKey: ["appointments-today", today],
    queryFn: () => getAppointments(today)
  });

  return (
    <div className="space-y-10 max-w-7xl">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Visão Geral</h1>
        <p className="text-muted text-sm mt-1">Bem-vindo ao centro de comando da sua barbearia.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Faturamento Mensal" 
          value={`R$ ${summary?.totalIncomes.toFixed(2) || "0,00"}`} 
          icon={<DollarSign className="w-4 h-4" />}
          trend="+12% que mês anterior"
          positive
        />
        <StatCard 
          title="Total de Saídas" 
          value={`R$ ${summary?.totalExpenses.toFixed(2) || "0,00"}`} 
          icon={<ArrowDownRight className="w-4 h-4" />}
          trend="-2% que mês anterior"
          positive={false}
        />
        <StatCard 
          title="Agendamentos Hoje" 
          value={appointments?.length.toString() || "0"} 
          icon={<Calendar className="w-4 h-4" />}
          trend="8 slots disponíveis"
        />
        <StatCard 
          title="Novos Clientes" 
          value="24" 
          icon={<Users className="w-4 h-4" />}
          trend="+5 essa semana"
          positive
        />
      </div>

      <div className="grid grid-cols-1 gap-10">
        {/* Próximos Atendimentos */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-muted" /> Próximos Agendamentos
            </h3>
            <button className="text-xs font-bold text-muted hover:text-white transition-colors uppercase tracking-widest">
              Ver Agenda Completa
            </button>
          </div>

          <div className="space-y-3">
            {appointments?.slice(0, 5).map((app) => (
              <div key={app.id} className="flex items-center justify-between p-5 bg-secondary/30 border border-border rounded-xl hover:border-zinc-700 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-bold text-xs border border-border group-hover:bg-background transition-colors">
                    {app.client.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold">{app.client.name}</h4>
                    <p className="text-[11px] text-muted flex items-center gap-2 mt-0.5 uppercase tracking-wider font-medium">
                       <span className="text-white">{format(new Date(app.date), 'HH:mm')}</span> • {app.service.name}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                   <p className="text-[10px] text-muted font-bold uppercase tracking-widest mb-1">Barbeiro</p>
                   <p className="text-xs font-medium">{app.barber.name}</p>
                </div>
              </div>
            ))}
            {(!appointments || appointments.length === 0) && (
              <div className="py-20 text-center border-2 border-dashed border-border rounded-2xl opacity-40">
                <p className="text-sm italic">Nenhum agendamento para hoje</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
  positive?: boolean;
}

function StatCard({ title, value, icon, trend, positive = true }: StatCardProps) {
  return (
    <div className="p-6 bg-secondary/20 border border-border rounded-2xl hover:border-zinc-700 transition-all flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="p-2 bg-secondary rounded-lg border border-border text-muted">
          {icon}
        </div>
        {trend && (
           <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${positive ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
             {trend}
           </span>
        )}
      </div>
      <div>
        <p className="text-[10px] uppercase font-bold text-muted tracking-widest mb-1">{title}</p>
        <p className="text-2xl font-semibold tracking-tight">{value}</p>
      </div>
    </div>
  );
}
