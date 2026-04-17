"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getAppointments, 
  updateAppointmentStatus 
} from "@/services/api";
import { 
  Calendar, 
  Plus, 
  Clock, 
  User, 
  Scissors, 
  CheckCircle2, 
  XCircle,
  AlertCircle,
  MoreVertical,
  Filter
} from "lucide-react";
import { AppointmentModal } from "@/components/appointments/AppointmentModal";
import { motion, AnimatePresence } from "framer-motion";
import { AppointmentStatus, Appointment as AppointmentType } from "@/types";

export default function AppointmentsPage() {
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: appointments, isLoading } = useQuery({
    queryKey: ["appointments", selectedDate],
    queryFn: () => getAppointments(selectedDate)
  });

  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: AppointmentStatus }) => 
      updateAppointmentStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    }
  });

  const statusColors: Record<AppointmentStatus, string> = {
    PENDING: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    CONFIRMED: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    COMPLETED: "bg-green-500/10 text-green-500 border-green-500/20",
    CANCELLED: "bg-red-500/10 text-red-500 border-red-500/20",
    NO_SHOW: "bg-gray-500/10 text-gray-400 border-gray-500/20"
  };

  const statusLabels: Record<AppointmentStatus, string> = {
    PENDING: "Pendente",
    CONFIRMED: "Confirmado",
    COMPLETED: "Concluído",
    CANCELLED: "Cancelado",
    NO_SHOW: "Faltou"
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header com Filtros */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gold">Agenda</h1>
          <p className="text-muted mt-1">Gerencie os horários e atendimentos da barbearia</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-secondary border border-white/10 rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:border-primary/50 text-sm"
            />
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="gold-gradient text-black font-bold px-5 py-2 rounded-xl flex items-center gap-2 hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            Novo Agendamento
          </button>
        </div>
      </header>

      {/* Lista de Agendamentos */}
      <div className="glass rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-muted text-sm text-left font-medium">
                <th className="px-6 py-4">Horário</th>
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">Serviço</th>
                <th className="px-6 py-4">Barbeiro</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted">Carregando agenda...</td>
                </tr>
              ) : Object.keys(appointments || {}).length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted">Ainda não há agendamentos para esta data.</td>
                </tr>
              ) : (
                appointments?.map((appt: AppointmentType) => (
                  <tr key={appt.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 font-bold text-primary">
                        <Clock className="w-4 h-4" />
                        {new Date(appt.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold">{appt.client.name}</p>
                        <p className="text-xs text-muted">{appt.client.phone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm">{appt.service.name}</p>
                        <p className="text-xs text-muted">R$ {appt.totalPrice}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-sm">
                      {appt.barber.name}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusColors[appt.status]}`}>
                        {statusLabels[appt.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         {appt.status === "PENDING" && (
                           <button 
                             onClick={() => mutation.mutate({ id: appt.id, status: 'CONFIRMED' })}
                             title="Confirmar"
                             className="p-2 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition-all"
                           >
                             <CheckCircle2 className="w-4 h-4" />
                           </button>
                         )}
                         {appt.status !== "COMPLETED" && appt.status !== "CANCELLED" && (
                           <button 
                             onClick={() => mutation.mutate({ id: appt.id, status: 'COMPLETED' })}
                             title="Concluir"
                             className="p-2 bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500 hover:text-white transition-all"
                           >
                             <CheckCircle2 className="w-4 h-4" />
                           </button>
                         )}
                         {appt.status !== "CANCELLED" && (
                           <button 
                             onClick={() => mutation.mutate({ id: appt.id, status: 'CANCELLED' })}
                             title="Cancelar"
                             className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                           >
                             <XCircle className="w-4 h-4" />
                           </button>
                         )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AppointmentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
