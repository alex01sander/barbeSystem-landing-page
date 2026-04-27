"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getServices, getBarbers, getAvailableSlots, createPublicAppointment } from "@/services/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Scissors,
  User,
  CalendarDays,
  Clock,
  Phone,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import { format, addDays, startOfToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useCachedQuery } from "@/hooks/useCachedQuery";

export default function AgendamentosPage() {
  const [step, setStep] = useState(1);
  const [selection, setSelection] = useState({
    serviceId: "",
    serviceName: "",
    servicePrice: 0,
    serviceDuration: 0,
    barberId: "",
    barberName: "",
    barberPhoto: "",
    date: format(new Date(), "yyyy-MM-dd"),
    time: "",
    clientName: "",
    clientPhone: "",
  });

  const availableDates = Array.from({ length: 14 }, (_, i) => addDays(startOfToday(), i));

  const { data: services } = useCachedQuery("public-services", getServices);
  const { data: barbers } = useCachedQuery("public-barbers", getBarbers);

  const { data: slots, isLoading: isLoadingSlots } = useQuery({
    queryKey: ["slots", selection.barberId, selection.serviceId, selection.date],
    queryFn: () => getAvailableSlots(selection.barberId, selection.serviceId, selection.date),
    enabled: !!selection.barberId && !!selection.serviceId && !!selection.date && step === 3,
  });

  const bookingMutation = useMutation({
    mutationFn: createPublicAppointment,
    onSuccess: () => setStep(5),
  });

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    bookingMutation.mutate(selection);
  };

  const totalSteps = 4;
  const progress = ((step - 1) / totalSteps) * 100;

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir < 0 ? "100%" : "-100%", opacity: 0 }),
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-body selection:bg-white selection:text-black">
      {/* Mobile-centric Container for Desktop */}
      <div className="flex-1 w-full max-w-[450px] mx-auto bg-black border-x border-white/5 shadow-2xl shadow-white/5 flex flex-col relative overflow-hidden">
        
        {/* Header */}
        <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5 px-6 py-5">
          <div className="flex items-center justify-between">
            {step > 1 && step < 5 ? (
              <button 
                onClick={prevStep} 
                className="w-10 h-10 flex items-center justify-center border border-white/10 rounded-full hover:bg-white hover:text-black transition-all duration-300 group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              </button>
            ) : step === 1 ? (
              <a 
                href="/"
                className="w-10 h-10 flex items-center justify-center border border-white/10 rounded-full hover:bg-white hover:text-black transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4" />
              </a>
            ) : (
              <div className="w-10" />
            )}

            <div className="text-center">
              <h1 className="font-display text-sm font-black uppercase tracking-[0.3em] leading-none">
                IDALGO<span className="text-zinc-600">CORTES</span>
              </h1>
              {step < 5 && (
                <div className="flex items-center justify-center gap-1.5 mt-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div 
                      key={i}
                      className={`h-1 rounded-full transition-all duration-500 ${
                        i === step ? "w-4 bg-white" : "w-1.5 bg-white/10"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="w-10 flex justify-end">
              {step < 5 && (
                <span className="text-[10px] font-black text-zinc-600 tabular-nums">
                  0{step}
                </span>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto scrollbar-hide pb-24">
        <AnimatePresence mode="wait" initial={false}>
          {step === 1 && (
            <motion.div
              key="step1"
              variants={slideVariants}
              custom={1}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="px-6 py-8"
            >
              <div className="mb-8">
                <h2 className="font-display text-4xl font-black uppercase tracking-tighter leading-none">
                  O que vamos <br />
                  <span className="text-stroke">Fazer hoje?</span>
                </h2>
                <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] mt-3">Selecione um de nossos serviços premium</p>
              </div>
...
              <div className="space-y-3">
                {services?.filter(s => s.isActive).map((service) => (
                  <button
                    key={service.id}
                    onClick={() => {
                      setSelection(p => ({
                        ...p,
                        serviceId: service.id,
                        serviceName: service.name,
                        servicePrice: service.price,
                        serviceDuration: service.durationMinutes,
                      }));
                      nextStep();
                    }}
                    className={`group w-full flex items-center justify-between p-5 border transition-all duration-500 text-left relative overflow-hidden ${
                      selection.serviceId === service.id
                        ? "border-white bg-white text-black"
                        : "border-white/5 bg-zinc-950/50 hover:border-white/20"
                    }`}
                  >
                    {selection.serviceId === service.id && (
                      <motion.div 
                        layoutId="service-bg"
                        className="absolute inset-0 bg-white"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    
                    <div className="relative z-10 flex-1 min-w-0">
                      <p className={`font-black text-xs uppercase tracking-widest transition-colors ${
                        selection.serviceId === service.id ? "text-black" : "text-white"
                      }`}>
                        {service.name}
                      </p>
                      <p className={`text-[9px] mt-1 uppercase tracking-wider transition-colors ${
                        selection.serviceId === service.id ? "text-black/60" : "text-zinc-500"
                      }`}>
                        {service.durationMinutes} min
                        {service.description && ` • ${service.description}`}
                      </p>
                    </div>
                    
                    <div className="relative z-10 ml-4 text-right flex-shrink-0">
                      <p className={`font-display text-xl font-black italic transition-colors ${
                        selection.serviceId === service.id ? "text-black" : "text-white"
                      }`}>
                        R$ {Number(service.price).toFixed(0)}
                      </p>
                    </div>
                  </button>
                ))}

                {!services?.length && (
                  <div className="text-center py-20">
                    <div className="w-10 h-10 border-2 border-white/5 border-t-white rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-600">Aguardando catálogo...</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              variants={slideVariants}
              custom={1}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="px-6 py-8"
            >
              <div className="mb-8">
                <h2 className="font-display text-4xl font-black uppercase tracking-tighter leading-none">
                  Com quem <br />
                  <span className="text-stroke">Agendar?</span>
                </h2>
                <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] mt-3">Escolha o profissional de sua preferência</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {barbers?.filter(b => b.isActive).map((barber) => (
                  <button
                    key={barber.id}
                    onClick={() => {
                      setSelection(p => ({
                        ...p,
                        barberId: barber.id,
                        barberName: barber.name,
                        barberPhoto: barber.photoUrl || "",
                      }));
                      nextStep();
                    }}
                    className="group relative"
                  >
                    <div className={`aspect-[4/5] overflow-hidden border transition-all duration-500 ${
                      selection.barberId === barber.id
                        ? "border-white"
                        : "border-white/5 grayscale hover:grayscale-0 hover:border-white/20"
                    }`}>
                      {barber.photoUrl ? (
                        <img
                          src={barber.photoUrl}
                          alt={barber.name}
                          className={`w-full h-full object-cover transition-transform duration-700 ${
                            selection.barberId === barber.id ? "scale-110" : "group-hover:scale-105"
                          }`}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-zinc-950">
                          <span className="font-display text-4xl font-black text-zinc-800">
                            {barber.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      
                      <div className={`absolute inset-0 bg-gradient-to-t transition-opacity duration-500 ${
                        selection.barberId === barber.id 
                        ? "from-black via-black/20 to-transparent opacity-100" 
                        : "from-black opacity-60 group-hover:opacity-80"
                      }`} />
                      
                      <div className="absolute bottom-4 left-4 right-4">
                        <p className="font-black text-xs uppercase tracking-[0.15em] text-white leading-tight">
                          {barber.name}
                        </p>
                        <p className="text-[8px] text-zinc-400 uppercase tracking-[0.2em] mt-1 font-bold">Expert</p>
                      </div>

                      {selection.barberId === barber.id && (
                        <motion.div 
                          initial={{ scale: 0, rotate: -45 }}
                          animate={{ scale: 1, rotate: 0 }}
                          className="absolute top-3 right-3 w-6 h-6 bg-white flex items-center justify-center rounded-full shadow-lg"
                        >
                          <Check className="w-3.5 h-3.5 text-black" />
                        </motion.div>
                      )}
                    </div>
                  </button>
                ))}

                {!barbers?.length && (
                  <div className="col-span-2 text-center py-20">
                    <div className="w-10 h-10 border-2 border-white/5 border-t-white rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-600">Convocando time...</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              variants={slideVariants}
              custom={1}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="px-6 py-8"
            >
              <div className="mb-8">
                <h2 className="font-display text-4xl font-black uppercase tracking-tighter leading-none">
                  Escolha o <br />
                  <span className="text-stroke">Horário</span>
                </h2>
                <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] mt-3">Agende sua experiência no melhor momento</p>
              </div>

              {/* Date selector */}
              <div className="overflow-x-auto -mx-6 px-6 mb-8 scrollbar-hide">
                <div className="flex gap-3 pb-4" style={{ width: "max-content" }}>
                  {availableDates.map((date) => {
                    const dateStr = format(date, "yyyy-MM-dd");
                    const isSelected = selection.date === dateStr;
                    const dayName = format(date, "EEE", { locale: ptBR });
                    const dayNum = format(date, "dd");
                    const month = format(date, "MMM", { locale: ptBR });
                    const isSunday = date.getDay() === 0;
                    return (
                      <button
                        key={dateStr}
                        disabled={isSunday}
                        onClick={() => setSelection(p => ({ ...p, date: dateStr, time: "" }))}
                        className={`group flex flex-col items-center justify-center w-[72px] h-[96px] border transition-all duration-300 ${
                          isSunday
                            ? "border-white/5 opacity-20 cursor-not-allowed"
                            : isSelected
                            ? "border-white bg-white text-black"
                            : "border-white/5 bg-zinc-950/50 hover:border-white/20"
                        }`}
                      >
                        <span className={`text-[8px] font-bold uppercase tracking-widest transition-colors ${
                          isSelected ? "text-black/60" : "text-zinc-500"
                        }`}>{dayName}</span>
                        <span className="font-display text-2xl font-black leading-none mt-2">{dayNum}</span>
                        <span className={`text-[8px] uppercase tracking-widest mt-2 transition-colors ${
                          isSelected ? "text-black/60" : "text-zinc-500"
                        }`}>{month}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time slots */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
                    Slots Disponíveis
                  </h3>
                  {selection.time && (
                    <span className="text-[10px] font-black text-white uppercase tracking-wider bg-white/10 px-2 py-0.5 rounded">
                      {selection.time} Selecionado
                    </span>
                  )}
                </div>

                {isLoadingSlots ? (
                  <div className="text-center py-12">
                    <div className="w-8 h-8 border-2 border-white/5 border-t-white rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-600">Consultando agenda...</p>
                  </div>
                ) : slots && slots.length > 0 ? (
                  <div className="grid grid-cols-3 gap-3 pb-10">
                    {slots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setSelection(p => ({ ...p, time: slot }))}
                        className={`py-4 text-[11px] font-black border transition-all duration-300 ${
                          selection.time === slot
                            ? "border-white bg-white text-black"
                            : "border-white/5 bg-zinc-950/50 hover:border-white/20"
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 border border-dashed border-white/10">
                    <Clock className="w-6 h-6 mx-auto mb-3 text-zinc-700" />
                    <p className="text-[10px] uppercase tracking-widest text-zinc-600">Agenda lotada para este dia</p>
                    <p className="text-[9px] text-zinc-700 mt-2 uppercase tracking-wider">Tente uma data alternativa</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              variants={slideVariants}
              custom={1}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="px-6 py-8"
            >
              <div className="mb-8">
                <h2 className="font-display text-4xl font-black uppercase tracking-tighter leading-none">
                  Quase <br />
                  <span className="text-stroke">Tudo Pronto</span>
                </h2>
                <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] mt-3">Revise seus dados e confirme o agendamento</p>
              </div>

              {/* Resumo Estilo Ticket */}
              <div className="relative mb-8 group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-white/10 to-white/5 opacity-50 blur group-hover:opacity-100 transition duration-1000"></div>
                <div className="relative bg-zinc-950 border border-white/10 p-6 space-y-4">
                  <div className="flex justify-between items-start border-b border-white/5 pb-4">
                    <div>
                      <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-zinc-600 mb-1">Serviço</p>
                      <p className="text-xs font-black text-white uppercase tracking-wider">{selection.serviceName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-zinc-600 mb-1">Preço</p>
                      <p className="font-display text-xl font-black italic text-white leading-none">R$ {Number(selection.servicePrice).toFixed(0)}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-zinc-600 mb-1">Barbeiro</p>
                      <p className="text-[10px] font-black text-white uppercase tracking-wider">{selection.barberName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-zinc-600 mb-1">Horário</p>
                      <p className="text-[10px] font-black text-white uppercase tracking-wider">
                        {format(new Date(selection.date + "T12:00:00"), "dd/MM")} – {selection.time}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleBooking} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold uppercase tracking-[0.3em] text-zinc-500 flex items-center gap-2">
                    <User className="w-3 h-3" />
                    Seu Nome
                  </label>
                  <input
                    type="text"
                    required
                    value={selection.clientName}
                    onChange={(e) => setSelection(p => ({ ...p, clientName: e.target.value }))}
                    placeholder="DIGITE SEU NOME COMPLETO"
                    className="w-full bg-zinc-950 border border-white/5 px-4 py-4 text-xs text-white placeholder:text-zinc-800 focus:outline-none focus:border-white/30 focus:bg-zinc-900 transition-all uppercase tracking-widest"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold uppercase tracking-[0.3em] text-zinc-500 flex items-center gap-2">
                    <Phone className="w-3 h-3" />
                    WhatsApp
                  </label>
                  <input
                    type="tel"
                    required
                    value={selection.clientPhone}
                    onChange={(e) => setSelection(p => ({ ...p, clientPhone: e.target.value }))}
                    placeholder="(00) 00000-0000"
                    className="w-full bg-zinc-950 border border-white/5 px-4 py-4 text-xs text-white placeholder:text-zinc-800 focus:outline-none focus:border-white/30 focus:bg-zinc-900 transition-all tracking-widest"
                  />
                </div>

                {bookingMutation.error && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-[9px] font-black uppercase tracking-widest text-center"
                  >
                    Ocorreu um erro. Tente novamente.
                  </motion.p>
                )}

                <button
                  type="submit"
                  disabled={bookingMutation.isPending}
                  className="w-full py-5 bg-white text-black font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 disabled:opacity-50 transition-transform active:scale-[0.98] mt-4 shadow-xl"
                >
                  {bookingMutation.isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      Confirmar Agora
                      <Check className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          )}

          {/* STEP 5 — Sucesso */}
          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="px-8 py-16 flex flex-col items-center justify-center min-h-[60vh] text-center"
            >
              <div className="relative mb-10">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
                  className="w-24 h-24 rounded-full bg-white flex items-center justify-center z-10 relative"
                >
                  <CheckCircle2 className="w-12 h-12 text-black" />
                </motion.div>
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-white rounded-full blur-xl -z-0"
                />
              </div>

              <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-zinc-600 mb-4 block">
                Agendamento Confirmado
              </span>
              <h2 className="font-display text-5xl font-black uppercase tracking-tighter leading-[0.9] mb-6">
                Tudo <br />
                <span className="text-stroke">Pronto!</span>
              </h2>
              
              <div className="w-full bg-zinc-950 border border-white/5 p-6 mb-8 text-left space-y-4">
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                  <span className="text-[9px] text-zinc-600 uppercase tracking-widest font-bold">Reserva</span>
                  <span className="text-[9px] font-black text-white uppercase tracking-wider">#{Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
                </div>
                <p className="text-xs text-zinc-400 uppercase tracking-widest leading-relaxed">
                  Agendado para <strong className="text-white">{format(new Date(selection.date + "T12:00:00"), "dd/MM")} às {selection.time}</strong> com {selection.barberName}.
                </p>
                <p className="text-[9px] text-zinc-600 uppercase tracking-widest leading-relaxed">
                  Enviamos os detalhes para seu WhatsApp. Nos vemos em breve!
                </p>
              </div>

              <button
                onClick={() => {
                  setStep(1);
                  setSelection({
                    serviceId: "", serviceName: "", servicePrice: 0, serviceDuration: 0,
                    barberId: "", barberName: "", barberPhoto: "",
                    date: format(new Date(), "yyyy-MM-dd"), time: "",
                    clientName: "", clientPhone: "",
                  });
                }}
                className="w-full py-5 border border-white/10 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all duration-500 shadow-lg"
              >
                Voltar ao Início
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        </main>

        {/* Dynamic Mobile Footer Action */}
        <AnimatePresence>
          {selection.time && step === 3 && (
            <motion.div 
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/95 to-transparent z-50"
            >
              <button
                onClick={nextStep}
                className="w-full py-5 bg-white text-black font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors shadow-xl"
              >
                Continuar para Dados
                <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
