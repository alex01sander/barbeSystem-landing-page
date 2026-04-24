"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { X, Scissors, Clock, DollarSign, Tag } from "lucide-react";
import { createService, updateService } from "@/services/api";
import { motion, AnimatePresence } from "framer-motion";
import { Service, CreateServiceDTO, UpdateServiceDTO } from "@/types";

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceToEdit?: Service | null;
}

export function ServiceModal({ isOpen, onClose, serviceToEdit }: ServiceModalProps) {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (serviceToEdit) {
      setName(serviceToEdit.name);
      setPrice(serviceToEdit.price.toString());
      setDurationMinutes(serviceToEdit.durationMinutes.toString());
    } else {
      resetForm();
    }
  }, [serviceToEdit]);

  const mutation = useMutation({
    mutationFn: (data: CreateServiceDTO | UpdateServiceDTO) => 
      serviceToEdit 
        ? updateService(serviceToEdit.id, data as UpdateServiceDTO) 
        : createService(data as CreateServiceDTO),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      onClose();
      resetForm();
    },
    onError: (err: { response?: { data?: { error?: string } } }) => {
      setError(err.response?.data?.error || "Erro ao salvar serviço");
    }
  });

  function resetForm() {
    setName("");
    setPrice("");
    setDurationMinutes("");
    setError("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name || !price || !durationMinutes) {
      setError("Preencha todos os campos obrigatórios");
      return;
    }

    mutation.mutate({
      name,
      price: parseFloat(price),
      durationMinutes: parseInt(durationMinutes),
    });
  }

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-secondary border border-border w-full max-w-md rounded-[24px] overflow-hidden relative z-10 shadow-2xl"
        >
          <div className="px-8 pt-8 pb-4 flex items-center justify-between">
            <div>
               <h2 className="text-xl font-bold tracking-tight text-white">
                 {serviceToEdit ? "Editar Serviço" : "Novo Serviço"}
               </h2>
               <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mt-1">Configuração de Catálogo</p>
            </div>
            <button onClick={onClose} className="p-2 text-muted hover:text-white transition-colors bg-background border border-border rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8 pt-4 space-y-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-muted tracking-widest flex items-center gap-2">
                   <Tag className="w-3.5 h-3.5" /> Nome do Serviço
                </label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Corte de Cabelo"
                  className="w-full bg-background border border-border rounded-xl p-4 text-sm focus:outline-none focus:border-white transition-all font-medium"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-muted tracking-widest flex items-center gap-2">
                    <DollarSign className="w-3.5 h-3.5" /> Preço Sugerido
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted opacity-40">R$</span>
                    <input 
                      type="number" 
                      step="0.01"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0,00"
                      className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-4 text-sm focus:outline-none focus:border-white transition-all font-medium"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-muted tracking-widest flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5" /> Duração (min)
                  </label>
                  <input 
                    type="number" 
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(e.target.value)}
                    placeholder="Ex: 30"
                    className="w-full bg-background border border-border rounded-xl p-4 text-sm focus:outline-none focus:border-white transition-all font-medium"
                  />
                </div>
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
                  {mutation.isPending ? "Salvando..." : serviceToEdit ? "Salvar Alterações" : "Criar Serviço"}
               </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
