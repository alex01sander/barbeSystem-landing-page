"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getClients, deleteClient } from "@/services/api";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  User, 
  Phone, 
  Mail,
  Calendar,
  MoreVertical
} from "lucide-react";
import { ClientModal } from "@/components/clients/ClientModal";
import { motion, AnimatePresence } from "framer-motion";
import { Client } from "@/types";

export default function ClientsPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: clients, isLoading } = useQuery({
    queryKey: ["clients"],
    queryFn: getClients
  });

  const deleteMutation = useMutation({
    mutationFn: deleteClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    }
  });

  const filteredClients = clients?.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function handleEdit(client: Client) {
    setClientToEdit(client);
    setIsModalOpen(true);
  }

  function handleNew() {
    setClientToEdit(null);
    setIsModalOpen(true);
  }

  function handleDelete(id: string) {
    if (confirm("Deseja realmente remover este cliente?")) {
      deleteMutation.mutate(id);
    }
  }

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Base de Clientes</h1>
          <p className="text-muted text-sm mt-1">Gerencie o histórico e informações de contato.</p>
        </div>

        <button 
          onClick={handleNew}
          className="flex items-center justify-center gap-2 bg-white text-black font-bold h-12 px-6 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-white/5"
        >
          <Plus className="w-5 h-5" />
          Novo Cliente
        </button>
      </header>

      {/* Busca e Tabela */}
      <div className="space-y-6">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input 
            type="text"
            placeholder="Buscar por nome, telefone ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-secondary/30 border border-border rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-zinc-500 transition-all font-sans"
          />
        </div>

        <div className="bg-secondary/10 border border-border rounded-3xl overflow-hidden">
           {isLoading ? (
             <div className="py-20 text-center text-muted italic font-medium">Sincronizando clientes...</div>
           ) : filteredClients?.length === 0 ? (
             <div className="py-20 text-center text-muted italic font-medium">Nenhum cliente encontrado</div>
           ) : (
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="border-b border-border bg-secondary/30">
                    <th className="px-8 py-4 text-[10px] font-bold text-muted uppercase tracking-[0.2em]">Nome</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-muted uppercase tracking-[0.2em]">Contato</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-muted uppercase tracking-[0.2em]">Última Visita</th>
                    <th className="px-8 py-4 text-right text-[10px] font-bold text-muted uppercase tracking-[0.2em]">Ações</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-border/50 font-sans">
                 {filteredClients?.map((c) => (
                    <tr key={c.id} className="hover:bg-secondary/20 transition-colors group">
                       <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-xl bg-secondary border border-border flex items-center justify-center font-bold text-xs text-muted group-hover:text-white transition-colors">
                                {c.name.charAt(0)}
                             </div>
                             <h4 className="font-semibold text-sm">{c.name}</h4>
                          </div>
                       </td>
                       <td className="px-8 py-5">
                          <div className="space-y-1">
                             <div className="flex items-center gap-2 text-xs font-medium">
                                <Phone className="w-3 h-3 text-muted" />
                                <span>{c.phone}</span>
                             </div>
                             {c.email && (
                               <div className="flex items-center gap-2 text-[11px] text-muted">
                                  <Mail className="w-3 h-3" />
                                  <span>{c.email}</span>
                               </div>
                             )}
                          </div>
                       </td>
                       <td className="px-8 py-5">
                          <div className="flex items-center gap-2 text-xs text-muted font-medium">
                             <Calendar className="w-3.5 h-3.5" />
                             <span>N/A</span>
                          </div>
                       </td>
                       <td className="px-8 py-5 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button 
                                onClick={() => handleEdit(c)}
                                className="p-2.5 bg-secondary border border-border rounded-lg hover:border-zinc-500 transition-colors"
                             >
                                <Edit2 className="w-4 h-4 text-muted hover:text-white" />
                             </button>
                             <button 
                                onClick={() => handleDelete(c.id)}
                                className="p-2.5 bg-secondary border border-border rounded-lg hover:border-red-500/20 hover:bg-red-500/10 transition-colors"
                             >
                                <Trash2 className="w-4 h-4 text-muted hover:text-red-500" />
                             </button>
                          </div>
                       </td>
                    </tr>
                 ))}
               </tbody>
             </table>
           )}
        </div>
      </div>

      <ClientModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        clientToEdit={clientToEdit}
      />
    </div>
  );
}
