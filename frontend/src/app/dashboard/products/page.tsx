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
  Search
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
    <div className="p-8 space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gold">Produtos & Estoque</h1>
          <p className="text-muted mt-1">Gerencie seu inventário e venda de produtos</p>
        </div>

        <button 
          onClick={handleNew}
          className="gold-gradient text-black font-bold px-5 py-2 rounded-xl flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <Plus className="w-5 h-5" />
          Novo Produto
        </button>
      </header>

      {/* Filtros e Busca */}
      <div className="flex items-center gap-4">
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input 
            type="text"
            placeholder="Buscar produto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-secondary/30 border border-white/5 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-primary/50 transition-all"
          />
        </div>
      </div>

      {/* Grid de Produtos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {isLoading ? (
            <div className="col-span-full py-12 text-center text-muted italic">Carregando catálogo...</div>
          ) : filteredProducts?.length === 0 ? (
            <div className="col-span-full py-12 text-center text-muted italic">Nenhum produto encontrado.</div>
          ) : (
            filteredProducts?.map((product) => (
              <motion.div 
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="glass p-6 rounded-2xl border border-white/10 group relative hover:border-primary/40 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                   <div className="p-3 bg-secondary rounded-xl text-primary">
                    <Package className="w-6 h-6" />
                  </div>
                  {product.stock <= 3 && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-500 border border-orange-500/20 text-[10px] font-bold uppercase tracking-wider">
                      <AlertTriangle className="w-3 h-3" /> Estoque Baixo
                    </div>
                  )}
                </div>

                <h3 className="font-bold text-lg mb-1 truncate">{product.name}</h3>
                <p className="text-sm text-muted line-clamp-2 h-10 mb-4">{product.description || "Sem descrição"}</p>
                
                <div className="flex items-center justify-between py-3 border-t border-white/5 mb-4">
                  <div>
                    <span className="text-xs text-muted block uppercase tracking-widest font-bold">Preço</span>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-amber-200">
                      R$ {Number(product.price).toFixed(2)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-muted block uppercase tracking-widest font-bold">Disponível</span>
                    <span className={`text-sm font-bold flex items-center gap-1 justify-end ${product.stock === 0 ? 'text-red-500' : 'text-white'}`}>
                      <Database className="w-3.5 h-3.5" />
                      {product.stock} {product.unit}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                   <button 
                    onClick={() => handleEdit(product)}
                    className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-muted hover:text-white rounded-lg transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Editar
                  </button>
                  <button 
                    onClick={() => handleDelete(product.id)}
                    className="p-2 border border-white/5 hover:border-red-500/30 hover:bg-red-500/10 text-muted hover:text-red-500 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <ProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        productToEdit={productToEdit}
      />
    </div>
  );
}
