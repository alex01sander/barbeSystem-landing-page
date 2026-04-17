"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getClients, deleteClient } from "@/services/api";
import { 
  Users, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  CalendarPlus, 
  History,
  Phone,
  Mail,
  MoreVertical
} from "lucide-react";
import { ClientModal } from "@/components/clients/ClientModal";
import { AppointmentModal } from "@/components/appointments/AppointmentModal";
import { motion } from "framer-motion";
import { Client } from "@/types";

export default function ClientsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isApptModalOpen, setIsApptModalOpen] = useState(false);
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

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

  const filteredClients = clients?.filter(client => 
    client.name.toLowerCase().includes(search.toLowerCase()) ||
    client.phone.includes(search)
  );

  function handleEdit(client: Client) {
    setClientToEdit(client);
    setIsClientModalOpen(true);
  }

  function handleNew() {
    setClientToEdit(null);
    setIsClientModalOpen(true);
  }

  function handleNewAppointment(clientId: string) {
    setSelectedClientId(clientId);
    setIsApptModalOpen(true);
  }

  function handleDelete(id: string) {
    if (confirm("Deseja realmente excluir este cliente? Toda o histórico associado será mantido, mas o cliente não poderá ser editado.")) {
      deleteMutation.mutate(id);
    }
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header com Filtros */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gold">Clientes</h1>
          <p className="text-muted mt-1">Gerencie a base de frequentadores da sua melhor barbearia</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input 
              type="text" 
              placeholder="Buscar por nome ou fone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-secondary border border-white/10 rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:border-primary/50 text-sm w-64"
            />
          </div>
          
          <button 
            onClick={handleNew}
            className="gold-gradient text-black font-bold px-5 py-2 rounded-xl flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <Plus className="w-5 h-5" />
            Novo Cliente
          </button>
        </div>
      </header>

      {/* Grid de Clientes (ou Tabela) */}
      <div className="glass rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-muted text-sm text-left font-medium">
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">Contato</th>
                <th className="px-6 py-4">Última Visita</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-muted">Carregando clientes...</td>
                </tr>
              ) : filteredClients?.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-muted">Nenhum cliente encontrado.</td>
                </tr>
              ) : (
                filteredClients?.map((client) => (
                  <tr key={client.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-secondary border border-white/10 flex items-center justify-center font-bold text-primary">
                          {client.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold">{client.name}</p>
                          <p className="text-xs text-muted">{client.email || 'Sem e-mail'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-3.5 h-3.5 text-muted" />
                        {client.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted italic">
                      Coming soon...
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button 
                           onClick={() => handleNewAppointment(client.id)}
                           title="Novo Agendamento"
                           className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-black transition-all"
                         >
                           <CalendarPlus className="w-4 h-4" />
                         </button>
                         <button 
                           onClick={() => handleEdit(client)}
                           title="Editar"
                           className="p-2 bg-white/5 text-muted rounded-lg hover:text-white transition-all"
                         >
                           <Edit2 className="w-4 h-4" />
                         </button>
                         <button 
                           onClick={() => handleDelete(client.id)}
                           title="Excluir"
                           className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                         >
                           <Trash2 className="w-4 h-4" />
                         </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ClientModal 
        isOpen={isClientModalOpen} 
        onClose={() => setIsClientModalOpen(false)} 
        clientToEdit={clientToEdit}
      />

      <AppointmentModal 
        isOpen={isApptModalOpen} 
        onClose={() => setIsApptModalOpen(false)}
        // Pre-selecting the client is not yet supported in AppointmentModal but we could add it
      />
    </div>
  );
}
