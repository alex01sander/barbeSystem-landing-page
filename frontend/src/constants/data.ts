import { Service, Barber } from "@/types";

export const DEFAULT_SERVICES: Service[] = [
  {
    id: "1",
    name: "Corte de Cabelo",
    description: "Corte clássico ou moderno, finalizado com produtos premium.",
    price: 60,
    durationMinutes: 45,
    isActive: true,
  },
  {
    id: "2",
    name: "Barba Completa",
    description: "Modelagem de barba com toalha quente e óleos essenciais.",
    price: 45,
    durationMinutes: 30,
    isActive: true,
  },
  {
    id: "3",
    name: "Combo Corte + Barba",
    description: "Experiência completa para renovar seu visual.",
    price: 90,
    durationMinutes: 75,
    isActive: true,
  },
  {
    id: "4",
    name: "Tratamento Capilar",
    description: "Hidratação profunda e massagem relaxante no couro cabeludo.",
    price: 40,
    durationMinutes: 20,
    isActive: true,
  }
];

export const DEFAULT_BARBERS: Barber[] = [
  {
    id: "1",
    name: "Alex Sander",
    photoUrl: "https://images.unsplash.com/photo-1618077360395-f3068be8e001?q=80&w=1780&auto=format&fit=crop",
    isActive: true,
  },
  {
    id: "2",
    name: "John Doe",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop",
    isActive: true,
  },
  {
    id: "3",
    name: "Marcus Viana",
    photoUrl: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=1740&auto=format&fit=crop",
    isActive: true,
  },
  {
    id: "4",
    name: "Junior Silva",
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1887&auto=format&fit=crop",
    isActive: true,
  }
];
