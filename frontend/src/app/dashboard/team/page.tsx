"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBarbers, deleteBarber } from "@/services/api";
import { 
  Plus, 
  Edit2, 
  Trash2, 
  User, 
  UserCheck, 
  UserX,
  Camera,
  Star
} from "lucide-react";
import { BarberModal } from "@/components/team/BarberModal";
import { motion, AnimatePresence } from "framer-motion";
import { Barber } from "@/types";

export default function TeamPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [barberToEdit, setBarberToEdit] = useState<Barber | null>(null);

  const { data: barbers, isLoading } = useQuery({
    queryKey: ["barbers"],
    queryFn: getBarbers
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBarber,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["barbers"] });
    }
  });

  function handleEdit(barber: Barber) {
    setBarberToEdit(barber);
    setIsModalOpen(true);
  }

  function handleNew() {
    setBarberToEdit(null);
    setIsModalOpen(true);
  }

  function handleDelete(id: string) {
    if (confirm("Deseja realmente remover este profissional da equipe?")) {
      deleteMutation.mutate(id);
    }
  }

  return (
    <div className="space-y-10 max-w-6xl">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Equipe Profissional</h1>
          <p className="text-muted text-sm mt-1">Gerencie os profissionais e suas permissões de acesso.</p>
        </div>

        <button 
          onClick={handleNew}
          className="flex items-center justify-center gap-2 bg-white text-black font-bold h-12 px-6 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-white/5"
        >
          <Plus className="w-5 h-5" />
          Novo Barbeiro
        </button>
      </header>

      {/* Grid de Profissionais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {isLoading ? (
            <div className="col-span-full py-20 text-center text-muted italic font-medium">Carregando equipe...</div>
          ) : barbers?.length === 0 ? (
            <div className="col-span-full py-20 text-center text-muted italic font-medium">Nenhum profissional cadastrado</div>
          ) : (
            barbers?.map((barber) => (
              <motion.div 
                key={barber.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group p-6 bg-secondary/20 border border-border rounded-3xl hover:border-zinc-700 transition-all text-center relative overflow-hidden"
              >
                <div className="relative mb-6 mx-auto w-24 h-24">
                   {barber.photoUrl ? (
                      <img 
                        src={barber.photoUrl} 
                        alt={barber.name} 
                        className="w-24 h-24 rounded-2xl object-cover grayscale group-hover:grayscale-0 transition-all border border-border ring-4 ring-secondary"
                      />
                   ) : (
                     <div className="w-24 h-24 rounded-2xl bg-secondary border border-border flex items-center justify-center text-muted">
                        <User className="w-10 h-10" />
                     </div>
                   )}
                   <div className={`absolute -bottom-1 -right-1 p-1 rounded-full border-2 border-secondary ${barber.isActive ? 'bg-green-500' : 'bg-red-500'} w-4 h-4`} />
                </div>

                <div className="space-y-1 mb-8">
                  <h3 className="text-lg font-bold tracking-tight">{barber.name}</h3>
                  <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-muted uppercase tracking-widest">
                     <Star className="w-3 h-3 text-primary" />
                     Especialista {barber.age ? `• ${barber.age} anos` : ""}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-auto">
                   <button 
                      onClick={() => handleEdit(barber)}
                      className="py-2.5 bg-secondary border border-border rounded-xl text-xs font-bold uppercase tracking-widest hover:border-zinc-500 transition-all"
                   >
                      Editar
                   </button>
                   <button 
                      onClick={() => handleDelete(barber.id)}
                      className="py-2.5 bg-secondary border border-border rounded-xl text-xs font-bold uppercase tracking-widest text-muted hover:text-red-500 hover:border-red-500/20 transition-all"
                   >
                      Remover
                   </button>
                </div>
                
                {!barber.isActive && (
                   <div className="absolute top-4 left-4">
                      <span className="text-[10px] font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20 uppercase tracking-widest">Inativo</span>
                   </div>
                )}
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <BarberModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        barberToEdit={barberToEdit}
      />
    </div>
  );
}
