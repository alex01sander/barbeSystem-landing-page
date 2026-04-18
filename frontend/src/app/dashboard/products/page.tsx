"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProducts, deleteProduct } from "@/services/api";
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Package, 
  AlertTriangle,
  Database,
  Search,
  ArrowRight
} from "lucide-react";
import { ProductModal } from "@/components/products/ProductModal";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/types";

export default function ProductsPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    }
  });

  const filteredProducts = products?.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function handleEdit(product: Product) {
    setProductToEdit(product);
    setIsModalOpen(true);
  }

  function handleNew() {
    setProductToEdit(null);
    setIsModalOpen(true);
  }

  function handleDelete(id: string) {
    if (confirm("Deseja realmente remover este produto do estoque?")) {
      deleteMutation.mutate(id);
    }
  }

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Produtos & Estoque</h1>
          <p className="text-muted text-sm mt-1">Gerencie seu inventário e venda de itens físicos.</p>
        </div>

        <button 
          onClick={handleNew}
          className="flex items-center justify-center gap-2 bg-white text-black font-bold h-12 px-6 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-white/5"
        >
          <Plus className="w-5 h-5" />
          Novo Produto
        </button>
      </header>

      {/* Busca e Tabela */}
      <div className="space-y-6">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input 
            type="text"
            placeholder="Buscar por nome ou descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-secondary/30 border border-border rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-zinc-500 transition-all"
          />
        </div>

        <div className="bg-secondary/10 border border-border rounded-3xl overflow-hidden">
           {isLoading ? (
             <div className="py-20 text-center text-muted italic font-medium">Carregando inventário...</div>
           ) : filteredProducts?.length === 0 ? (
             <div className="py-20 text-center text-muted italic font-medium">Nenhum produto encontrado</div>
           ) : (
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="border-b border-border bg-secondary/30">
                    <th className="px-8 py-4 text-[10px] font-bold text-muted uppercase tracking-[0.2em]">Produto</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-muted uppercase tracking-[0.2em]">Preço</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-muted uppercase tracking-[0.2em]">Disponível</th>
                    <th className="px-8 py-4 text-right text-[10px] font-bold text-muted uppercase tracking-[0.2em]">Ações</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-border/50 font-sans">
                 {filteredProducts?.map((p) => (
                    <tr key={p.id} className="hover:bg-secondary/20 transition-colors group">
                       <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                             <div className="p-2.5 bg-secondary border border-border rounded-lg text-muted group-hover:text-white transition-colors">
                                <Package className="w-5 h-5" />
                             </div>
                             <div>
                                <h4 className="font-semibold text-sm">{p.name}</h4>
                                <p className="text-[11px] text-muted truncate max-w-[200px] mt-0.5">{p.description || "Sem descrição"}</p>
                             </div>
                          </div>
                       </td>
                       <td className="px-8 py-5">
                          <span className="text-sm font-bold">R$ {Number(p.price).toFixed(2)}</span>
                       </td>
                       <td className="px-8 py-5">
                          <div className="flex items-center gap-2">
                             <span className={`text-sm font-bold ${p.stock <= 3 ? 'text-red-400' : 'text-white'}`}>
                                {p.stock}
                             </span>
                             <span className="text-[10px] font-bold text-muted uppercase tracking-widest">{p.unit}</span>
                             {p.stock <= 3 && (
                               <div className="ml-2 p-1 bg-red-400/10 text-red-400 border border-red-400/20 rounded-md">
                                  <AlertTriangle className="w-3 h-3" />
                               </div>
                             )}
                          </div>
                       </td>
                       <td className="px-8 py-5 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button 
                                onClick={() => handleEdit(p)}
                                className="p-2.5 bg-secondary border border-border rounded-lg hover:border-zinc-500 transition-colors"
                             >
                                <Edit2 className="w-4 h-4 text-muted hover:text-white" />
                             </button>
                             <button 
                                onClick={() => handleDelete(p.id)}
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

      <ProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        productToEdit={productToEdit}
      />
    </div>
  );
}
