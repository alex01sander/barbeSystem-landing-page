"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getServices, deleteService } from "@/services/api";
import { 
  Scissors, 
  Plus, 
  Clock, 
  DollarSign, 
  Edit2, 
  Trash2, 
  Eye, 
  EyeOff,
  AlertCircle
} from "lucide-react";
import { ServiceModal } from "@/components/services/ServiceModal";
import { motion, AnimatePresence } from "framer-motion";
import { Service } from "@/types";

export default function ServicesPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [serviceToEdit, setServiceToEdit] = useState<Service | null>(null);
  const [showInactives, setShowInactives] = useState(true);

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

  const filteredServices = services?.filter(s => showInactives || s.isActive);

  function handleEdit(service: Service) {
    setServiceToEdit(service);
    setIsModalOpen(true);
  }

  function handleNew() {
    setServiceToEdit(null);
    setIsModalOpen(true);
  }

  function handleDelete(id: string) {
    if (confirm("Inativar este serviço impedirá novos agendamentos, mas manterá o histórico. Deseja continuar?")) {
      deleteMutation.mutate(id);
    }
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gold">Serviços</h1>
          <p className="text-muted mt-1">Configure o catálogo, preços e durações dos seus atendimentos</p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowInactives(!showInactives)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all text-sm font-medium ${showInactives ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-secondary border-white/10 text-muted'}`}
          >
            {showInactives ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            {showInactives ? "Exibindo Inativos" : "Ocultando Inativos"}
          </button>
          
          <button 
            onClick={handleNew}
            className="gold-gradient text-black font-bold px-5 py-2 rounded-xl flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <Plus className="w-5 h-5" />
            Novo Serviço
          </button>
        </div>
      </header>

      {/* Grid de Serviços */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {isLoading ? (
            <div className="col-span-full py-12 text-center text-muted italic">Carregando catálogo de serviços...</div>
          ) : filteredServices?.length === 0 ? (
            <div className="col-span-full py-12 text-center text-muted italic">Nenhum serviço encontrado.</div>
          ) : (
            filteredServices?.map((service) => (
              <motion.div 
                key={service.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`glass p-6 rounded-2xl border transition-all group relative ${!service.isActive ? 'opacity-60 border-dashed border-white/20' : 'border-white/10 hover:border-primary/40'}`}
              >
                {!service.isActive && (
                  <div className="absolute top-3 right-3 bg-red-500/10 text-red-500 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                    Inativo
                  </div>
                )}
                
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${service.isActive ? 'bg-primary/10 text-primary' : 'bg-secondary text-muted'}`}>
                    <Scissors className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-tight">{service.name}</h3>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {service.durationMinutes} min
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-2xl font-black text-gold">
                    <span className="text-xs font-normal text-muted mr-1">R$</span>
                    {Number(service.price).toFixed(2)}
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleEdit(service)}
                      className="p-2 hover:bg-white/10 rounded-lg text-muted hover:text-white transition-colors"
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    {service.isActive && (
                      <button 
                        onClick={() => handleDelete(service.id)}
                        className="p-2 hover:bg-red-500/10 rounded-lg text-muted hover:text-red-500 transition-colors"
                        title="Inativar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
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
