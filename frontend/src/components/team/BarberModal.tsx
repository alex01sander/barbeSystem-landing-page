"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import { X, User as UserIcon, Camera, Calendar, Scissors, Upload } from "lucide-react";
import { createBarber, updateBarber } from "@/services/api";
import { motion, AnimatePresence } from "framer-motion";
import { Barber } from "@/types";

interface BarberModalProps {
  isOpen: boolean;
  onClose: () => void;
  barberToEdit?: Barber | null;
}

export function BarberModal({ isOpen, onClose, barberToEdit }: BarberModalProps) {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [name, setName] = useState("");
  const [photoUrl, setPhotoUrl] = useState(""); // Aqui guardaremos o Base64
  const [age, setAge] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (barberToEdit) {
      setName(barberToEdit.name);
      setPhotoUrl(barberToEdit.photoUrl || "");
      setAge(barberToEdit.age?.toString() || "");
    } else {
      resetForm();
    }
  }, [barberToEdit]);

  const mutation = useMutation({
    mutationFn: (data: any) => 
      barberToEdit 
        ? updateBarber(barberToEdit.id, data) 
        : createBarber(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["barbers"] });
      onClose();
      resetForm();
    },
    onError: (err: any) => {
      setError(err.response?.data?.error || "Erro ao salvar barbeiro");
    }
  });

  function resetForm() {
    setName("");
    setPhotoUrl("");
    setAge("");
    setError("");
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("A imagem deve ter no máximo 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name) {
      setError("O nome é obrigatório");
      return;
    }

    mutation.mutate({
      name,
      photoUrl, // Envia o Base64 ou string vazia
      age: age ? parseInt(age) : undefined
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
              <Scissors className="w-5 h-5" />
              {barberToEdit ? "Editar Barbeiro" : "Novo Barbeiro"}
            </h2>
            <button onClick={onClose} className="text-black/70 hover:text-black transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Seletor de Foto (Base64) */}
            <div className="flex flex-col items-center gap-3">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-28 h-28 rounded-full border-2 border-primary/30 overflow-hidden bg-secondary flex items-center justify-center cursor-pointer hover:border-primary transition-all relative group"
              >
                {photoUrl ? (
                  <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-10 h-10 text-muted" />
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <Camera className="w-6 h-6 text-white" />
                </div>
              </div>
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-[10px] uppercase tracking-widest font-bold text-primary flex items-center gap-1 hover:underline"
              >
                <Upload className="w-3 h-3" /> Alterar Foto
              </button>
            </div>

            {/* Nome */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted flex items-center gap-2">
                <UserIcon className="w-4 h-4" /> Nome do Barbeiro
              </label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Pedro Silva"
                className="w-full bg-secondary/50 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-primary/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Idade */}
              <div className="space-y-2 col-span-2">
                <label className="text-sm font-medium text-muted flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Idade (Opcional)
                </label>
                <input 
                  type="number" 
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Ex: 28"
                  className="w-full bg-secondary/50 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-primary/50"
                />
              </div>
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
              {mutation.isPending ? "Processando..." : barberToEdit ? "Atualizar Perfil" : "Salvar Barbeiro"}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
