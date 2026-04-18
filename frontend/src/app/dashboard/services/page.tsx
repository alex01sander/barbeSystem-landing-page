"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getServices, deleteService } from "@/services/api";
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Scissors, 
  Clock, 
  DollarSign,
  Tag
} from "lucide-react";
import { ServiceModal } from "@/components/services/ServiceModal";
import { motion, AnimatePresence } from "framer-motion";
import { Service } from "@/types";

export default function ServicesPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [serviceToEdit, setServiceToEdit] = useState<Service | null>(null);

  const { data: services, isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: getServices
  });

  const deleteMutation = useMutation({
    mutationFn: deleteService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    }
  });

  function handleEdit(service: Service) {
    setServiceToEdit(service);
    setIsModalOpen(true);
  }

  function handleNew() {
    setServiceToEdit(null);
    setIsModalOpen(true);
  }

  function handleDelete(id: string) {
    if (confirm("Deseja realmente remover este serviço do catálogo?")) {
      deleteMutation.mutate(id);
    }
  }

  return (
    <div className="space-y-10 max-w-5xl">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Serviços</h1>
          <p className="text-muted text-sm mt-1">Defina os procedimentos, preços e durações oferecidos.</p>
        </div>

        <button 
          onClick={handleNew}
          className="flex items-center justify-center gap-2 bg-white text-black font-bold h-12 px-6 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-white/5"
        >
          <Plus className="w-5 h-5" />
          Novo Serviço
        </button>
      </header>

      {/* Grid de Serviços */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence>
          {isLoading ? (
            <div className="col-span-full py-20 text-center text-muted italic font-medium">Sincronizando catálogo...</div>
          ) : services?.length === 0 ? (
            <div className="col-span-full py-20 text-center text-muted italic font-medium">Nenhum serviço disponível</div>
          ) : (
            services?.map((service) => (
              <motion.div 
                key={service.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="p-8 bg-secondary/20 border border-border rounded-3xl hover:border-zinc-700 transition-all group relative"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-4">
                    <div>
                        <span className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-2 block">Categoria — Geral</span>
                        <h3 className="text-xl font-bold tracking-tight">{service.name}</h3>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2 text-primary font-bold">
                        <DollarSign className="w-4 h-4" />
                        <span>R$ {Number(service.price).toFixed(2)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted font-medium text-xs uppercase tracking-widest">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{service.durationMinutes} minutos</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleEdit(service)}
                      className="p-3 bg-white text-black rounded-xl hover:opacity-80 transition-opacity"
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(service.id)}
                      className="p-3 bg-secondary border border-border rounded-xl text-muted hover:text-red-500 hover:border-red-500/20 transition-colors"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="absolute bottom-6 right-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Scissors className="w-12 h-12" />
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <ServiceModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        serviceToEdit={serviceToEdit}
      />
    </div>
  );
}
