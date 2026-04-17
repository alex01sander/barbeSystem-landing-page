"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { X, Scissors, DollarSign, Clock, CheckCircle, XCircle } from "lucide-react";
import { createService, updateService } from "@/services/api";
import { motion, AnimatePresence } from "framer-motion";
import { Service } from "@/types";

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceToEdit?: Service | null;
}

const durationOptions = [
  { label: "15 min", value: 15 },
  { label: "30 min", value: 30 },
  { label: "45 min", value: 45 },
  { label: "1 hora", value: 60 },
  { label: "1h 15min", value: 75 },
  { label: "1h 30min", value: 90 },
  { label: "2 horas", value: 120 },
];

export function ServiceModal({ isOpen, onClose, serviceToEdit }: ServiceModalProps) {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (serviceToEdit) {
      setName(serviceToEdit.name);
      setPrice(serviceToEdit.price.toString());
      setDurationMinutes(serviceToEdit.durationMinutes);
      setIsActive(serviceToEdit.isActive);
    } else {
      resetForm();
    }
  }, [serviceToEdit]);

  const mutation = useMutation({
    mutationFn: (data: any) => 
      serviceToEdit 
        ? updateService(serviceToEdit.id, data) 
        : createService(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      onClose();
      resetForm();
    },
    onError: (err: any) => {
      setError(err.response?.data?.error || "Erro ao salvar serviço");
    }
  });

  function resetForm() {
    setName("");
    setPrice("");
    setDurationMinutes(30);
    setIsActive(true);
    setError("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name || !price) {
      setError("Nome e preço são obrigatórios");
      return;
    }

    mutation.mutate({
      name,
      price: parseFloat(price),
      durationMinutes,
      isActive
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
          className="glass w-full max-w-md rounded-2xl overflow-hidden relative z-10 border border-white/10"
        >
          <div className="p-6 border-b border-white/10 flex items-center justify-between gold-gradient">
            <h2 className="text-xl font-bold text-black flex items-center gap-2">
              <Scissors className="w-5 h-5" />
              {serviceToEdit ? "Editar Serviço" : "Novo Serviço"}
            </h2>
            <button onClick={onClose} className="text-black/70 hover:text-black transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Nome */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted flex items-center gap-2">
                <Scissors className="w-4 h-4" /> Nome do Serviço
              </label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Corte Degradê"
                className="w-full bg-secondary/50 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-primary/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Preço */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted flex items-center gap-2">
                  <DollarSign className="w-4 h-4" /> Preço (R$)
                </label>
                <input 
                  type="number" 
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0,00"
                  className="w-full bg-secondary/50 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-primary/50"
                />
              </div>

              {/* Duração */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Duração
                </label>
                <select 
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(parseInt(e.target.value))}
                  className="w-full bg-secondary/50 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-primary/50 appearance-none"
                >
                  {durationOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Status (Toggle) */}
            {serviceToEdit && (
              <div className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/5">
                <div className="flex items-center gap-3">
                  {isActive ? <CheckCircle className="text-green-500 w-5 h-5" /> : <XCircle className="text-red-500 w-5 h-5" />}
                  <span className="text-sm font-medium">{isActive ? "Serviço Ativo" : "Serviço Inativo"}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsActive(!isActive)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isActive ? 'bg-primary' : 'bg-secondary'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            )}

            {error && (
              <div className="text-red-500 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                {error}
              </div>
            )}

            <button 
              type="submit"
              disabled={mutation.isPending}
              className="w-full gold-gradient text-black font-bold py-4 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-primary/10 flex items-center justify-center gap-2"
            >
              {mutation.isPending ? "Salvando..." : serviceToEdit ? "Salvar Alterações" : "Criar Serviço"}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
