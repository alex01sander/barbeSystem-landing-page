"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  getFinancialSummary, 
  getFinancialReports, 
  getTransactions 
} from "@/services/api";
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Plus, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Filter
} from "lucide-react";
import { FinancialCharts } from "@/components/financial/FinancialCharts";
import { TransactionModal } from "@/components/financial/TransactionModal";
import { motion } from "framer-motion";

export default function FinancialPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  const { data: summary, isLoading: isLoadingSummary } = useQuery({
    queryKey: ["financial-summary", dateRange],
    queryFn: () => getFinancialSummary(dateRange.start, dateRange.end)
  });

  const { data: reports, isLoading: isLoadingReports } = useQuery({
    queryKey: ["financial-reports", dateRange],
    queryFn: () => getFinancialReports(dateRange.start, dateRange.end)
  });

  const { data: transactions, isLoading: isLoadingTransactions } = useQuery({
    queryKey: ["transactions", dateRange],
    queryFn: () => getTransactions(dateRange.start, dateRange.end)
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gold">Gestão Financeira</h1>
          <p className="text-muted mt-1">Acompanhe o fluxo de caixa, lucros e despesas</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-secondary/50 border border-white/10 rounded-xl p-1">
            <input 
              type="date" 
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="bg-transparent text-xs p-2 focus:outline-none"
            />
            <span className="text-muted text-xs">até</span>
            <input 
              type="date" 
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="bg-transparent text-xs p-2 focus:outline-none"
            />
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="gold-gradient text-black font-bold px-5 py-2 rounded-xl flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <Plus className="w-5 h-5" />
            Lançar Movimentação
          </button>
        </div>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard 
          label="Saldo em Caixa" 
          value={formatCurrency(summary?.balance || 0)} 
          icon={<Wallet className="text-primary" />} 
          loading={isLoadingSummary}
        />
        <SummaryCard 
          label="Total de Entradas" 
          value={formatCurrency(summary?.totalIncomes || 0)} 
          icon={<TrendingUp className="text-green-500" />} 
          trend={<ArrowUpRight className="text-green-500 w-4 h-4" />}
          loading={isLoadingSummary}
        />
        <SummaryCard 
          label="Total de Saídas" 
          value={formatCurrency(summary?.totalExpenses || 0)} 
          icon={<TrendingDown className="text-red-500" />} 
          trend={<ArrowDownRight className="text-red-500 w-4 h-4" />}
          loading={isLoadingSummary}
        />
      </div>

      {/* Charts Section */}
      {!isLoadingReports && reports && <FinancialCharts reports={reports} />}

      {/* Transaction List */}
      <div className="glass rounded-2xl border border-white/10 overflow-hidden">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h3 className="font-bold flex items-center gap-2">
             <Filter className="w-4 h-4 text-muted" />
             Últimas Transações
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-muted text-xs text-left font-medium uppercase tracking-wider">
                <th className="px-6 py-4">Data</th>
                <th className="px-6 py-4">Descrição</th>
                <th className="px-6 py-4">Categoria</th>
                <th className="px-6 py-4">Pagamento</th>
                <th className="px-6 py-4 text-right">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoadingTransactions ? (
                <tr>
                   <td colSpan={5} className="px-6 py-12 text-center text-muted">Carregando transações...</td>
                </tr>
              ) : transactions?.length === 0 ? (
                <tr>
                   <td colSpan={5} className="px-6 py-12 text-center text-muted">Nenhuma transação no período.</td>
                </tr>
              ) : (
                transactions?.map((t) => (
                  <tr key={t.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4 text-sm text-muted">
                      {new Date(t.date).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-sm">{t.description}</p>
                      {t.client && <p className="text-[10px] text-muted italic">Ref: {t.client.name}</p>}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-muted uppercase">
                        {t.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-muted">
                      {t.paymentMethod || '-'}
                    </td>
                    <td className={`px-6 py-4 text-right font-bold ${t.type === 'INCOME' ? 'text-green-500' : 'text-red-500'}`}>
                      {t.type === 'INCOME' ? '+' : '-'} {formatCurrency(t.amount)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <TransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

function SummaryCard({ label, value, icon, trend, loading }: { label: string, value: string, icon: React.ReactNode, trend?: React.ReactNode, loading?: boolean }) {
  return (
    <div className="glass p-6 rounded-2xl border border-white/10 hover:border-primary/30 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center">
          {icon}
        </div>
        {trend}
      </div>
      <p className="text-muted text-sm font-medium">{label}</p>
      {loading ? (
        <div className="h-8 w-32 bg-white/5 animate-pulse rounded mt-2" />
      ) : (
        <h3 className="text-2xl font-black mt-1 tracking-tight">{value}</h3>
      )}
    </div>
  );
}
