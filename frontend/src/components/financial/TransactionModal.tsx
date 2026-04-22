"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { X, DollarSign, Tag, FileText, Calendar } from "lucide-react";
import { createTransaction } from "@/services/api";
import { TransactionType, TransactionCategory } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TransactionModal({ isOpen, onClose }: TransactionModalProps) {
  const queryClient = useQueryClient();
  const [type, setType] = useState<TransactionType>("INCOME");
  const [category, setCategory] = useState<TransactionCategory>("OTHER");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [error, setError] = useState("");

  const mutation = useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financial-summary"] });
      queryClient.invalidateQueries({ queryKey: ["financial-transactions"] });
      onClose();
      resetForm();
    },
    onError: (err: any) => {
      setError(err.response?.data?.error || "Erro ao registrar movimentação");
    }
  });

  function resetForm() {
    setType("INCOME");
    setCategory("OTHER");
    setAmount("");
    setDescription("");
    setDate(format(new Date(), "yyyy-MM-dd"));
    setError("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!amount || !description || !date) {
      setError("Preencha todos os campos obrigatórios");
      return;
    }

    mutation.mutate({
      type,
      category,
      amount: parseFloat(amount.replace(",", ".")),
      description,
      date: new Date(date).toISOString(),
    });
  }

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-secondary border border-border w-full max-w-lg rounded-[24px] overflow-hidden relative z-10 shadow-2xl"
        >
          <div className="px-8 pt-8 pb-4 flex items-center justify-between">
            <div>
               <h2 className="text-xl font-bold tracking-tight text-white">Nova Movimentação</h2>
               <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mt-1">Gestão de Fluxo de Caixa</p>
            </div>
            <button onClick={onClose} className="p-2 text-muted hover:text-white transition-colors bg-background border border-border rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8 pt-4 space-y-6">
            {/* Tipo de Movimentação */}
            <div className="grid grid-cols-2 gap-3 p-1 bg-background border border-border rounded-2xl">
               <button 
                  type="button"
                  onClick={() => setType("INCOME")}
                  className={`py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${type === 'INCOME' ? 'bg-zinc-800 text-white shadow-lg' : 'text-muted hover:text-white'}`}
               >
                  Entrada
               </button>
               <button 
                  type="button"
                  onClick={() => setType("EXPENSE")}
                  className={`py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${type === 'EXPENSE' ? 'bg-zinc-800 text-white shadow-lg' : 'text-muted hover:text-white'}`}
               >
                  Saída
               </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-muted tracking-widest">Valor</label>
                    <div className="relative">
                       <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                       <input 
                         type="text" 
                         value={amount}
                         onChange={(e) => setAmount(e.target.value)}
                         placeholder="0,00"
                         className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-white transition-all font-medium"
                       />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-muted tracking-widest">Categoria</label>
                    <select 
                      value={category}
                      onChange={(e) => setCategory(e.target.value as TransactionCategory)}
                      className="w-full bg-background border border-border rounded-xl p-3 text-sm focus:outline-none focus:border-white transition-all appearance-none cursor-pointer"
                    >
                      <option value="SALARY">Salários</option>
                      <option value="RENT">Aluguel</option>
                      <option value="SUPPLY">Insumos</option>
                      <option value="SERVICE">Serviços</option>
                      <option value="PRODUCT">Produtos</option>
                      <option value="OTHER">Outros</option>
                    </select>
                 </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-muted tracking-widest">Data</label>
                <div className="relative">
                   <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                   <input 
                     type="date" 
                     value={date}
                     onChange={(e) => setDate(e.target.value)}
                     className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-white transition-all"
                   />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-muted tracking-widest">Descrição</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ex: Pagamento da conta de luz..."
                  className="w-full bg-background border border-border rounded-xl p-3 text-sm focus:outline-none focus:border-white transition-all h-24 resize-none"
                />
              </div>
            </div>

            {error && (
              <div className="text-red-400 text-[11px] font-bold bg-red-400/5 p-3 rounded-lg border border-red-400/10 uppercase tracking-wider">
                {error}
              </div>
            )}

            <div className="pt-4 flex gap-4">
               <button 
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-background border border-border text-muted font-bold text-xs py-4 rounded-xl hover:text-white transition-all uppercase tracking-widest"
               >
                  Cancelar
               </button>
               <button 
                  type="submit"
                  disabled={mutation.isPending}
                  className="flex-[2] bg-white text-black font-bold text-xs py-4 rounded-xl hover:opacity-90 disabled:opacity-50 transition-all uppercase tracking-widest shadow-xl shadow-white/5"
               >
                  {mutation.isPending ? "Registrando..." : "Lançar Movimentação"}
               </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
