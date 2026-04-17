"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { X, Calendar, User, Scissors, Clock } from "lucide-react";
import { getBarbers, getClients, getServices, createAppointment } from "@/services/api";
import { motion, AnimatePresence } from "framer-motion";

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AppointmentModal({ isOpen, onClose }: AppointmentModalProps) {
  const queryClient = useQueryClient();
  const [clientId, setClientId] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [barberId, setBarberId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const { data: barbers } = useQuery({ queryKey: ["barbers"], queryFn: getBarbers });
  const { data: clients } = useQuery({ queryKey: ["clients"], queryFn: getClients });
  const { data: services } = useQuery({ queryKey: ["services"], queryFn: getServices });

  const mutation = useMutation({
    mutationFn: createAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      onClose();
      resetForm();
    },
    onError: (err: any) => {
      setError(err.response?.data?.error || "Erro ao agendar horário");
    }
  });

  function resetForm() {
    setClientId("");
    setServiceId("");
    setBarberId("");
    setDate("");
    setTime("");
    setNotes("");
    setError("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!clientId || !serviceId || !barberId || !date || !time) {
      setError("Preencha todos os campos obrigatórios");
      return;
    }

    // Combinar data e hora para o formato ISO
    const dateTime = new Date(`${date}T${time}:00`);

    mutation.mutate({
      clientId,
      serviceId,
      barberId,
      date: dateTime.toISOString(),
      notes
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
              <Calendar className="w-5 h-5" />
              Novo Agendamento
            </h2>
            <button onClick={onClose} className="text-black/70 hover:text-black transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Cliente */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted flex items-center gap-2">
                <User className="w-4 h-4" /> Cliente
              </label>
              <select 
                value={clientId} 
                onChange={(e) => setClientId(e.target.value)}
                className="w-full bg-secondary/50 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-primary/50"
              >
                <option value="">Selecione um cliente</option>
                {clients?.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.name} - {c.phone}</option>
                ))}
              </select>
            </div>

            {/* Serviço */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted flex items-center gap-2">
                <Scissors className="w-4 h-4" /> Serviço
              </label>
              <select 
                value={serviceId} 
                onChange={(e) => setServiceId(e.target.value)}
                className="w-full bg-secondary/50 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-primary/50"
              >
                <option value="">Selecione o serviço</option>
                {services?.map((s: any) => (
                  <option key={s.id} value={s.id}>{s.name} - R$ {s.price}</option>
                ))}
              </select>
            </div>

            {/* Barbeiro */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted flex items-center gap-2">
                <User className="w-4 h-4" /> Barbeiro
              </label>
              <select 
                value={barberId} 
                onChange={(e) => setBarberId(e.target.value)}
                className="w-full bg-secondary/50 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-primary/50"
              >
                <option value="">Selecione o profissional</option>
                {barbers?.map((b: any) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>

            {/* Data e Hora */}
            <div className="grid grid-cols-2 gap-4">
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
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Horário
                </label>
                <input 
                  type="time" 
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
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
              className="w-full gold-gradient text-black font-bold py-4 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-primary/10 flex items-center justify-center gap-2"
            >
              {mutation.isPending ? "Agendando..." : "Confirmar Agendamento"}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
