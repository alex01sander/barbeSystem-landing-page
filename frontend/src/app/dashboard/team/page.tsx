"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBarbers, deleteBarber } from "@/services/api";
import { 
  Plus, 
  Edit2, 
  Trash2,
  Scissors,
  User as UserIcon,
  Calendar
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
    if (confirm("Deseja realmente remover este barbeiro?")) {
      deleteMutation.mutate(id);
    }
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gold">Profissionais</h1>
          <p className="text-muted mt-1">Gerencie a equipe de barbeiros que aparecem no seu catálogo</p>
        </div>

        <button 
          onClick={handleNew}
          className="gold-gradient text-black font-bold px-5 py-2 rounded-xl flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <Plus className="w-5 h-5" />
          Novo Barbeiro
        </button>
      </header>

      {/* Grid de Barbeiros */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {isLoading ? (
            <div className="col-span-full py-12 text-center text-muted italic">Carregando lista de profissionais...</div>
          ) : barbers?.length === 0 ? (
            <div className="col-span-full py-12 text-center text-muted italic">Nenhum barbeiro cadastrado.</div>
          ) : (
            barbers?.map((barber) => (
              <motion.div 
                key={barber.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="glass p-6 rounded-2xl border border-white/10 group relative hover:border-primary/40 transition-all flex flex-col items-center text-center"
              >
                {/* Foto Profile */}
                <div className="w-24 h-24 rounded-full border-2 border-primary/20 p-1 mb-4 overflow-hidden bg-secondary">
                  {barber.photoUrl ? (
                    <img src={barber.photoUrl} alt={barber.name} className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <div className="w-full h-full rounded-full bg-white/5 flex items-center justify-center">
                      <UserIcon className="w-8 h-8 text-muted" />
                    </div>
                  )}
                </div>

                <h3 className="font-bold text-lg mb-1">{barber.name}</h3>
                
                <div className="flex items-center gap-4 text-xs text-muted mb-6">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> {barber.age ? `${barber.age} anos` : 'Idade não informada'}
                  </span>
                </div>

                <div className="flex items-center gap-2 w-full">
                   <button 
                    onClick={() => handleEdit(barber)}
                    className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-muted hover:text-white rounded-lg transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Editar
                  </button>
                  <button 
                    onClick={() => handleDelete(barber.id)}
                    className="p-2 border border-white/5 hover:border-red-500/30 hover:bg-red-500/10 text-muted hover:text-red-500 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Scissors className="w-4 h-4 text-primary/40" />
                </div>
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
