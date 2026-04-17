"use client";

import { 
  Users, 
  Calendar, 
  TrendingUp,
  DollarSign
} from "lucide-react";

export default function DashboardHome() {
  return (
    <div className="p-8 space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Atendimentos Hoje" value="12" icon={<Calendar className="text-primary" />} />
        <StatCard label="Novos Clientes" value="48" icon={<Users className="text-primary" />} />
        <StatCard label="Receita Diária" value="R$ 450,00" icon={<TrendingUp className="text-primary" />} />
        <StatCard label="Faturamento Mês" value="R$ 12.840" icon={<DollarSign className="text-primary" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 glass rounded-2xl p-8 h-96 flex items-center justify-center border border-white/10">
            <p className="text-muted">Espaço reservado para o Gráfico de Faturamento</p>
         </div>
         <div className="glass rounded-2xl p-8 h-96 border border-white/10">
            <h3 className="font-bold mb-4">Próximos Agendamentos</h3>
            <div className="space-y-4">
              <AppointmentItem name="Carlos Oliveira" time="14:30" service="Corte + Barba" />
              <AppointmentItem name="Ricardo Silva" time="15:15" service="Corte Degradê" />
              <AppointmentItem name="Marcos Souza" time="16:00" service="Barba" />
            </div>
         </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) {
  return (
    <div className="glass p-6 rounded-2xl border border-white/10 hover:border-primary/30 transition-all group">
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
          {icon}
        </div>
      </div>
      <p className="text-muted text-sm uppercase tracking-wider font-medium">{label}</p>
      <h3 className="text-2xl font-bold mt-1">{value}</h3>
    </div>
  );
}

function AppointmentItem({ name, time, service }: { name: string, time: string, service: string }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 border border-white/5">
      <div>
        <p className="font-semibold text-sm">{name}</p>
        <p className="text-xs text-muted">{service}</p>
      </div>
      <span className="text-xs font-bold bg-primary/20 text-primary px-2 py-1 rounded-lg">
        {time}
      </span>
    </div>
  );
}
