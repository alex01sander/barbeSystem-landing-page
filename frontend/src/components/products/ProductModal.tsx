"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { X, Package, DollarSign, Database, Tag } from "lucide-react";
import { createProduct, updateProduct } from "@/services/api";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/types";

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
    mutationFn: (data: any) => 
      productToEdit 
        ? updateProduct(productToEdit.id, data) 
        : createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      onClose();
      resetForm();
    },
    onError: (err: any) => {
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="glass w-full max-w-md rounded-2xl overflow-hidden relative z-10 border border-white/10"
        >
          <div className="p-6 border-b border-white/10 flex items-center justify-between gold-gradient">
            <h2 className="text-xl font-bold text-black flex items-center gap-2">
              <Package className="w-5 h-5" />
              {productToEdit ? "Editar Produto" : "Novo Produto"}
            </h2>
            <button onClick={onClose} className="text-black/70 hover:text-black transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted flex items-center gap-2">
                <Tag className="w-4 h-4" /> Nome do Produto
              </label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Pomada Efeito Matte"
                className="w-full bg-secondary/50 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-primary/50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted">Descrição (Opcional)</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detalhes sobre o produto..."
                className="w-full bg-secondary/50 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-primary/50 h-24 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted flex items-center gap-2">
                  <DollarSign className="w-4 h-4" /> Preço
                </label>
                <input 
                  type="number" 
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0,00"
                  className="w-full bg-secondary/50 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-primary/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted flex items-center gap-2">
                  <Database className="w-4 h-4" /> Estoque
                </label>
                <input 
                  type="number" 
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="0"
                  className="w-full bg-secondary/50 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-primary/50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted">Unidade de Medida</label>
              <select 
                value={unit} 
                onChange={(e) => setUnit(e.target.value)}
                className="w-full bg-secondary/50 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-primary/50"
              >
                <option value="un">Unidade (un)</option>
                <option value="ml">Mililitros (ml)</option>
                <option value="gr">Gramas (gr)</option>
              </select>
            </div>

            {error && (
              <div className="text-red-500 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                {error}
              </div>
            )}

            <button 
              type="submit"
              disabled={mutation.isPending}
              className="w-full gold-gradient text-black font-bold py-4 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-primary/10 flex items-center justify-center gap-2"
            >
              {mutation.isPending ? "Salvando..." : productToEdit ? "Atualizar Produto" : "Cadastrar Produto"}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
