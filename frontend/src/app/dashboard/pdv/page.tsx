"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getServices, 
  getProducts, 
  getBarbers, 
  createSale 
} from "@/services/api";
import { 
  ShoppingCart, 
  Scissors, 
  Package, 
  Trash2, 
  Plus, 
  Minus, 
  CreditCard,
  CheckCircle,
  Database,
  ArrowRight,
  User
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Product, Service, Barber } from "@/types";

type CartItem = {
  type: 'SERVICE' | 'PRODUCT';
  id: string;
  name: string;
  price: number;
  quantity: number;
  stock?: number;
};

export default function PDVPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'services' | 'products'>('services');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [barberId, setBarberId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [notes, setNotes] = useState("");
  const [success, setSuccess] = useState(false);

  const { data: services } = useQuery({ queryKey: ["services"], queryFn: getServices });
  const { data: products } = useQuery({ queryKey: ["products"], queryFn: getProducts });
  const { data: barbers } = useQuery({ queryKey: ["barbers"], queryFn: getBarbers });

  const saleMutation = useMutation({
    mutationFn: createSale,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["financial"] });
      setSuccess(true);
      setCart([]);
      setBarberId("");
      setNotes("");
      setTimeout(() => setSuccess(false), 3000);
    },
    onError: (err: any) => {
      alert(err.response?.data?.error || "Erro ao processar venda");
    }
  });

  const addToCart = (item: Service | Product, type: 'SERVICE' | 'PRODUCT') => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id && i.type === type);
      if (existing) {
        if (type === 'PRODUCT' && existing.stock !== undefined && existing.quantity >= existing.stock) {
          alert("Estoque insuficiente");
          return prev;
        }
        return prev.map(i => i.id === item.id && i.type === type 
          ? { ...i, quantity: i.quantity + 1 } 
          : i
        );
      }
      return [...prev, { 
        id: item.id, 
        name: item.name, 
        price: Number(item.price), 
        type, 
        quantity: 1, 
        stock: (item as Product).stock 
      }];
    });
  };

  const removeFromCart = (id: string, type: string) => {
    setCart(prev => prev.filter(i => !(i.id === id && i.type === type)));
  };

  const updateQuantity = (id: string, type: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.id === id && i.type === type) {
        const newQty = i.quantity + delta;
        if (newQty < 1) return i;
        if (type === 'PRODUCT' && i.stock !== undefined && newQty > i.stock) return i;
        return { ...i, quantity: newQty };
      }
      return i;
    }));
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleFinishSale = () => {
    if (cart.length === 0) return alert("Carrinho vazio");
    if (!barberId) return alert("Selecione o barbeiro");

    saleMutation.mutate({
      barberId,
      paymentMethod,
      notes,
      items: cart.map(i => ({
        type: i.type,
        serviceId: i.type === 'SERVICE' ? i.id : undefined,
        productId: i.type === 'PRODUCT' ? i.id : undefined,
        name: i.name,
        price: i.price,
        quantity: i.quantity
      }))
    });
  };

  return (
    <div className="p-8 h-[calc(100vh-100px)] flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gold">Ponto de Venda</h1>
          <p className="text-muted mt-1">Realize vendas de serviços e produtos rapidamente</p>
        </div>
        
        {success && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 bg-green-500/20 text-green-500 border border-green-500/30 px-4 py-2 rounded-xl"
          >
            <CheckCircle className="w-5 h-5" /> Venda finalizada com sucesso!
          </motion.div>
        )}
      </header>

      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Lado Esquerdo - Catálogo */}
        <div className="lg:col-span-8 flex flex-col gap-6 min-h-0">
          <div className="flex p-1 bg-secondary/50 rounded-xl w-fit">
            <button 
              onClick={() => setActiveTab('services')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'services' ? 'gold-gradient text-black shadow-lg shadow-primary/20' : 'text-muted hover:text-white'}`}
            >
              <Scissors className="w-4 h-4" /> Serviços
            </button>
            <button 
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'products' ? 'gold-gradient text-black shadow-lg shadow-primary/20' : 'text-muted hover:text-white'}`}
            >
              <Package className="w-4 h-4" /> Produtos
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar grid grid-cols-1 xl:grid-cols-2 gap-4">
            {activeTab === 'services' ? (
              services?.map((s) => (
                <div 
                  key={s.id}
                  onClick={() => addToCart(s, 'SERVICE')}
                  className="glass p-5 rounded-2xl border border-white/5 hover:border-primary/40 cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div className="space-y-1">
                    <h4 className="font-bold">{s.name}</h4>
                    <p className="text-xs text-muted">{s.durationMinutes} min</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-primary">R$ {Number(s.price).toFixed(2)}</span>
                    <div className="p-2 bg-primary/10 rounded-lg text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      <Plus className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              products?.map((p) => (
                <div 
                  key={p.id}
                  onClick={() => p.stock > 0 && addToCart(p, 'PRODUCT')}
                  className={`glass p-5 rounded-2xl border border-white/5 transition-all flex items-center justify-between group ${p.stock > 0 ? 'hover:border-primary/40 cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
                >
                  <div className="space-y-1">
                    <h4 className="font-bold">{p.name}</h4>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${p.stock <= 3 ? 'text-orange-500 border-orange-500/20 bg-orange-500/10' : 'text-muted border-white/10'}`}>
                      <Database className="w-2.5 h-2.5 inline mr-1" />
                      {p.stock} {p.unit}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-primary">R$ {Number(p.price).toFixed(2)}</span>
                    <div className="p-2 bg-primary/10 rounded-lg text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      <Plus className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Lado Direito - Carrinho */}
        <div className="lg:col-span-4 flex flex-col glass rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-white/5 bg-secondary/30 flex items-center justify-between">
            <h3 className="font-bold flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-primary" /> Carrinho
            </h3>
            <span className="text-xs text-muted font-bold">{cart.length} itens</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-20">
                <ShoppingCart className="w-12 h-12 mb-4" />
                <p className="text-sm">Seu carrinho está vazio.<br/>Adicione itens do catálogo.</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={`${item.type}-${item.id}`} className="p-3 bg-secondary/20 rounded-xl border border-white/5 flex flex-col gap-2">
                  <div className="flex items-start justify-between">
                    <div className="max-w-[150px]">
                      <span className="text-[10px] uppercase tracking-widest text-muted block">
                        {item.type === 'SERVICE' ? 'Serviço' : 'Produto'}
                      </span>
                      <h4 className="text-sm font-bold truncate">{item.name}</h4>
                    </div>
                    <button onClick={() => removeFromCart(item.id, item.type)} className="text-muted hover:text-red-500">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 bg-black/20 rounded-lg p-1">
                      <button onClick={() => updateQuantity(item.id, item.type, -1)} className="p-1 hover:text-primary transition-colors">
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-bold w-6 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.type, 1)} className="p-1 hover:text-primary transition-colors">
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="text-sm font-bold text-primary">R$ {(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-6 bg-secondary/40 space-y-4 border-t border-white/5">
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-bold text-muted">Barbeiro Responsável</label>
                <select 
                  value={barberId}
                  onChange={(e) => setBarberId(e.target.value)}
                  className="w-full bg-black/30 border border-white/10 rounded-lg p-2 text-xs focus:outline-none focus:border-primary/50"
                >
                  <option value="">Selecione...</option>
                  {barbers?.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-bold text-muted">Forma de Pagamento</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'CASH', label: 'Dinheiro' },
                    { id: 'PIX', label: 'PIX' },
                    { id: 'CREDIT_CARD', label: 'Crédito' },
                    { id: 'DEBIT_CARD', label: 'Débito' }
                  ].map(method => (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={`py-2 px-3 rounded-lg text-[10px] font-bold border transition-all ${paymentMethod === method.id ? 'border-primary bg-primary/10 text-primary' : 'border-white/5 bg-black/20 text-muted hover:text-white'}`}
                    >
                      {method.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted">Subtotal</span>
                <span className="text-sm font-bold text-white">R$ {total.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-white uppercase tracking-tighter">Total</span>
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-amber-200">
                  R$ {total.toFixed(2)}
                </span>
              </div>

              <button 
                onClick={handleFinishSale}
                disabled={saleMutation.isPending || cart.length === 0}
                className="w-full gold-gradient text-black font-bold py-4 rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all uppercase tracking-widest text-xs"
              >
                {saleMutation.isPending ? "Processando..." : (
                  <>Finalizar Venda <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
