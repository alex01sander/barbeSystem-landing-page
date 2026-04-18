"use client";

import { useQuery } from "@tanstack/react-query";
import { getFinancialSummary, getTransactions } from "@/services/api";
import { 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight, 
  Plus,
  FileText,
  Download
} from "lucide-react";
import { useState } from "react";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import { TransactionModal } from "@/components/financial/TransactionModal";

export default function FinancialPage() {
  const [dateRange, setDateRange] = useState({
    start: format(startOfMonth(new Date()), "yyyy-MM-dd"),
    end: format(endOfMonth(new Date()), "yyyy-MM-dd")
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: summary, isLoading: isLoadingSummary } = useQuery({
    queryKey: ["financial-summary", dateRange],
    queryFn: () => getFinancialSummary(dateRange.start, dateRange.end)
  });

  const { data: transactions, isLoading: isLoadingTransactions } = useQuery({
    queryKey: ["financial-transactions", dateRange],
    queryFn: () => getTransactions(dateRange.start, dateRange.end)
  });

  return (
    <div className="space-y-10 max-w-7xl">
      {/* Header & Filters */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Financeiro</h1>
          <p className="text-muted text-sm mt-1">Gestão de receitas, despesas e fluxo de caixa.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-secondary/50 border border-border p-1.5 rounded-xl">
            <input 
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="bg-transparent text-[10px] font-bold uppercase p-1.5 focus:outline-none"
            />
            <span className="text-muted text-xs">—</span>
            <input 
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="bg-transparent text-[10px] font-bold uppercase p-1.5 focus:outline-none"
            />
          </div>
          
          <button 
             onClick={() => setIsModalOpen(true)}
             className="flex items-center justify-center gap-2 bg-white text-black font-bold h-10 px-4 rounded-xl hover:opacity-90 transition-opacity whitespace-nowrap"
           >
             <Plus className="w-4 h-4" />
             Novo Lançamento
           </button>
        </div>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard 
          title="Saldo Líquido" 
          amount={`R$ ${summary?.balance.toFixed(2) || "0,00"}`} 
          icon={<DollarSign className="w-4 h-4" />}
          highlight
        />
        <SummaryCard 
          title="Total Entradas" 
          amount={`R$ ${summary?.totalIncomes.toFixed(2) || "0,00"}`} 
          icon={<ArrowUpRight className="w-4 h-4 text-white" />}
          label="Receita Bruta"
        />
        <SummaryCard 
          title="Total Saídas" 
          amount={`R$ ${summary?.totalExpenses.toFixed(2) || "0,00"}`} 
          icon={<ArrowDownRight className="w-4 h-4 text-red-500" />}
          label="Operacional & Gastos"
        />
      </div>

      {/* Transactions List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FileText className="w-5 h-5 text-muted" /> Histórico de Transações
          </h3>
        </div>

        <div className="bg-secondary/10 border border-border rounded-3xl overflow-hidden">
           {isLoadingTransactions ? (
             <div className="py-20 text-center text-muted font-medium italic">Sincronizando caixa...</div>
           ) : !transactions || transactions?.length === 0 ? (
             <div className="py-20 text-center text-muted font-medium italic">Nenhuma movimentação no período</div>
           ) : (
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="border-b border-border bg-secondary/30">
                    <th className="px-8 py-4 text-[10px] font-bold text-muted uppercase tracking-[0.2em]">Descrição / Categoria</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-muted uppercase tracking-[0.2em]">Data</th>
                    <th className="px-8 py-4 text-right text-[10px] font-bold text-muted uppercase tracking-[0.2em]">Valor / Tipo</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-border/50 font-sans">
                 {transactions?.map((t: any) => (
                    <tr key={t.id} className="hover:bg-secondary/20 transition-colors group">
                       <td className="px-8 py-5">
                          <div>
                            <h4 className="font-semibold text-sm">{t.description}</h4>
                            <span className="text-[10px] font-bold text-muted uppercase tracking-widest mt-1 block">
                              {t.category}
                            </span>
                          </div>
                       </td>
                       <td className="px-8 py-5">
                          <span className="text-xs text-muted font-medium">
                            {format(new Date(t.date), "dd/MM/yyyy")}
                          </span>
                       </td>
                       <td className="px-8 py-5 text-right">
                          <div className={`text-sm font-bold ${t.type === 'INCOME' ? 'text-white' : 'text-red-400'}`}>
                             {t.type === 'INCOME' ? '+' : '-'} R$ {Number(t.amount).toFixed(2)}
                          </div>
                          <span className="text-[9px] font-bold text-muted uppercase tracking-[0.15em] block mt-0.5">
                            {t.type === 'INCOME' ? 'Entrada' : 'Saída'}
                          </span>
                       </td>
                    </tr>
                 ))}
               </tbody>
             </table>
           )}
        </div>
      </div>

      <TransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}

function SummaryCard({ title, amount, icon, label, highlight = false }: any) {
  return (
    <div className={`p-8 rounded-3xl border transition-all ${highlight ? 'bg-white text-black border-white shadow-xl shadow-white/5' : 'bg-secondary/20 border-border hover:border-zinc-700'}`}>
      <div className="flex items-center justify-between mb-6">
        <div className={`p-2 rounded-xl border ${highlight ? 'bg-black text-white border-black/10' : 'bg-zinc-800 border-border'}`}>
          {icon}
        </div>
      </div>
      <p className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-2 ${highlight ? 'text-black/60' : 'text-muted'}`}>{title}</p>
      <h2 className="text-3xl font-bold tracking-tighter">{amount}</h2>
      {label && <p className={`text-[10px] font-medium mt-1 uppercase tracking-widest ${highlight ? 'text-black/40' : 'text-muted'}`}>{label}</p>}
    </div>
  );
}
