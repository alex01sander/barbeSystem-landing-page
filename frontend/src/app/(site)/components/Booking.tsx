"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getServices, getBarbers, getAvailableSlots, createPublicAppointment } from "@/services/api";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  Calendar, 
  Clock, 
  User, 
  Scissors,
  Phone,
  MessageCircle
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function Booking() {
  const [step, setStep] = useState(1);
  const [selection, setSelection] = useState({
    serviceId: "",
    serviceName: "",
    barberId: "",
    barberName: "",
    date: format(new Date(), "yyyy-MM-dd"),
    time: "",
    clientName: "",
    clientPhone: ""
  });

  const { data: services } = useQuery({ queryKey: ["public-services"], queryFn: getServices });
  const { data: barbers } = useQuery({ queryKey: ["public-barbers"], queryFn: getBarbers });

  const { data: slots, isLoading: isLoadingSlots } = useQuery({
    queryKey: ["slots", selection.barberId, selection.serviceId, selection.date],
    queryFn: () => getAvailableSlots(selection.barberId, selection.serviceId, selection.date),
    enabled: !!selection.barberId && !!selection.serviceId && !!selection.date && step === 3
  });

  const bookingMutation = useMutation({
    mutationFn: createPublicAppointment,
    onSuccess: (data) => {
      setStep(5);
    }
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    bookingMutation.mutate(selection);
  };

  const selectedService = services?.find(s => s.id === selection.serviceId);
  const selectedBarber = barbers?.find(b => b.id === selection.barberId);

  return (
    <section id="agendamento" className="py-32 px-6 bg-secondary/20">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">Reserve sua vaga</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-4">Agendamento Online</h2>
          <p className="font-body text-zinc-400 mt-4">Rápido, simples e sem complicação.</p>
        </div>

        <div className="bg-background border border-border overflow-hidden min-h-[500px] flex flex-col sm:flex-row">
          {/* Progress Sidebar */}
          <div className="w-full sm:w-64 bg-secondary p-8 border-b sm:border-b-0 sm:border-r border-border flex flex-row sm:flex-col gap-4">
             {[1, 2, 3, 4].map(i => (
               <div key={i} className={`flex items-center gap-3 ${step === i ? 'text-white' : i < step ? 'text-accent' : 'text-zinc-700'}`}>
                 <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-[10px] font-bold ${step === i ? 'border-white' : i < step ? 'border-accent bg-accent text-black' : 'border-zinc-800'}`}>
                   {i < step ? <Check className="w-4 h-4" /> : i}
                 </div>
                 <span className="text-[10px] uppercase font-bold tracking-widest hidden sm:block">
                   {i === 1 ? "Serviço" : i === 2 ? "Profissional" : i === 3 ? "Data/Hora" : "Seus Dados"}
                 </span>
               </div>
             ))}
          </div>

          {/* Form Content */}
          <div className="flex-1 p-8 md:p-12 relative overflow-hidden">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h3 className="font-display text-2xl font-bold">Escolha o serviço</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {services?.map(s => (
                      <button
                        key={s.id}
                        onClick={() => {
                          setSelection(prev => ({ ...prev, serviceId: s.id, serviceName: s.name }));
                          nextStep();
                        }}
                        className={`w-full p-4 flex items-center justify-between border text-left transition-all ${selection.serviceId === s.id ? 'border-accent bg-accent/5' : 'border-border hover:border-zinc-700'}`}
                      >
                        <div>
                          <div className="font-bold text-sm">{s.name}</div>
                          <div className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">{s.durationMinutes} min</div>
                        </div>
                        <div className="font-bold text-accent">R$ {Number(s.price).toFixed(0)}</div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <button onClick={prevStep} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted hover:text-white transition-colors">
                    <ChevronLeft className="w-4 h-4" /> Voltar
                  </button>
                  <h3 className="font-display text-2xl font-bold">Escolha o barbeiro</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {barbers?.map(b => (
                      <button
                        key={b.id}
                        onClick={() => {
                          setSelection(prev => ({ ...prev, barberId: b.id, barberName: b.name }));
                          nextStep();
                        }}
                        className={`p-6 flex flex-col items-center border transition-all ${selection.barberId === b.id ? 'border-accent bg-accent/5' : 'border-border hover:border-zinc-700'}`}
                      >
                         <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center font-display text-2xl mb-4 text-zinc-700">
                           {b.name.charAt(0)}
                         </div>
                         <div className="font-bold text-sm">{b.name}</div>
                         <div className="text-[9px] uppercase font-bold text-accent tracking-[0.2em] mt-1 italic">Mestre</div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <button onClick={prevStep} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted hover:text-white transition-colors">
                    <ChevronLeft className="w-4 h-4" /> Voltar
                  </button>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h3 className="font-display text-2xl font-bold">Data e Horário</h3>
                    <input 
                      type="date"
                      min={format(new Date(), "yyyy-MM-dd")}
                      value={selection.date}
                      onChange={(e) => setSelection(prev => ({ ...prev, date: e.target.value }))}
                      className="bg-secondary border border-border p-2 text-xs font-bold uppercase focus:outline-none focus:border-accent"
                    />
                  </div>

                  {isLoadingSlots ? (
                    <div className="py-12 text-center text-[10px] uppercase font-bold tracking-[0.3em] text-zinc-600 animate-pulse">Sincronizando agenda...</div>
                  ) : !slots || slots.length === 0 ? (
                    <div className="py-12 text-center text-sm text-zinc-500 italic font-body">Nenhum horário disponível para este dia.</div>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                       {slots.map(s => (
                         <button
                           key={s}
                           onClick={() => {
                             setSelection(prev => ({ ...prev, time: s }));
                             nextStep();
                           }}
                           className={`p-3 border text-center font-bold text-xs tracking-widest transition-all ${selection.time === s ? 'border-accent bg-accent text-black' : 'border-border hover:border-zinc-700 text-zinc-400'}`}
                         >
                           {s}
                         </button>
                       ))}
                    </div>
                  )}
                </motion.div>
              )}

              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <button onClick={prevStep} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted hover:text-white transition-colors">
                    <ChevronLeft className="w-4 h-4" /> Voltar
                  </button>
                  <h3 className="font-display text-2xl font-bold">Finalize seu agendamento</h3>
                  
                  <div className="p-4 bg-secondary/50 border border-border space-y-2 mb-8">
                     <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                       <span className="text-muted">Serviço</span>
                       <span>{selection.serviceName}</span>
                     </div>
                     <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                       <span className="text-muted">Barbeiro</span>
                       <span>{selection.barberName}</span>
                     </div>
                     <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                       <span className="text-muted">Data</span>
                       <span>{format(new Date(`${selection.date}T10:00:00`), "dd 'de' MMMM", { locale: ptBR })}</span>
                     </div>
                     <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                       <span className="text-muted">Hora</span>
                       <span>{selection.time}</span>
                     </div>
                  </div>

                  <form onSubmit={handleBooking} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-muted">Nome Completo</label>
                      <input 
                        required
                        type="text"
                        value={selection.clientName}
                        onChange={e => setSelection(prev => ({ ...prev, clientName: e.target.value }))}
                        placeholder="Ex: João Silva"
                        className="w-full bg-secondary border border-border p-4 text-sm focus:outline-none focus:border-accent"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-muted">WhatsApp (com DDD)</label>
                      <input 
                        required
                        type="tel"
                        value={selection.clientPhone}
                        onChange={e => setSelection(prev => ({ ...prev, clientPhone: e.target.value }))}
                        placeholder="Ex: 48999999999"
                        className="w-full bg-secondary border border-border p-4 text-sm focus:outline-none focus:border-accent"
                      />
                    </div>
                    <button
                      disabled={bookingMutation.isPending}
                      className="w-full py-5 bg-accent text-black font-bold uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-accent/10 hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      {bookingMutation.isPending ? "Confirmando..." : "Confirmar Agendamento"}
                    </button>
                  </form>
                </motion.div>
              )}

              {step === 5 && (
                 <motion.div
                  key="step5"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center space-y-6"
                >
                  <div className="w-20 h-20 rounded-full border border-accent flex items-center justify-center bg-accent/10 mb-2">
                    <Check className="w-10 h-10 text-accent" />
                  </div>
                  <h3 className="font-display text-3xl font-bold">Agendamento Realizado!</h3>
                  <p className="font-body text-zinc-400 max-w-xs mx-auto">
                    Tudo certo, <strong>{selection.clientName}</strong>! Seu horário está reservado.
                  </p>
                  
                  <div className="p-6 bg-secondary border border-border w-full space-y-1">
                    <div className="text-[10px] text-accent font-bold uppercase tracking-widest">Resumo</div>
                    <div className="font-display text-lg">{selection.serviceName}</div>
                    <div className="text-xs text-muted font-bold uppercase tracking-widest">{selection.date} às {selection.time}</div>
                  </div>

                  <a
                    href={`https://wa.me/55${selection.clientPhone}?text=Olá! Acabei de agendar um ${selection.serviceName} para o dia ${selection.date} às ${selection.time}.`}
                    target="_blank"
                    className="flex items-center justify-center gap-3 w-full py-4 border border-zinc-800 text-xs font-bold uppercase tracking-widest hover:bg-zinc-900 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-green-500" /> Adicionar ao WhatsApp
                  </a>

                  <button 
                    onClick={() => { setStep(1); setSelection(prev => ({ ...prev, time: "", serviceId: "", serviceName: "" })); }}
                    className="text-[10px] font-bold uppercase text-muted hover:text-white underline underline-offset-4 tracking-[0.2em]"
                  >
                    Fazer outro agendamento
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
