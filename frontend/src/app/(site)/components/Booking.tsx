"use client";

import { useState, useEffect, Fragment } from "react";
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
  MessageCircle,
  CalendarDays
} from "lucide-react";
import { format, addDays, startOfToday, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";

export function Booking() {
  const [mounted, setMounted] = useState(false);
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

  // Generate next 14 days for the horizontal selector
  const availableDates = Array.from({ length: 14 }, (_, i) => addDays(startOfToday(), i));

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const steps = [
    { id: 1, name: "Serviço", icon: <Scissors className="w-4 h-4" /> },
    { id: 2, name: "Barbeiro", icon: <User className="w-4 h-4" /> },
    { id: 3, name: "Data/Hora", icon: <CalendarDays className="w-4 h-4" /> },
    { id: 4, name: "Confirmar", icon: <Check className="w-4 h-4" /> },
  ];

  if (!mounted) return null;

  return (
    <section id="agendamento" className="relative py-24 md:py-40 px-6 md:px-8 bg-zinc-950 border-y border-white/5 overflow-hidden">
      {/* Subtle Background Image */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=1888')] bg-cover bg-fixed bg-center grayscale opacity-[0.05] mix-blend-soft-light" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] md:tracking-[0.5em] text-zinc-600">Agendamento Online</span>
          <h2 className="font-display text-4xl md:text-7xl font-black mt-6 uppercase tracking-tighter">
            AGENDE SEU <span className="text-stroke">HORÁRIO</span>
          </h2>
          <p className="font-body text-zinc-500 mt-6 max-w-2xl mx-auto uppercase text-[9px] md:text-[10px] tracking-[0.2em] leading-relaxed px-4">
            Reserve seu horário de forma rápida e prática. Escolha o serviço, barbeiro e horário que melhor se encaixa na sua rotina.
          </p>
        </div>

        {/* New Stepper Design */}
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-8 mb-12 md:mb-16">
          {steps.map((s, idx) => (
            <Fragment key={s.id}>
              <div className={`flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2 md:py-3 border transition-all duration-500 ${step === s.id ? 'bg-white text-black border-white' : 'bg-transparent text-zinc-500 border-white/5'}`}>
                <span className="scale-75 md:scale-100">{s.icon}</span>
                <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest">{s.name}</span>
              </div>
              {idx < steps.length - 1 && (
                <div className="hidden md:block w-8 h-[1px] bg-white/10" />
              )}
            </Fragment>
          ))}
        </div>

        <div className="bg-black border border-white/5 shadow-2xl overflow-hidden min-h-[500px] md:min-h-[600px]">
          <div className="p-6 md:p-16">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8 md:space-y-12"
                >
                  <h3 className="font-display text-2xl md:text-3xl font-black uppercase tracking-tighter">Escolha o Serviço</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    {services?.map(s => (
                      <button
                        key={s.id}
                        onClick={() => {
                          setSelection(prev => ({ ...prev, serviceId: s.id, serviceName: s.name }));
                          nextStep();
                        }}
                        className={`w-full p-6 md:p-8 flex items-center justify-between border transition-all duration-500 group ${selection.serviceId === s.id ? 'border-white bg-white text-black' : 'border-white/5 hover:border-white/20 hover:bg-white/5'}`}
                      >
                        <div className="text-left">
                          <div className="font-black text-sm md:text-base uppercase tracking-tight">{s.name}</div>
                          <div className={`text-[8px] md:text-[10px] uppercase font-bold tracking-widest mt-1 md:mt-2 ${selection.serviceId === s.id ? 'text-black/60' : 'text-zinc-600'}`}>{s.durationMinutes} MINUTOS</div>
                        </div>
                        <div className={`font-display text-lg md:text-xl font-black italic ${selection.serviceId === s.id ? 'text-black' : 'text-white'}`}>R$ {Number(s.price).toFixed(0)}</div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8 md:space-y-12"
                >
                  <h3 className="font-display text-2xl md:text-3xl font-black uppercase tracking-tighter">Escolha o Profissional</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                    {barbers?.map(b => (
                      <button
                        key={b.id}
                        onClick={() => {
                          setSelection(prev => ({ ...prev, barberId: b.id, barberName: b.name }));
                          nextStep();
                        }}
                        className={`p-6 md:p-10 flex flex-col items-center border transition-all duration-500 ${selection.barberId === b.id ? 'border-white bg-white text-black' : 'border-white/5 hover:border-white/20 hover:bg-white/5'}`}
                      >
                         <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center font-display text-2xl md:text-3xl mb-4 md:mb-6 transition-colors ${selection.barberId === b.id ? 'bg-black text-white' : 'bg-zinc-900 text-zinc-700'}`}>
                           {b.name.charAt(0)}
                         </div>
                         <div className="font-black text-xs md:text-sm uppercase tracking-widest">{b.name}</div>
                         <div className={`text-[8px] md:text-[9px] uppercase font-bold tracking-[0.2em] mt-1 md:mt-2 italic ${selection.barberId === b.id ? 'text-black/60' : 'text-zinc-600'}`}>Mestre</div>
                      </button>
                    ))}
                  </div>
                  <div className="pt-6 md:pt-8 border-t border-white/5">
                    <button onClick={prevStep} className="bw-button-outline !px-8 md:!px-10 !py-3 md:!py-4">Voltar</button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8 md:space-y-12"
                >
                  <h3 className="font-display text-2xl md:text-3xl font-black uppercase tracking-tighter">Escolha Data e Horário</h3>
                  
                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Selecione a data</p>
                    <div className="flex overflow-x-auto gap-2 md:gap-3 pb-4 scrollbar-hide">
                      {availableDates.map((date) => {
                        const dateStr = format(date, "yyyy-MM-dd");
                        const isSelected = selection.date === dateStr;
                        return (
                          <button
                            key={dateStr}
                            onClick={() => setSelection(prev => ({ ...prev, date: dateStr, time: "" }))}
                            className={`flex-shrink-0 w-20 md:w-24 p-4 md:p-6 border transition-all duration-500 flex flex-col items-center gap-1 ${isSelected ? 'border-white bg-white text-black scale-105' : 'border-white/5 hover:border-white/20 bg-zinc-950/50 text-zinc-500'}`}
                          >
                            <span className="text-[7px] md:text-[8px] font-black uppercase tracking-tighter">{format(date, "EEEE", { locale: ptBR })}</span>
                            <span className="text-lg md:text-xl font-black">{format(date, "dd")}</span>
                            <span className="text-[7px] md:text-[8px] font-black uppercase">{format(date, "MMM", { locale: ptBR })}</span>
                          </button>
                        );
                      })}
                    </div>
                    {/* Progress Bar under dates */}
                    <div className="w-full h-[2px] bg-zinc-900 relative">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "40%" }}
                        className="absolute top-0 left-0 h-full bg-white/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Selecione o horário</p>
                    {isLoadingSlots ? (
                      <div className="py-12 md:py-20 text-center text-[10px] uppercase font-black tracking-[0.5em] text-zinc-700 animate-pulse italic">Consultando Disponibilidade...</div>
                    ) : !slots || slots.length === 0 ? (
                      <div className="py-12 md:py-20 text-center text-xs text-zinc-600 uppercase tracking-widest border border-dashed border-white/5">Nenhum horário para esta data.</div>
                    ) : (
                      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-3">
                         {slots.map(s => (
                           <button
                             key={s}
                             onClick={() => setSelection(prev => ({ ...prev, time: s }))}
                             className={`p-3 md:p-4 border text-center font-black text-[10px] md:text-xs tracking-tighter transition-all duration-300 ${selection.time === s ? 'border-white bg-white text-black scale-105' : 'border-white/5 hover:border-white/40 text-zinc-500'}`}
                           >
                             {s}
                           </button>
                         ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-6 md:pt-8 border-t border-white/5 flex justify-between items-center">
                    <button onClick={prevStep} className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white flex items-center gap-1 md:gap-2 transition-colors">
                      <ChevronLeft className="w-4 h-4" /> Voltar
                    </button>
                    <button 
                      onClick={nextStep} 
                      disabled={!selection.time}
                      className={`bw-button !px-8 md:!px-12 !py-3 md:!py-4 flex items-center gap-2 md:gap-3 disabled:opacity-20 disabled:cursor-not-allowed`}
                    >
                      Próximo <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8 md:space-y-12"
                >
                  <h3 className="font-display text-2xl md:text-3xl font-black uppercase tracking-tighter">Seus Detalhes</h3>
                  
                  <form onSubmit={handleBooking} className="space-y-6 md:space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 ml-1">Nome Completo</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-800" />
                          <input
                            required
                            value={selection.clientName}
                            onChange={(e) => setSelection(prev => ({ ...prev, clientName: e.target.value }))}
                            className="w-full bg-zinc-950 border border-white/5 py-4 md:py-5 pl-12 md:pl-14 pr-6 text-xs md:text-sm focus:outline-none focus:border-white transition-all uppercase tracking-widest font-bold"
                            placeholder="DIGITE SEU NOME"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 ml-1">WhatsApp</label>
                        <div className="relative">
                          <MessageCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-800" />
                          <input
                            required
                            type="tel"
                            value={selection.clientPhone}
                            onChange={(e) => setSelection(prev => ({ ...prev, clientPhone: e.target.value }))}
                            className="w-full bg-zinc-950 border border-white/5 py-4 md:py-5 pl-12 md:pl-14 pr-6 text-xs md:text-sm focus:outline-none focus:border-white transition-all uppercase tracking-widest font-bold"
                            placeholder="(00) 00000-0000"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="p-6 md:p-10 bg-zinc-950 border border-white/5 space-y-4">
                       <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-600 mb-4 md:mb-6">Resumo da Reserva</p>
                       <div className="flex justify-between items-end border-b border-white/5 pb-3 md:pb-4">
                         <span className="text-zinc-500 text-[8px] md:text-[10px] uppercase font-bold tracking-widest">Serviço</span>
                         <span className="font-display text-lg md:text-xl font-black uppercase tracking-tighter italic">{selection.serviceName}</span>
                       </div>
                       <div className="flex justify-between items-end border-b border-white/5 pb-3 md:pb-4">
                         <span className="text-zinc-500 text-[8px] md:text-[10px] uppercase font-bold tracking-widest">Data & Hora</span>
                         <span className="font-display text-lg md:text-xl font-black uppercase tracking-tighter italic">
                          {format(new Date(selection.date + 'T12:00:00'), "dd 'DE' MMM", { locale: ptBR })} — {selection.time}
                         </span>
                       </div>
                    </div>

                    <div className="flex justify-between items-center pt-6 md:pt-8 border-t border-white/5">
                      <button type="button" onClick={prevStep} className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white flex items-center gap-1 md:gap-2 transition-colors">
                        <ChevronLeft className="w-4 h-4" /> Voltar
                      </button>
                      <button
                        type="submit"
                        disabled={bookingMutation.isPending}
                        className="bw-button !px-10 md:!px-16 !py-3 md:!py-4 flex items-center justify-center gap-2 md:gap-4 group"
                      >
                        {bookingMutation.isPending ? (
                          <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        ) : (
                          <>
                            Confirmar <ChevronRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {step === 5 && (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center space-y-8"
                >
                  <div className="w-24 h-24 rounded-full border-2 border-white flex items-center justify-center mb-4">
                    <Check className="w-12 h-12 text-white" />
                  </div>
                  <div>
                    <h3 className="font-display text-4xl font-black uppercase tracking-tighter mb-4">CONFIRMADO</h3>
                    <p className="font-body text-zinc-500 text-xs uppercase tracking-[0.2em] leading-relaxed max-w-xs mx-auto">
                      Sua reserva foi processada. <br />
                      Aguardamos você no <br />
                      <span className="text-white">{format(new Date(selection.date + 'T00:00:00'), "dd 'DE' MMMM", { locale: ptBR })} ÀS {selection.time}</span>.
                    </p>
                  </div>
                  <button 
                    onClick={() => {
                      setStep(1);
                      setSelection({
                        serviceId: "",
                        serviceName: "",
                        barberId: "",
                        barberName: "",
                        date: format(new Date(), "yyyy-MM-dd"),
                        time: "",
                        clientName: "",
                        clientPhone: ""
                      });
                    }}
                    className="text-[10px] font-black uppercase tracking-[0.4em] text-white border-b border-white pb-2 hover:text-zinc-400 hover:border-zinc-400 transition-all"
                  >
                    Fazer novo agendamento
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
