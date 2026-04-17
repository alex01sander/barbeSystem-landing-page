"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { X, User, Phone, Mail, Calendar, StickyNote } from "lucide-react";
import { createClient, updateClient } from "@/services/api";
import { motion, AnimatePresence } from "framer-motion";
import { Client } from "@/types";

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
      // Formatar data para YYYY-MM-DD se existir
      if (clientToEdit.birthDate) {
        setBirthDate(new Date(clientToEdit.birthDate).toISOString().split('T')[0]);
      } else {
        setBirthDate("");
      }
      setNotes(clientToEdit.notes || "");
    } else {
      resetForm();
    }
  }, [clientToEdit]);

  const mutation = useMutation({
    mutationFn: (data: any) => 
      clientToEdit 
        ? updateClient(clientToEdit.id, data) 
        : createClient(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      onClose();
      resetForm();
    },
    onError: (err: any) => {
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
              <User className="w-5 h-5" />
              {clientToEdit ? "Editar Cliente" : "Novo Cliente"}
            </h2>
            <button onClick={onClose} className="text-black/70 hover:text-black transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Nome */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted flex items-center gap-2">
                <User className="w-4 h-4" /> Nome Completo
              </label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: João Silva"
                className="w-full bg-secondary/50 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-primary/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Telefone */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted flex items-center gap-2">
                  <Phone className="w-4 h-4" /> Telefone
                </label>
                <input 
                  type="text" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(11) 99999-9999"
                  className="w-full bg-secondary/50 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-primary/50"
                />
              </div>

              {/* Data de Nascimento */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Nascimento
                </label>
                <input 
                  type="date" 
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full bg-secondary/50 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-primary/50"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted flex items-center gap-2">
                <Mail className="w-4 h-4" /> E-mail (Opcional)
              </label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="joao@email.com"
                className="w-full bg-secondary/50 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-primary/50"
              />
            </div>

            {/* Observações */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted flex items-center gap-2">
                <StickyNote className="w-4 h-4" /> Observações
              </label>
              <textarea 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Detalhes importantes sobre o cliente..."
                className="w-full bg-secondary/50 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-primary/50 resize-none"
              />
            </div>

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
              {mutation.isPending ? "Salvando..." : clientToEdit ? "Salvar Alterações" : "Cadastrar Cliente"}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
