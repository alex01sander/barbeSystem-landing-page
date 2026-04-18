"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useMemo } from "react";
import { X, Calendar as CalendarIcon, Clock, Scissors, User, FileText } from "lucide-react";
import { getClients, getBarbers, getServices, createAppointment, getAppointments } from "@/services/api";
import { motion, AnimatePresence } from "framer-motion";
import { format, addMinutes, parse, isWithinInterval } from "date-fns";

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate?: Date;
}

export function AppointmentModal({ isOpen, onClose, selectedDate }: AppointmentModalProps) {
  const queryClient = useQueryClient();
  const [clientId, setClientId] = useState("");
  const [barberId, setBarberId] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const { data: clients } = useQuery({ queryKey: ["clients"], queryFn: getClients });
  const { data: barbers } = useQuery({ queryKey: ["barbers"], queryFn: getBarbers });
  const { data: services } = useQuery({ queryKey: ["services"], queryFn: getServices });

  // Buscar agendamentos do barbeiro no dia para checar disponibilidade
  const { data: existingAppointments } = useQuery({
    queryKey: ["appointments-conflict", date, barberId],
    queryFn: () => getAppointments(date, barberId),
    enabled: !!date && !!barberId
  });

  useEffect(() => {
    if (selectedDate) {
      setDate(format(selectedDate, "yyyy-MM-dd"));
    }
  }, [selectedDate]);

  // Lógica de Geração de Slots Disponíveis
  const availableSlots = useMemo(() => {
    if (!date || !barberId || !serviceId || !services) return [];

    const selectedService = services.find(s => s.id === serviceId);
    if (!selectedService) return [];

    const duration = selectedService.durationMinutes;
    const slots = [];
    const startHour = 8; // 08:00
    const endHour = 20;   // 20:00
    
    // Gerar slots a cada 30 minutos
    for (let h = startHour; h < endHour; h++) {
      for (let m = 0; m < 60; m += 30) {
        const hourStr = h.toString().padStart(2, '0');
        const minStr = m.toString().padStart(2, '0');
        const slotStartStr = `${hourStr}:${minStr}`;
        
        const slotStart = new Date(`${date}T${slotStartStr}:00`);
        const slotEnd = addMinutes(slotStart, duration);

        // Verificar conflitos com agendamentos existentes
        const isOccupied = existingAppointments?.some(app => {
          if (app.status === 'CANCELLED') return false;
          
          const appStart = new Date(app.date);
          const appEnd = addMinutes(appStart, app.service.durationMinutes);

          // Lógica de sobreposição: (StartA < EndB) && (EndA > StartB)
          return slotStart < appEnd && slotEnd > appStart;
        });

        if (!isOccupied) {
          slots.push(slotStartStr);
        }
      }
    }

    return slots;
  }, [date, barberId, serviceId, services, existingAppointments]);

  const mutation = useMutation({
    mutationFn: createAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      onClose();
      resetForm();
    },
    onError: (err: any) => {
      setError(err.response?.data?.error || "Erro ao criar agendamento");
    }
  });

  function resetForm() {
    setClientId("");
    setBarberId("");
    setServiceId("");
    setDate("");
    setTime("");
    setNotes("");
    setError("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!clientId || !barberId || !serviceId || !date || !time) {
      setError("Preencha todos os campos obrigatórios");
      return;
    }

    // Converter dd/mm/yyyy para yyyy-mm-dd para o Date constructor
    const [day, month, year] = date.split('/');
    if (!day || !month || !year || date.length < 10) {
      setError("Data inválida. Use o formato DD/MM/AAAA");
      return;
    }

    const isoDate = `${year}-${month}-${day}`;
    const fullDate = new Date(`${isoDate}T${time}:00`).toISOString();

    mutation.mutate({
      clientId,
      barberId,
      serviceId,
      date: fullDate,
      notes
    });
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ""); // Remove tudo que não é dígito
    
    if (value.length > 8) value = value.slice(0, 8);
    
    // Aplica a máscara dd/mm/yyyy
    if (value.length > 4) {
      value = `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4)}`;
    } else if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    
    setDate(value);
  };

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
          className="bg-secondary border border-border w-full max-w-xl rounded-[24px] overflow-hidden relative z-10 shadow-2xl my-8"
        >
          <div className="px-8 pt-8 pb-4 flex items-center justify-between">
            <div>
               <h2 className="text-xl font-bold tracking-tight text-white">Novo Agendamento</h2>
               <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mt-1">Reserve um horário na agenda</p>
            </div>
            <button onClick={onClose} className="p-2 text-muted hover:text-white transition-colors bg-background border border-border rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8 pt-4 space-y-8">
            <div className="space-y-6">
              {/* Cliente */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-muted tracking-widest flex items-center gap-2">
                   <User className="w-3.5 h-3.5" /> Cliente
                </label>
                <select 
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl p-3 text-sm focus:outline-none focus:border-white transition-all appearance-none cursor-pointer"
                >
                  <option value="">Selecione o cliente...</option>
                  {clients?.map((c) => (
                    <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>
                  ))}
                </select>
              </div>

              {/* Barbeiro e Serviço */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-muted tracking-widest flex items-center gap-2">
                    <Scissors className="w-3.5 h-3.5" /> Profissional
                  </label>
                  <select 
                    value={barberId}
                    onChange={(e) => setBarberId(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl p-3 text-sm focus:outline-none focus:border-white transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Selecione...</option>
                    {barbers?.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-muted tracking-widest flex items-center gap-2">
                    <Scissors className="w-3.5 h-3.5" /> Serviço
                  </label>
                  <select 
                    value={serviceId}
                    onChange={(e) => setServiceId(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl p-3 text-sm focus:outline-none focus:border-white transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Selecione...</option>
                    {services?.map((s) => (
                      <option key={s.id} value={s.id}>{s.name} - {s.durationMinutes}min</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Data e Hora */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-muted tracking-widest flex items-center gap-2">
                    <CalendarIcon className="w-3.5 h-3.5" /> Data (DD/MM/AAAA)
                  </label>
                  <input 
                    type="text" 
                    value={date}
                    onChange={handleDateChange}
                    placeholder="DD/MM/AAAA"
                    maxLength={10}
                    className="w-full bg-background border border-border rounded-xl p-3 text-sm focus:outline-none focus:border-white transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-muted tracking-widest flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5" /> Horário Disponível
                  </label>
                  <select 
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    disabled={!date || !barberId || !serviceId}
                    className="w-full bg-background border border-border rounded-xl p-3 text-sm focus:outline-none focus:border-white transition-all appearance-none cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <option value="">
                      {!date || !barberId || !serviceId 
                        ? "Selecione data, profissional e serviço..." 
                        : "Escolha um horário..."}
                    </option>
                    {availableSlots.map(slot => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Notas */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-muted tracking-widest flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5" /> Observações
                </label>
                <textarea 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ex: Cliente prefere corte baixo..."
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
                  Descartar
               </button>
               <button 
                  type="submit"
                  disabled={mutation.isPending || !time}
                  className="flex-[2] bg-white text-black font-bold text-xs py-4 rounded-xl hover:opacity-90 disabled:opacity-50 transition-all uppercase tracking-widest shadow-xl shadow-white/5"
               >
                  {mutation.isPending ? "Confirmando..." : "Agendar Horário"}
               </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
