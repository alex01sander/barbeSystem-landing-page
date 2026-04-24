"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { X, Package, DollarSign, Database, Tag } from "lucide-react";
import { createProduct, updateProduct } from "@/services/api";
import { motion, AnimatePresence } from "framer-motion";
import { Product, CreateProductDTO, UpdateProductDTO } from "@/types";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Product | null;
}

export function ProductModal({ isOpen, onClose, productToEdit }: ProductModalProps) {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [unit, setUnit] = useState("un");
  const [error, setError] = useState("");

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setDescription(productToEdit.description || "");
      setPrice(productToEdit.price.toString());
      setStock(productToEdit.stock.toString());
      setUnit(productToEdit.unit);
    } else {
      resetForm();
    }
  }, [productToEdit]);

  const mutation = useMutation({
    mutationFn: (data: CreateProductDTO | UpdateProductDTO) => 
      productToEdit 
        ? updateProduct(productToEdit.id, data as UpdateProductDTO) 
        : createProduct(data as CreateProductDTO),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      onClose();
      resetForm();
    },
    onError: (err: { response?: { data?: { error?: string } } }) => {
      setError(err.response?.data?.error || "Erro ao salvar produto");
    }
  });

  function resetForm() {
    setName("");
    setDescription("");
    setPrice("");
    setStock("");
    setUnit("un");
    setError("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name || !price || !stock) {
      setError("Preencha todos os campos obrigatórios");
      return;
    }

    mutation.mutate({
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock),
      unit
    });
  }

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-secondary border border-border w-full max-w-lg rounded-[24px] overflow-hidden relative z-10 shadow-2xl"
        >
          <div className="px-8 pt-8 pb-4 flex items-center justify-between">
            <div>
               <h2 className="text-xl font-bold tracking-tight">
                 {productToEdit ? "Editar Produto" : "Novo Produto"}
               </h2>
               <p className="text-xs text-muted mt-1 uppercase tracking-widest font-bold">Catálogo de Inventário</p>
            </div>
            <button onClick={onClose} className="p-2 text-muted hover:text-white transition-colors bg-background border border-border rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8 pt-4 space-y-6">
            <div className="space-y-4">
               <div className="space-y-2">
                 <label className="text-[10px] font-bold text-muted uppercase tracking-widest">Nome do Produto</label>
                 <input 
                   type="text" 
                   value={name}
                   onChange={(e) => setName(e.target.value)}
                   placeholder="Ex: Pomada Brilhante"
                   className="w-full bg-background border border-border rounded-xl p-3 text-sm focus:outline-none focus:border-white transition-all"
                 />
               </div>

               <div className="space-y-2">
                 <label className="text-[10px] font-bold text-muted uppercase tracking-widest">Descrição detalhada</label>
                 <textarea 
                   value={description}
                   onChange={(e) => setDescription(e.target.value)}
                   placeholder="Informações adicionais..."
                   className="w-full bg-background border border-border rounded-xl p-3 text-sm focus:outline-none focus:border-white transition-all h-28 resize-none"
                 />
               </div>

               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <label className="text-[10px] font-bold text-muted uppercase tracking-widest">Preço de Venda</label>
                   <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                      <input 
                        type="number" 
                        step="0.01"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="0,00"
                        className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-white transition-all"
                      />
                   </div>
                 </div>
                 <div className="space-y-2">
                   <label className="text-[10px] font-bold text-muted uppercase tracking-widest">Estoque Atual</label>
                   <div className="relative">
                      <Database className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                      <input 
                        type="number" 
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        placeholder="0"
                        className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-white transition-all"
                      />
                   </div>
                 </div>
               </div>

               <div className="space-y-2">
                 <label className="text-[10px] font-bold text-muted uppercase tracking-widest">Unidade</label>
                 <select 
                   value={unit} 
                   onChange={(e) => setUnit(e.target.value)}
                   className="w-full bg-background border border-border rounded-xl p-3 text-sm focus:outline-none focus:border-white transition-all appearance-none cursor-pointer"
                 >
                   <option value="un">Unidade (un)</option>
                   <option value="ml">Mililitros (ml)</option>
                   <option value="gr">Gramas (gr)</option>
                 </select>
               </div>
            </div>

            {error && (
              <div className="text-red-400 text-[11px] font-bold bg-red-400/5 p-3 rounded-lg border border-red-400/10 uppercase tracking-wider">
                {error}
              </div>
            )}

            <div className="pt-4 flex gap-3">
               <button 
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-background border border-border text-muted font-bold text-xs py-4 rounded-xl hover:text-white transition-all uppercase tracking-widest"
               >
                  Cancelar
               </button>
               <button 
                  type="submit"
                  disabled={mutation.isPending}
                  className="flex-[2] bg-white text-black font-bold text-xs py-4 rounded-xl hover:opacity-90 disabled:opacity-50 transition-all uppercase tracking-widest shadow-xl shadow-white/5"
               >
                  {mutation.isPending ? "Salvando..." : productToEdit ? "Salvar Alterações" : "Cadastrar Item"}
               </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
