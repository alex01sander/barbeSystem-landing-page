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
    <div className="min-h-screen bg-black text-white flex flex-col font-body">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/95 backdrop-blur border-b border-white/5 px-4 py-4">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          {step > 1 && step < 5 ? (
            <button onClick={prevStep} className="w-9 h-9 flex items-center justify-center border border-white/10 rounded-full hover:border-white/30 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
          ) : (
            <div className="w-9" />
          )}

          <div className="text-center">
            <h1 className="font-display text-base font-black uppercase tracking-widest">
              IDALGO<span className="text-zinc-600">CORTES</span>
            </h1>
            {step < 5 && (
              <p className="text-[9px] text-zinc-600 uppercase tracking-[0.2em] mt-0.5">
                Agendamento — Passo {step} de {totalSteps}
              </p>
            )}
          </div>

          <div className="w-9" />
        </div>

        {/* Progress bar */}
        {step < 5 && (
          <div className="mt-3 max-w-lg mx-auto">
            <div className="h-[1px] bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-white"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          {/* STEP 1 — Escolher Serviço */}
          {step === 1 && (
            <motion.div
              key="step1"
              variants={slideVariants}
              custom={1}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="px-4 py-6 max-w-lg mx-auto"
            >
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-1">
                  <Scissors className="w-4 h-4 text-zinc-500" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">Passo 1</span>
                </div>
                <h2 className="font-display text-2xl font-black uppercase tracking-tighter">Escolha o Serviço</h2>
              </div>

              <div className="space-y-2">
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
                    className={`w-full flex items-center justify-between p-4 border transition-all duration-300 text-left ${
                      selection.serviceId === service.id
                        ? "border-white bg-white/5"
                        : "border-white/10 hover:border-white/30"
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-sm uppercase tracking-wider truncate">{service.name}</p>
                      <p className="text-[10px] text-zinc-500 mt-0.5 uppercase tracking-wider">
                        {service.durationMinutes} min
                        {service.description && ` • ${service.description}`}
                      </p>
                    </div>
                    <div className="ml-4 text-right flex-shrink-0">
                      <p className="font-display text-lg font-black italic">R$ {Number(service.price).toFixed(0)}</p>
                    </div>
                  </button>
                ))}

                {!services?.length && (
                  <div className="text-center py-12 text-zinc-600">
                    <Scissors className="w-8 h-8 mx-auto mb-3 opacity-30" />
                    <p className="text-xs uppercase tracking-widest">Carregando serviços...</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* STEP 2 — Escolher Barbeiro */}
          {step === 2 && (
            <motion.div
              key="step2"
              variants={slideVariants}
              custom={1}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="px-4 py-6 max-w-lg mx-auto"
            >
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-1">
                  <User className="w-4 h-4 text-zinc-500" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">Passo 2</span>
                </div>
                <h2 className="font-display text-2xl font-black uppercase tracking-tighter">Escolha o Barbeiro</h2>
              </div>

              <div className="grid grid-cols-2 gap-3">
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
                    className={`relative overflow-hidden border transition-all duration-300 ${
                      selection.barberId === barber.id
                        ? "border-white"
                        : "border-white/10 hover:border-white/30"
                    }`}
                  >
                    <div className="aspect-[3/4] bg-zinc-900 relative">
                      {barber.photoUrl ? (
                        <img
                          src={barber.photoUrl}
                          alt={barber.name}
                          className="w-full h-full object-cover grayscale"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="font-display text-4xl font-black text-zinc-800">
                            {barber.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3">
                        <p className="font-black text-xs uppercase tracking-wider text-white leading-tight">{barber.name}</p>
                        <p className="text-[8px] text-zinc-400 uppercase tracking-widest mt-0.5">Especialista</p>
                      </div>
                      {selection.barberId === barber.id && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-white rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-black" />
                        </div>
                      )}
                    </div>
                  </button>
                ))}

                {!barbers?.length && (
                  <div className="col-span-2 text-center py-12 text-zinc-600">
                    <User className="w-8 h-8 mx-auto mb-3 opacity-30" />
                    <p className="text-xs uppercase tracking-widest">Carregando barbeiros...</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* STEP 3 — Data e Hora */}
          {step === 3 && (
            <motion.div
              key="step3"
              variants={slideVariants}
              custom={1}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="px-4 py-6 max-w-lg mx-auto"
            >
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-1">
                  <CalendarDays className="w-4 h-4 text-zinc-500" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">Passo 3</span>
                </div>
                <h2 className="font-display text-2xl font-black uppercase tracking-tighter">Data e Horário</h2>
              </div>

              {/* Date selector */}
              <div className="overflow-x-auto -mx-4 px-4 mb-6">
                <div className="flex gap-2 pb-2" style={{ width: "max-content" }}>
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
                        className={`flex flex-col items-center px-3 py-3 border transition-all duration-200 min-w-[60px] ${
                          isSunday
                            ? "border-white/5 opacity-30 cursor-not-allowed"
                            : isSelected
                            ? "border-white bg-white text-black"
                            : "border-white/10 hover:border-white/30"
                        }`}
                      >
                        <span className="text-[8px] font-bold uppercase tracking-widest opacity-60">{dayName}</span>
                        <span className="font-display text-xl font-black leading-none mt-1">{dayNum}</span>
                        <span className="text-[8px] uppercase tracking-widest opacity-60 mt-1">{month}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time slots */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500 mb-3">
                  <Clock className="w-3 h-3 inline mr-1" />
                  Horários disponíveis
                </p>
                {isLoadingSlots ? (
                  <div className="text-center py-8">
                    <div className="w-6 h-6 border border-white/20 border-t-white rounded-full animate-spin mx-auto" />
                    <p className="text-xs text-zinc-600 mt-3 uppercase tracking-widest">Verificando...</p>
                  </div>
                ) : slots && slots.length > 0 ? (
                  <div className="grid grid-cols-4 gap-2">
                    {slots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setSelection(p => ({ ...p, time: slot }))}
                        className={`py-2.5 text-xs font-black border transition-all duration-200 ${
                          selection.time === slot
                            ? "border-white bg-white text-black"
                            : "border-white/10 hover:border-white/30"
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-zinc-600">
                    <Clock className="w-6 h-6 mx-auto mb-2 opacity-30" />
                    <p className="text-xs uppercase tracking-widest">Nenhum horário disponível</p>
                    <p className="text-[9px] text-zinc-700 mt-1 uppercase tracking-wider">Selecione outra data</p>
                  </div>
                )}
              </div>

              {/* Next button */}
              {selection.time && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={nextStep}
                  className="mt-6 w-full py-4 bg-white text-black font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-2"
                >
                  Confirmar horário {selection.time}
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              )}
            </motion.div>
          )}

          {/* STEP 4 — Dados pessoais e confirmação */}
          {step === 4 && (
            <motion.div
              key="step4"
              variants={slideVariants}
              custom={1}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="px-4 py-6 max-w-lg mx-auto"
            >
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-1">
                  <Check className="w-4 h-4 text-zinc-500" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">Passo 4</span>
                </div>
                <h2 className="font-display text-2xl font-black uppercase tracking-tighter">Seus Dados</h2>
              </div>

              {/* Resumo */}
              <div className="bg-zinc-950 border border-white/5 p-4 mb-6 space-y-2">
                <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-zinc-600 mb-3">Resumo do agendamento</p>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Serviço</span>
                  <span className="text-[10px] font-black text-white uppercase tracking-wider">{selection.serviceName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Barbeiro</span>
                  <span className="text-[10px] font-black text-white uppercase tracking-wider">{selection.barberName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Data</span>
                  <span className="text-[10px] font-black text-white uppercase tracking-wider">
                    {format(new Date(selection.date + "T12:00:00"), "dd/MM/yyyy")}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Horário</span>
                  <span className="text-[10px] font-black text-white uppercase tracking-wider">{selection.time}</span>
                </div>
                <div className="border-t border-white/5 pt-2 mt-2 flex justify-between items-center">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Total</span>
                  <span className="font-display text-lg font-black italic text-white">R$ {Number(selection.servicePrice).toFixed(0)}</span>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleBooking} className="space-y-3">
                <div>
                  <label className="text-[9px] font-bold uppercase tracking-[0.3em] text-zinc-500 block mb-1.5">Seu nome</label>
                  <input
                    type="text"
                    required
                    value={selection.clientName}
                    onChange={(e) => setSelection(p => ({ ...p, clientName: e.target.value }))}
                    placeholder="Nome completo"
                    className="w-full bg-zinc-950 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-white/40 transition-colors uppercase tracking-wider"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-bold uppercase tracking-[0.3em] text-zinc-500 block mb-1.5">
                    <Phone className="w-3 h-3 inline mr-1" />
                    WhatsApp
                  </label>
                  <input
                    type="tel"
                    required
                    value={selection.clientPhone}
                    onChange={(e) => setSelection(p => ({ ...p, clientPhone: e.target.value }))}
                    placeholder="(00) 00000-0000"
                    className="w-full bg-zinc-950 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-white/40 transition-colors tracking-wider"
                  />
                </div>

                {bookingMutation.error && (
                  <p className="text-red-400 text-[10px] uppercase tracking-wider">
                    Erro ao agendar. Tente novamente.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={bookingMutation.isPending}
                  className="w-full py-4 bg-white text-black font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                >
                  {bookingMutation.isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                      Agendando...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Confirmar Agendamento
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
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="px-4 py-12 max-w-lg mx-auto flex flex-col items-center justify-center min-h-[70vh] text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 rounded-full bg-white flex items-center justify-center mb-8"
              >
                <CheckCircle2 className="w-10 h-10 text-black" />
              </motion.div>

              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-600 mb-4 block">
                Confirmado
              </span>
              <h2 className="font-display text-3xl font-black uppercase tracking-tighter mb-2">
                Agendamento <br />
                <span className="text-stroke">Realizado!</span>
              </h2>
              <p className="text-xs text-zinc-500 uppercase tracking-widest mt-4 max-w-xs leading-relaxed">
                Nos vemos em <strong className="text-white">{format(new Date(selection.date + "T12:00:00"), "dd/MM")} às {selection.time}</strong> com {selection.barberName}.
              </p>

              <div className="mt-10 bg-zinc-950 border border-white/5 p-6 w-full space-y-3">
                <div className="flex justify-between">
                  <span className="text-[9px] text-zinc-600 uppercase tracking-wider">Serviço</span>
                  <span className="text-[9px] font-black text-white uppercase">{selection.serviceName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[9px] text-zinc-600 uppercase tracking-wider">Barbeiro</span>
                  <span className="text-[9px] font-black text-white uppercase">{selection.barberName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[9px] text-zinc-600 uppercase tracking-wider">Data e hora</span>
                  <span className="text-[9px] font-black text-white uppercase">
                    {format(new Date(selection.date + "T12:00:00"), "dd/MM/yyyy")} – {selection.time}
                  </span>
                </div>
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
                className="mt-8 w-full py-4 border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all duration-300"
              >
                Fazer novo agendamento
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
