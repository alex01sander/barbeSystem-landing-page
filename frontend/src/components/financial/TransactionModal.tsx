"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { X, DollarSign, Tag, FileText, Calendar, CreditCard } from "lucide-react";
import { createTransaction } from "@/services/api";
import { motion, AnimatePresence } from "framer-motion";
import { TransactionType, TransactionCategory, PaymentMethod } from "@/types";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES: { label: string; value: TransactionCategory }[] = [
  { label: "Serviço", value: "SERVICE" },
  { label: "Produto", value: "PRODUCT" },
  { label: "Salário / Comissão", value: "SALARY" },
  { label: "Aluguel", value: "RENT" },
  { label: "Suprimentos", value: "SUPPLY" },
  { label: "Outros", value: "OTHER" },
];

const METHODS: { label: string; value: PaymentMethod }[] = [
  { label: "Dinheiro", value: "CASH" },
  { label: "Pix", value: "PIX" },
  { label: "Crédito", value: "CREDIT_CARD" },
  { label: "Débito", value: "DEBIT_CARD" },
];

export function TransactionModal({ isOpen, onClose }: TransactionModalProps) {
  const queryClient = useQueryClient();
  const [type, setType] = useState<TransactionType>("EXPENSE");
  const [category, setCategory] = useState<TransactionCategory>("OTHER");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CASH");
  const [error, setError] = useState("");

  const mutation = useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financial-summary"] });
      queryClient.invalidateQueries({ queryKey: ["financial-reports"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      onClose();
      resetForm();
    },
    onError: (err: any) => {
      setError(err.response?.data?.error || "Erro ao registrar transação");
    }
  });

  function resetForm() {
    setType("EXPENSE");
    setCategory("OTHER");
    setDescription("");
    setAmount("");
    setDate(new Date().toISOString().split('T')[0]);
    setPaymentMethod("CASH");
    setError("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!description || !amount || !date) {
      setError("Preencha todos os campos obrigatórios");
      return;
    }

    mutation.mutate({
      type,
      category,
      description,
      amount: parseFloat(amount),
      date: new Date(date).toISOString(),
      paymentMethod
    });
  }

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="glass w-full max-w-lg rounded-2xl overflow-hidden relative z-10 border border-white/10"
        >
          <div className="p-6 border-b border-white/10 flex items-center justify-between gold-gradient">
            <h2 className="text-xl font-bold text-black flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Novo Lançamento
            </h2>
            <button onClick={onClose} className="text-black/70 hover:text-black transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Tipo de Transação */}
            <div className="flex p-1 bg-secondary rounded-xl gap-1">
              <button
                type="button"
                onClick={() => setType("INCOME")}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${type === "INCOME" ? 'bg-green-500 text-white shadow-lg' : 'text-muted hover:text-white'}`}
              >
                Entrada
              </button>
              <button
                type="button"
                onClick={() => setType("EXPENSE")}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${type === "EXPENSE" ? 'bg-red-500 text-white shadow-lg' : 'text-muted hover:text-white'}`}
              >
                Saída
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Categoria */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted flex items-center gap-2">
                  <Tag className="w-4 h-4" /> Categoria
                </label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value as TransactionCategory)}
                  className="w-full bg-secondary/50 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-primary/50"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              {/* Forma de Pagamento */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted flex items-center gap-2">
                  <CreditCard className="w-4 h-4" /> Pagamento
                </label>
                <select 
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full bg-secondary/50 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-primary/50"
                >
                  {METHODS.map(m => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Descrição */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted flex items-center gap-2">
                <FileText className="w-4 h-4" /> Descrição
              </label>
              <input 
                type="text" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex: Aluguel da Sala"
                className="w-full bg-secondary/50 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-primary/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Valor */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted flex items-center gap-2">
                  <DollarSign className="w-4 h-4" /> Valor (R$)
                </label>
                <input 
                  type="number" 
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0,00"
                  className="w-full bg-secondary/50 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-primary/50"
                />
              </div>

              {/* Data */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Data
                </label>
                <input 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-secondary/50 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-primary/50"
                />
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                {error}
              </div>
            )}

            <button 
              type="submit"
              disabled={mutation.isPending}
              className={`w-full font-bold py-4 rounded-xl hover:opacity-90 transition-opacity shadow-lg flex items-center justify-center gap-2 ${type === "INCOME" ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}
            >
              {mutation.isPending ? "Registrando..." : `Lançar ${type === "INCOME" ? 'Entrada' : 'Saída'}`}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
