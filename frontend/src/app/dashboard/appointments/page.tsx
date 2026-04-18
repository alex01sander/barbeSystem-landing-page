"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAppointments, updateAppointmentStatus, getBarbers } from "@/services/api";
import { 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  MoreVertical,
  Scissors,
  User,
  Phone,
  MessageCircle,
  Filter
} from "lucide-react";
import { AppointmentModal } from "@/components/appointments/AppointmentModal";
import { format, addDays, subDays, startOfDay, endOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";
import { Appointment } from "@/types";

export default function AppointmentsPage() {
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBarberId, setSelectedBarberId] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const { data: barbers } = useQuery({ queryKey: ["barbers"], queryFn: getBarbers });

  // Cálculo do intervalo do dia local para evitar bugs de timezone
  const queryRange = useMemo(() => {
    return {
      start: startOfDay(selectedDate).toISOString(),
      end: endOfDay(selectedDate).toISOString()
    };
  }, [selectedDate]);

  const { data: appointments, isLoading } = useQuery({
    queryKey: ["appointments", queryRange, selectedBarberId],
    queryFn: () => getAppointments(undefined, selectedBarberId, queryRange.start, queryRange.end),
  });

  // Filtro de status feito no cliente para agilidade
  const filteredAppointments = useMemo(() => {
    if (!appointments) return [];
    if (!selectedStatus) return appointments;
    return appointments.filter(app => app.status === selectedStatus);
  }, [appointments, selectedStatus]);

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => 
      updateAppointmentStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    }
  });

  const handlePrevDay = () => setSelectedDate(subDays(selectedDate, 1));
  const handleNextDay = () => setSelectedDate(addDays(selectedDate, 1));
  const handleToday = () => setSelectedDate(new Date());

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "CONFIRMED": return <CheckCircle className="w-4 h-4 text-white" />;
      case "COMPLETED": return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "CANCELLED": return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-zinc-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED": return "bg-zinc-800 text-white border-zinc-700";
      case "COMPLETED": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "CANCELLED": return "bg-red-500/10 text-red-500 border-red-500/20";
      default: return "bg-secondary text-muted border-border";
    }
  };

  return (
    <div className="space-y-8 max-w-6xl pb-20">
      {/* Calendar Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
           <div className="p-4 bg-secondary border border-border rounded-2xl flex flex-col items-center justify-center min-w-[80px]">
              <span className="text-[10px] uppercase font-bold text-muted mb-1 tracking-widest">{format(selectedDate, 'MMM', { locale: ptBR })}</span>
              <span className="text-3xl font-bold leading-none">{format(selectedDate, 'dd')}</span>
           </div>
           <div>
              <h1 className="text-2xl font-semibold tracking-tight capitalize">
                {format(selectedDate, "EEEE, dd 'de' MMMM", { locale: ptBR })}
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <button onClick={handlePrevDay} className="p-1.5 hover:bg-secondary rounded-lg transition-colors border border-border">
                   <ChevronLeft className="w-4 h-4" />
                </button>
                <button onClick={handleToday} className="px-3 py-1.5 text-xs font-bold hover:bg-secondary rounded-lg transition-colors border border-border uppercase tracking-widest">
                  Hoje
                </button>
                <button onClick={handleNextDay} className="p-1.5 hover:bg-secondary rounded-lg transition-colors border border-border">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
           </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
           {/* Barber Selector */}
           <div className="flex items-center gap-3 bg-secondary/50 border border-border p-1.5 rounded-xl min-w-[200px]">
              <div className="pl-3">
                <Filter className="w-4 h-4 text-muted" />
              </div>
              <select 
                value={selectedBarberId}
                onChange={(e) => setSelectedBarberId(e.target.value)}
                className="bg-transparent text-[10px] font-bold uppercase p-2 focus:outline-none w-full appearance-none cursor-pointer text-white"
              >
                <option value="" className="bg-secondary text-white">Todos os Profissionais</option>
                {barbers?.map(b => (
                  <option key={b.id} value={b.id} className="bg-secondary text-white">{b.name}</option>
                ))}
              </select>
           </div>

           {/* Status Selector */}
           <div className="flex items-center gap-3 bg-secondary/50 border border-border p-1.5 rounded-xl min-w-[160px]">
              <div className="pl-3">
                <AlertCircle className="w-4 h-4 text-muted" />
              </div>
              <select 
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-transparent text-[10px] font-bold uppercase p-2 focus:outline-none w-full appearance-none cursor-pointer text-white"
              >
                <option value="" className="bg-secondary text-white">Todos os Status</option>
                <option value="PENDING" className="bg-secondary text-white">Pendentes</option>
                <option value="CONFIRMED" className="bg-secondary text-white">Confirmados</option>
                <option value="COMPLETED" className="bg-secondary text-white">Concluídos</option>
                <option value="CANCELLED" className="bg-secondary text-white">Cancelados</option>
              </select>
           </div>

           <button 
             onClick={() => setIsModalOpen(true)}
             className="flex items-center justify-center gap-2 bg-white text-black font-bold h-12 px-6 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-white/5 whitespace-nowrap"
           >
             <Plus className="w-5 h-5" />
             Novo Agendamento
           </button>
        </div>
      </div>

      {/* Timeline / List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {isLoading ? (
            <div className="py-20 text-center text-muted font-medium italic">Sincronizando agenda...</div>
          ) : filteredAppointments?.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-32 flex flex-col items-center justify-center border border-dashed border-zinc-800 rounded-3xl bg-secondary/5"
            >
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-6 border border-border">
                <CalendarIcon className="w-6 h-6 text-muted" />
              </div>
              <p className="text-sm font-medium text-zinc-400">Nenhum agendamento encontrado para estes filtros</p>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="mt-6 px-6 py-2.5 bg-white text-black text-[10px] font-bold rounded-full hover:opacity-90 transition-all uppercase tracking-[0.15em] shadow-xl shadow-white/5"
              >
                Marcar Horário
              </button>
            </motion.div>
          ) : (
            filteredAppointments?.map((app: Appointment) => (
              <motion.div 
                key={app.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group relative flex items-center gap-6"
              >
                {/* Time Indicator */}
                <div className="w-16 text-right pt-1">
                  <span className="text-sm font-bold tracking-tight">{format(new Date(app.date), 'HH:mm')}</span>
                </div>

                {/* Content Card */}
                <div className="flex-1 bg-secondary/20 border border-border rounded-2xl p-6 hover:border-zinc-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center font-bold text-sm">
                      {app.client.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-base">{app.client.name}</h3>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-widest flex items-center gap-1.5 ${getStatusColor(app.status)}`}>
                          {getStatusIcon(app.status)} {app.status === 'PENDING' ? 'Pendente' : app.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 mt-2 text-[10px] md:text-xs text-muted font-medium uppercase tracking-wider">
                         <span className="flex items-center gap-1.5">
                            <Scissors className="w-3.5 h-3.5" /> {app.service.name}
                         </span>
                         <span className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5" /> {app.barber.name}
                         </span>
                         <span className="flex items-center gap-1.5 text-white/60">
                            <Phone className="w-3.5 h-3.5" /> {app.client.phone}
                         </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {/* WhatsApp Button */}
                      <a 
                        href={`https://wa.me/55${app.client.phone.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 bg-green-500/10 text-green-500 border border-green-500/20 rounded-lg hover:bg-green-500 hover:text-white transition-all"
                        title="Contato via WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>

                      {app.status === 'PENDING' && (
                        <button 
                          onClick={() => statusMutation.mutate({ id: app.id, status: 'CONFIRMED' })}
                          className="p-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg border border-zinc-700 transition-all text-xs font-bold uppercase tracking-widest"
                        >
                          Confirmar
                        </button>
                      )}
                      {app.status === 'CONFIRMED' && (
                        <button 
                          onClick={() => statusMutation.mutate({ id: app.id, status: 'COMPLETED' })}
                          className="p-2.5 bg-zinc-800 hover:bg-green-500/10 hover:text-green-500 hover:border-green-500/20 text-white rounded-lg border border-zinc-700 transition-all text-xs font-bold uppercase tracking-widest"
                        >
                          Concluir
                        </button>
                      )}
                      <button 
                        onClick={() => statusMutation.mutate({ id: app.id, status: 'CANCELLED' })}
                        className="p-2.5 text-muted hover:text-red-500 transition-colors"
                        title="Cancelar"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <AppointmentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
