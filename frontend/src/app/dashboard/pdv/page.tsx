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
  CheckCircle,
  Database,
  ArrowRight,
  User,
  Search
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
  const [searchTerm, setSearchTerm] = useState("");

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
    onError: (err: { response?: { data?: { error?: string } } }) => {
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

  const filteredItems = (activeTab === 'services' ? services : products)?.filter(i => 
    i.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    <div className="h-[calc(100vh-120px)] flex flex-col gap-8 max-w-[1600px] mx-auto">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Ponto de Venda</h1>
          <p className="text-muted text-sm mt-1">Registre atendimentos e vendas de produtos rapidamente.</p>
        </div>
        
        {success && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest shadow-xl"
          >
            <CheckCircle className="w-4 h-4" /> Venda Processada
          </motion.div>
        )}
      </header>

      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Catálogo de Itens */}
        <div className="lg:col-span-8 flex flex-col gap-6 min-h-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex p-1 bg-secondary border border-border rounded-xl w-fit">
              <button 
                onClick={() => setActiveTab('services')}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'services' ? 'bg-white text-black shadow-md' : 'text-muted hover:text-white'}`}
              >
                Serviços
              </button>
              <button 
                onClick={() => setActiveTab('products')}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'products' ? 'bg-white text-black shadow-md' : 'text-muted hover:text-white'}`}
              >
                Produtos
              </button>
            </div>

            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted" />
              <input 
                type="text"
                placeholder="Buscar item..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-secondary/50 border border-border rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-white transition-all"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-3">
            {filteredItems?.map((item) => {
              const itemProduct = item as Product;
              const isOutOfStock = activeTab === 'products' && itemProduct.stock === 0;
              
              return (
                <div 
                  key={item.id}
                  onClick={() => !isOutOfStock && addToCart(item, activeTab === 'services' ? 'SERVICE' : 'PRODUCT')}
                  className={`p-5 bg-secondary/20 border border-border rounded-2xl transition-all flex flex-col justify-between group h-40 ${isOutOfStock ? 'opacity-30 cursor-not-allowed' : 'hover:border-zinc-500 cursor-pointer'}`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-muted uppercase tracking-widest">
                        {activeTab === 'services' ? (item as Service).durationMinutes + ' min' : itemProduct.unit}
                      </span>
                      {activeTab === 'products' && (
                        <span className={`text-[10px] font-bold ${itemProduct.stock <=3 ? 'text-red-400' : 'text-muted'}`}>
                          {itemProduct.stock} no estoque
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-sm mt-3 group-hover:text-primary transition-colors">{item.name}</h4>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <span className="font-bold text-lg">R$ {Number(item.price).toFixed(2)}</span>
                    <div className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Plus className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Carrinho de Compras */}
        <div className="lg:col-span-4 flex flex-col bg-secondary/30 border border-border rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-border bg-secondary/20 flex items-center justify-between">
            <h3 className="font-bold text-xs uppercase tracking-widest text-muted flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" /> Resumo da Venda
            </h3>
            <span className="bg-white text-black text-[10px] font-bold px-2 py-0.5 rounded-full">{cart.length}</span>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
                <ShoppingCart className="w-10 h-10 mb-3" />
                <p className="text-[11px] font-bold uppercase tracking-widest">Carrinho Vazio</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={`${item.type}-${item.id}`} className="flex items-start justify-between group">
                  <div className="flex-1">
                    <h4 className="text-sm font-bold truncate pr-4">{item.name}</h4>
                    <div className="flex items-center gap-3 mt-1.5">
                       <div className="flex items-center gap-2 border border-border rounded-md px-1 py-0.5">
                         <button onClick={() => updateQuantity(item.id, item.type, -1)} className="text-muted hover:text-white transition-colors"><Minus className="w-3 h-3" /></button>
                         <span className="text-[10px] font-bold w-4 text-center">{item.quantity}</span>
                         <button onClick={() => updateQuantity(item.id, item.type, 1)} className="text-muted hover:text-white transition-colors"><Plus className="w-3 h-3" /></button>
                       </div>
                       <span className="text-xs font-bold text-primary">R$ {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id, item.type)}
                    className="p-1.5 text-muted hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="p-8 bg-secondary/60 border-t border-border space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-muted">Responsável</label>
                <select 
                  value={barberId}
                  onChange={(e) => setBarberId(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl p-3 text-xs focus:outline-none focus:border-white transition-all appearance-none cursor-pointer"
                >
                  <option value="">Selecione o barbeiro...</option>
                  {barbers?.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-muted">Pagamento</label>
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
                      className={`py-2.5 px-3 rounded-lg text-[10px] font-bold border transition-all ${paymentMethod === method.id ? 'border-primary bg-white text-black' : 'border-border bg-background/50 text-muted hover:text-white'}`}
                    >
                      {method.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-border space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted">Total a Receber</span>
                <span className="text-2xl font-bold tracking-tighter">R$ {total.toFixed(2)}</span>
              </div>

              <button 
                onClick={handleFinishSale}
                disabled={saleMutation.isPending || cart.length === 0}
                className="w-full bg-white text-black font-bold h-14 rounded-2xl shadow-xl shadow-white/5 flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-20 transition-all uppercase tracking-widest text-xs"
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
