"use client";

import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip as ReTooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import { FinancialReport } from '@/types';

interface FinancialChartsProps {
  reports: FinancialReport[];
}

const COLORS = ['#cbb26a', '#4ade80', '#60a5fa', '#f87171', '#a78bfa', '#fb923c'];

const CATEGORY_LABELS: Record<string, string> = {
  SERVICE: "Serviços",
  PRODUCT: "Produtos",
  SALARY: "Comissões",
  RENT: "Aluguel",
  SUPPLY: "Insumos",
  OTHER: "Geral"
};

export function FinancialCharts({ reports }: FinancialChartsProps) {
  const incomes = reports.filter(r => r.type === 'INCOME');
  const expenses = reports.filter(r => r.type === 'EXPENSE');

  const incomeData = incomes.map(r => ({
    name: CATEGORY_LABELS[r.category] || r.category,
    value: Number(r.total)
  }));

  const expenseData = expenses.map(r => ({
    name: CATEGORY_LABELS[r.category] || r.category,
    value: Number(r.total)
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Distribuição de Entradas */}
      <div className="glass p-6 rounded-2xl border border-white/10 h-[400px] flex flex-col">
        <h3 className="font-bold mb-4 text-green-500">Distribuição de Receitas</h3>
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={incomeData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {incomeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <ReTooltip 
                contentStyle={{ backgroundColor: '#1a1d23', borderColor: '#cbb26a', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}
                itemStyle={{ color: '#fff' }}
              />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Distribuição de Despesas */}
      <div className="glass p-6 rounded-2xl border border-white/10 h-[400px] flex flex-col">
        <h3 className="font-bold mb-4 text-red-500">Distribuição de Despesas</h3>
        <div className="flex-1 min-h-0 text-foreground">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={expenseData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$${value}`} />
              <ReTooltip 
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                contentStyle={{ backgroundColor: '#1a1d23', borderColor: '#cbb26a', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}
              />
              <Bar dataKey="value" fill="#f87171" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
