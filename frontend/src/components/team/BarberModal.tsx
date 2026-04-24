"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import { X, User, Camera, Trash2, Calendar } from "lucide-react";
import { createBarber, updateBarber } from "@/services/api";
import { motion, AnimatePresence } from "framer-motion";
import { Barber, CreateBarberDTO, UpdateBarberDTO } from "@/types";

interface BarberModalProps {
  isOpen: boolean;
  onClose: () => void;
  barberToEdit?: Barber | null;
}

export function BarberModal({ isOpen, onClose, barberToEdit }: BarberModalProps) {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (barberToEdit) {
      setName(barberToEdit.name);
      setAge(barberToEdit.age?.toString() || "");
      setPhotoUrl(barberToEdit.photoUrl || null);
      setIsActive(barberToEdit.isActive);
    } else {
      resetForm();
    }
  }, [barberToEdit]);

  const mutation = useMutation({
    mutationFn: (data: CreateBarberDTO | UpdateBarberDTO) => 
      barberToEdit 
        ? updateBarber(barberToEdit.id, data as UpdateBarberDTO) 
        : createBarber(data as CreateBarberDTO),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["barbers"] });
      onClose();
      resetForm();
    },
    onError: (err: { response?: { data?: { error?: string } } }) => {
      setError(err.response?.data?.error || "Erro ao salvar profissional");
    }
  });

  function resetForm() {
    setName("");
    setAge("");
    setPhotoUrl(null);
    setIsActive(true);
    setError("");
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhotoUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name) {
      setError("O nome é obrigatório");
      return;
    }

    mutation.mutate({
      name,
      age: age ? parseInt(age) : undefined,
      photoUrl,
      isActive
    });
  }

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-secondary border border-border w-full max-w-lg rounded-[24px] overflow-hidden relative z-10 shadow-2xl"
        >
          <div className="px-8 pt-8 pb-4 flex items-center justify-between">
            <div>
               <h2 className="text-xl font-bold tracking-tight text-white">
                 {barberToEdit ? "Editar Profissional" : "Novo Profissional"}
               </h2>
               <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mt-1">Gestão de Equipe</p>
            </div>
            <button onClick={onClose} className="p-2 text-muted hover:text-white transition-colors bg-background border border-border rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8 pt-4 space-y-8">
            <div className="flex flex-col items-center gap-6 p-6 bg-background/30 border border-border rounded-3xl">
              <div className="relative group">
                {photoUrl ? (
                  <img 
                    src={photoUrl} 
                    alt="Preview" 
                    className="w-32 h-32 rounded-3xl object-cover border-2 border-border p-1"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-3xl bg-secondary border-2 border-dashed border-border flex flex-col items-center justify-center text-muted gap-2">
                    <Camera className="w-8 h-8 opacity-20" />
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Sem Foto</span>
                  </div>
                )}
                
                <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded-3xl backdrop-blur-[2px]">
                   <button 
                      type="button" 
                      onClick={() => fileInputRef.current?.click()}
                      className="p-3 bg-white text-black rounded-xl hover:scale-105 transition-transform"
                   >
                     <Camera className="w-4 h-4" />
                   </button>
                   {photoUrl && (
                     <button 
                        type="button" 
                        onClick={removePhoto}
                        className="p-3 bg-red-500 text-white rounded-xl hover:scale-105 transition-transform"
                     >
                       <Trash2 className="w-4 h-4" />
                     </button>
                   )}
                </div>
              </div>
              <p className="text-[10px] text-muted font-bold uppercase tracking-widest text-center">
                JPG ou PNG • Máximo 2MB
              </p>
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-muted tracking-widest">Nome Completo</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Carlos Silva"
                  className="w-full bg-background border border-border rounded-xl p-3 text-sm focus:outline-none focus:border-white transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-muted tracking-widest">Idade (Opcional)</label>
                    <input 
                      type="number" 
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="Ex: 28"
                      className="w-full bg-background border border-border rounded-xl p-3 text-sm focus:outline-none focus:border-white transition-all"
                    />
                 </div>
                 <div className="space-y-2">
                   <label className="text-[10px] uppercase font-bold text-muted tracking-widest">Status Atual</label>
                   <select 
                      value={isActive ? "true" : "false"}
                      onChange={(e) => setIsActive(e.target.value === "true")}
                      className="w-full bg-background border border-border rounded-xl p-3 text-sm focus:outline-none focus:border-white transition-all cursor-pointer appearance-none"
                   >
                      <option value="true">Ativo</option>
                      <option value="false">Inativo</option>
                   </select>
                 </div>
              </div>
            </div>

            {error && (
              <div className="text-red-400 text-[11px] font-bold bg-red-400/5 p-3 rounded-lg border border-red-400/10 uppercase tracking-wider">
                {error}
              </div>
            )}

            <div className="pt-4 flex gap-4">
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
                  {mutation.isPending ? "Salvando..." : barberToEdit ? "Salvar Profissional" : "Contratar Barbeiro"}
               </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
