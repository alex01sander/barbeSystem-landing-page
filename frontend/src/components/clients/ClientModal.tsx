"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { X, User, Phone, Mail, Calendar, FileText } from "lucide-react";
import { createClient, updateClient } from "@/services/api";
import { motion, AnimatePresence } from "framer-motion";
import { Client, CreateClientDTO, UpdateClientDTO } from "@/types";

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientToEdit?: Client | null;
}

export function ClientModal({ isOpen, onClose, clientToEdit }: ClientModalProps) {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (clientToEdit) {
      setName(clientToEdit.name);
      setPhone(clientToEdit.phone);
      setEmail(clientToEdit.email || "");
      setNotes(clientToEdit.notes || "");
    } else {
      resetForm();
    }
  }, [clientToEdit]);

  const mutation = useMutation({
    mutationFn: (data: CreateClientDTO | UpdateClientDTO) => 
      clientToEdit 
        ? updateClient(clientToEdit.id, data as UpdateClientDTO) 
        : createClient(data as CreateClientDTO),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      onClose();
      resetForm();
    },
    onError: (err: { response?: { data?: { error?: string } } }) => {
      setError(err.response?.data?.error || "Erro ao salvar cliente");
    }
  });

  function resetForm() {
    setName("");
    setPhone("");
    setEmail("");
    setBirthDate("");
    setNotes("");
    setError("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name || !phone) {
      setError("Nome e telefone são obrigatórios");
      return;
    }

    mutation.mutate({
      name,
      phone,
      email: email || undefined,
      birthDate: birthDate || undefined,
      notes: notes || undefined
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
          className="bg-secondary border border-border w-full max-w-lg rounded-[24px] overflow-hidden relative z-10 shadow-2xl"
        >
          <div className="px-8 pt-8 pb-4 flex items-center justify-between">
            <div>
               <h2 className="text-xl font-bold tracking-tight text-white">
                 {clientToEdit ? "Editar Cliente" : "Novo Cliente"}
               </h2>
               <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mt-1">Base de Dados CRM</p>
            </div>
            <button onClick={onClose} className="p-2 text-muted hover:text-white transition-colors bg-background border border-border rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8 pt-4 space-y-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-muted tracking-widest flex items-center gap-2">
                   <User className="w-3.5 h-3.5" /> Nome Completo
                </label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: João Silva"
                  className="w-full bg-background border border-border rounded-xl p-4 text-sm focus:outline-none focus:border-white transition-all font-medium"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-muted tracking-widest flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5" /> Telefone / WhatsApp
                  </label>
                  <input 
                    type="text" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(00) 00000-0000"
                    className="w-full bg-background border border-border rounded-xl p-4 text-sm focus:outline-none focus:border-white transition-all font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-muted tracking-widest flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5" /> E-mail (Opcional)
                  </label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="joao@email.com"
                    className="w-full bg-background border border-border rounded-xl p-4 text-sm focus:outline-none focus:border-white transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-muted tracking-widest flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5" /> Observações Internas
                </label>
                <textarea 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Preferências, alergias ou notas importantes..."
                  className="w-full bg-background border border-border rounded-xl p-4 text-sm focus:outline-none focus:border-white transition-all h-28 resize-none"
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
                  {mutation.isPending ? "Processando..." : clientToEdit ? "Atualizar Cadastro" : "Criar Cliente"}
               </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
