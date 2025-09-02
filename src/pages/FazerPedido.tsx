
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import ProductModal from "@/components/ProductModal";
import { useIsMobile } from "@/hooks/use-mobile";
import DesktopProductCard from "@/components/DesktopProductCard";
import CartSheet, { CartItem } from "@/components/CartSheet";
import CheckoutModal, { type PaymentMethod } from "@/components/CheckoutModal";
import MobileGridProductCard from "@/components/MobileGridProductCard";
import { ShoppingCart } from "lucide-react";
const doces = [
  // Dia a Dia
  {
    id: 1,
    nome: "BRIGADEIRO da SORTE",
    descricao: "Brigadeiro de chocolate dentro de um blister com um bilhete da sorte.",
    preco: "R$3,80",
    peso: "20g",
    categoria: "Dia a Dia",
    image: "/placeholder.svg",
  },
  {
    id: 2,
    nome: "BRIGADEIRO de COLHER: Chocolate",
    descricao: "Brigadeiro de colher no copinho.",
    preco: "R$5",
    peso: "40g",
    categoria: "Dia a Dia",
    image: "/placeholder.svg",
  },
  {
    id: 3,
    nome: "BRIGADEIRO de COLHER: Beijinho",
    descricao: "Brigadeiro de colher no copinho.",
    preco: "R$5",
    peso: "40g",
    categoria: "Dia a Dia",
    image: "/placeholder.svg",
  },
  {
    id: 4,
    nome: "BRIGADEIRO de COLHER: Amendoim",
    descricao: "Brigadeiro de colher no copinho.",
    preco: "R$5",
    peso: "40g",
    categoria: "Dia a Dia",
    image: "/placeholder.svg",
  },
  {
    id: 5,
    nome: "BRIGADEIRO de COLHER: Pistache",
    descricao: "Brigadeiro de colher no copinho.",
    preco: "R$5",
    peso: "40g",
    categoria: "Dia a Dia",
    image: "/placeholder.svg",
  },

  // Bolo
  {
    id: 6,
    nome: "CAKE BOX: Doce de Leite com Nozes",
    descricao: "Bolo de camadas recheado em bandeja de alumínio com tampa transparente + colherzinha.",
    preco: "R$11,90",
    peso: "300g",
    categoria: "Bolo",
    image: "/placeholder.svg",
  },
  {
    id: 7,
    nome: "CAKE BOX: Chocolate",
    descricao: "Bolo de camadas recheado em bandeja de alumínio com tampa transparente + colherzinha.",
    preco: "R$11,90",
    peso: "300g",
    categoria: "Bolo",
    image: "/placeholder.svg",
  },
  {
    id: 8,
    nome: "CAKE BOX: Toalha Felpuda",
    descricao: "Bolo de camadas recheado em bandeja de alumínio com tampa transparente + colherzinha.",
    preco: "R$11,90",
    peso: "300g",
    categoria: "Bolo",
    image: "/placeholder.svg",
  },

  // Snacks
  {
    id: 9,
    nome: "MOONROCKS SOLO",
    descricao: "Pipocas caramelizadas com cobertura de chocolate branco e leite ninho.",
    preco: "R$16",
    peso: "100g",
    categoria: "Snacks",
    image: "/placeholder.svg",
  },
  {
    id: 10,
    nome: "MOONROCKS DUO",
    descricao: "Pipocas caramelizadas com cobertura de chocolate branco e leite ninho.",
    preco: "R$21",
    peso: "200g",
    categoria: "Snacks",
    image: "/placeholder.svg",
  },
  {
    id: 11,
    nome: "MOONROCKS FAMÍLIA",
    descricao: "Pipocas caramelizadas com cobertura de chocolate branco e leite ninho.",
    preco: "R$42",
    peso: "400g",
    categoria: "Snacks",
    image: "/placeholder.svg",
  },

  // Tradicionais
  {
    id: 12,
    nome: "Doce de Amendoim (GALVANI)",
    descricao: "Doce de amendoim tradicional.",
    preco: "R$3,50",
    peso: "73g",
    categoria: "Tradicionais",
    image: "/placeholder.svg",
  },
  {
    id: 13,
    nome: "Doce de Abóbora",
    descricao: "Doce de abóbora tradicional.",
    preco: "R$3,50",
    peso: "55g",
    categoria: "Tradicionais",
    image: "/placeholder.svg",
  },
  {
    id: 14,
    nome: "Quindim",
    descricao: "Quindim tradicional.",
    preco: "R$3,50",
    peso: "70g",
    categoria: "Tradicionais",
    image: "/placeholder.svg",
  },
  {
    id: 15,
    nome: "Queijadinha",
    descricao: "Queijadinha tradicional.",
    preco: "R$3,50",
    peso: "70g",
    categoria: "Tradicionais",
    image: "/placeholder.svg",
  },

  // Salgados
  {
    id: 16,
    nome: "BAGUETE IMPERIAL: Casadinhos",
    descricao: "Presunto, queijo, catupiry e parmesão.",
    preco: "R$27",
    peso: "500g",
    categoria: "Salgados",
    image: "/placeholder.svg",
  },
  {
    id: 17,
    nome: "BAGUETE IMPERIAL: Vegetariana",
    descricao: "Brócolis, alho frito, mussarela e parmesão.",
    preco: "R$25",
    peso: "500g",
    categoria: "Salgados",
    image: "/placeholder.svg",
  },
  {
    id: 18,
    nome: "SUPER REQHNAZE",
    descricao: "Fatia de torta de frango macio, muito requeijão e queijo gratinado.",
    preco: "R$18,90",
    peso: "250g",
    categoria: "Salgados",
    image: "/placeholder.svg",
  },

  // Bebidas
  {
    id: 19,
    nome: "REFRÊSKO",
    descricao: "Água saborizada com limão e açúcar.",
    preco: "R$6",
    peso: "470ml",
    categoria: "Bebidas",
    image: "/placeholder.svg",
  },
  {
    id: 20,
    nome: "NUKU-JUICE (470ml)",
    descricao: "Mix de maracujá, limão e morango (com ou sem açúcar).",
    preco: "R$9",
    peso: "470ml",
    categoria: "Bebidas",
    image: "/placeholder.svg",
  },
  {
    id: 21,
    nome: "NUKU-JUICE (1 litro)",
    descricao: "Mix de maracujá, limão e morango (com ou sem açúcar).",
    preco: "R$17",
    peso: "1L",
    categoria: "Bebidas",
    image: "/placeholder.svg",
  },
  {
    id: 22,
    nome: "Água",
    descricao: "Água mineral.",
    preco: "R$4",
    peso: "500ml",
    categoria: "Bebidas",
    image: "/placeholder.svg",
  },
  {
    id: 23,
    nome: "Água com gás",
    descricao: "Água mineral com gás.",
    preco: "R$5",
    peso: "500ml",
    categoria: "Bebidas",
    image: "/placeholder.svg",
  },
  {
    id: 24,
    nome: "Refrigerante lata",
    descricao: "Refrigerante em lata.",
    preco: "R$6",
    peso: "350ml",
    categoria: "Bebidas",
    image: "/placeholder.svg",
  },
  {
    id: 25,
    nome: "Coca-Cola retornável",
    descricao: "Coca-Cola retornável.",
    preco: "R$9",
    peso: "2L",
    categoria: "Bebidas",
    image: "/placeholder.svg",
  },
];

const categorias = ["Todos", "Dia a Dia", "Bolo", "Snacks", "Tradicionais", "Salgados", "Bebidas"];

const FazerPedido = () => {
  const [categoriaAtiva, setCategoriaAtiva] = useState("Todos");
  const [session, setSession] = useState<Session | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<typeof doces[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Carrinho
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  // Infinite scroll (mobile)
  const [visibleCount, setVisibleCount] = useState(8);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // SEO básico para a página
  useEffect(() => {
    document.title = "Cardápio - Doce Emergência | Peça pelo WhatsApp";
    const metaDescId = "meta-desc-fazer-pedido";
    let meta = document.querySelector(`meta[name="description"]`);
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", "Cardápio Doce Emergência: escolha seus itens, monte o pedido e envie pelo WhatsApp.");

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = window.location.href;
  }, [categoriaAtiva]);

  const docesFiltrados = categoriaAtiva === "Todos"
    ? doces
    : doces.filter(doce => doce.categoria === categoriaAtiva);

  useEffect(() => {
    setVisibleCount(8);
  }, [categoriaAtiva, isMobile]);

  useEffect(() => {
    if (!isMobile) return;
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + 8, docesFiltrados.length));
        }
      });
    }, { rootMargin: "200px" });
    obs.observe(el);
    return () => obs.disconnect();
  }, [docesFiltrados.length, isMobile]);

  const parsePrice = (preco: string) => {
    const cleaned = preco.replace(/[^0-9,.-]/g, "").replace(/\./g, "").replace(",", ".");
    const n = parseFloat(cleaned);
    return isNaN(n) ? 0 : n;
  };

  const addToCart = (p: typeof doces[0]) => {
    setCartItems((items) => {
      const exists = items.find((i) => i.id === p.id);
      if (exists) {
        return items.map((i) => i.id === p.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [
        ...items,
        { id: p.id, nome: p.nome, precoString: p.preco, unitPrice: parsePrice(p.preco), quantity: 1 },
      ];
    });
    toast({ title: "Adicionado ao carrinho", description: p.nome });
  };

  const increaseItem = (id: number) => setCartItems((items) => items.map((i) => i.id === id ? { ...i, quantity: i.quantity + 1 } : i));
  const decreaseItem = (id: number) => setCartItems((items) => items.flatMap((i) => i.id === id ? (i.quantity > 1 ? [{ ...i, quantity: i.quantity - 1 }] : []) : [i]));
  const removeItem = (id: number) => setCartItems((items) => items.filter((i) => i.id !== id));

  const cartCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);

  const handleCheckoutConfirm = ({ name, address, payment }: { name: string; address: string; payment: PaymentMethod }) => {
    if (cartItems.length === 0) return;
    
    // Formatar itens com quantidade e preço individual
    const itemsText = cartItems.map((i) => {
      if (i.quantity === 1) {
        return `${i.quantity}x ${i.nome} — ${i.precoString}`;
      } else {
        return `${i.quantity}x ${i.nome} — ${i.precoString}`;
      }
    }).join("  \n");
    
    const total = cartItems.reduce((acc, i) => acc + i.unitPrice * i.quantity, 0);
    const totalBRL = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    
    // Mensagem formatada com emojis e quebras de linha
    const messageRaw = `✨🍫 **Novo Pedido Doce Emergência!** 🍫✨  
 
📦 **Itens:**  
${itemsText}  
 
💰 **Total:** ${totalBRL}  
 
👤 **Cliente:** ${name}  
📍 **Endereço:** ${address}  
💳 **Forma de Pagamento:** ${payment}`;

    const phone = "5511976824710";
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(messageRaw)}`;
    window.open(url, '_blank');
    setCheckoutOpen(false);
    setCartOpen(false);
    setCartItems([]);
    toast({ title: "Pedido enviado no WhatsApp", description: "Abrimos uma conversa com o seu pedido" });
  };

  const handleWhatsAppRedirect = (nomeDoce: string) => {
    const phone = "5511976824710";
    const message = `Olá! Quero pedir o ${nomeDoce} que vi no site.`;
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleProductClick = (doce: typeof doces[0]) => {
    setSelectedProduct(doce);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="min-h-screen bg-background py-6">
      <div className="container mx-auto px-4 py-4 md:py-12">
        <div className="text-center mb-6 md:mb-12">
          <h1 className="text-4xl font-bold text-doce-white mb-2 md:mb-4">
            Nosso Cardápio
          </h1>
          <p className="text-doce-white/80 text-lg">
            Escolha seus doces favoritos e faça seu pedido pelo WhatsApp
          </p>
        </div>

        {/* Filtro de categorias - Mobile e Desktop */}
        <div className="mb-6 md:mb-12">
          <div className="overflow-x-auto pb-2">
            <div className="flex gap-2 md:gap-3 min-w-max px-1 md:px-4 md:justify-center">
              {categorias.map((categoria) => (
                <Button
                  key={categoria}
                  variant={categoriaAtiva === categoria ? "default" : "secondary"}
                  onClick={() => setCategoriaAtiva(categoria)}
                  className={`h-9 md:h-10 px-3 md:px-4 whitespace-nowrap ${categoriaAtiva === categoria 
                    ? "bg-doce-yellow text-doce-brown hover:bg-doce-yellow/90 font-bold" 
                    : "bg-doce-white text-doce-brown hover:bg-doce-yellow/20 border border-doce-yellow/30"
                  }`}
                >
                  {categoria}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Grid 3x6 com carregamento automático */}
        {isMobile ? (
          <div className="lg:hidden">
            <div className="grid grid-cols-2 gap-3">
              {docesFiltrados.slice(0, visibleCount).map((doce) => (
                <MobileGridProductCard key={doce.id} product={doce} onAddToCart={addToCart} onOpenDetails={handleProductClick} />
              ))}
            </div>
            {/* Sentinel para carregar mais */}
            <div ref={sentinelRef} className="h-10" />
          </div>
        ) : (
          /* Desktop Grid */
          <div className="grid grid-cols-3 gap-2 md:gap-4 lg:gap-6 max-w-7xl mx-auto">
            {docesFiltrados.slice(0, 9).map((doce) => (
              <DesktopProductCard
                key={doce.id}
                product={doce}
                onProductClick={handleProductClick}
                onAddToCart={() => addToCart(doce)}
                onPedir={() => handleWhatsAppRedirect(doce.nome)}
              />
            ))}
          </div>
        )}

        {/* Show more products button if there are more than 9 (desktop) */}
        {!isMobile && docesFiltrados.length > 9 && (
          <div className="text-center mt-8">
            <Button
              onClick={() => {
                toast({
                  title: "Mais produtos",
                  description: "Role para ver mais opções ou use os filtros",
                });
              }}
              className="bg-doce-yellow text-doce-brown hover:bg-doce-yellow/90 font-bold"
            >
              Ver mais produtos
            </Button>
          </div>
        )}

        {/* Cart Floating Button */}
      <div className="fixed bottom-6 right-4 lg:right-8 z-50">
        <Button
          onClick={() => setCartOpen(true)}
          className="relative h-12 w-12 rounded-full bg-doce-yellow text-doce-brown hover:bg-doce-yellow/90 shadow-lg p-0"
          aria-label="Abrir carrinho"
        >
          <ShoppingCart className="h-6 w-6" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 inline-flex items-center justify-center h-5 min-w-5 px-1 rounded-full bg-doce-brown text-doce-white text-xs">
              {cartCount}
            </span>
          )}
        </Button>
      </div>

        {/* Cart Sheet */}
        <CartSheet
          open={cartOpen}
          onOpenChange={setCartOpen}
          items={cartItems}
          onIncrease={increaseItem}
          onDecrease={decreaseItem}
          onRemove={removeItem}
          onCheckout={() => setCheckoutOpen(true)}
        />

        {/* Checkout Modal */}
        <CheckoutModal
          open={checkoutOpen}
          onOpenChange={setCheckoutOpen}
          onConfirm={handleCheckoutConfirm}
        />

        {/* Product Modal */}
        <ProductModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          product={selectedProduct}
          onAddToCart={(p) => addToCart(p as typeof doces[0])}
        />

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-doce-white rounded-2xl p-8 shadow-xl max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-doce-brown mb-4">
              Não encontrou o que procura?
            </h2>
            <p className="text-doce-brown/80 mb-6">
              Entre em contato conosco pelo WhatsApp e faremos um doce especial para você!
            </p>
            <Button
              onClick={() => handleWhatsAppRedirect("produto personalizado")}
              className="bg-doce-yellow text-doce-brown hover:bg-doce-yellow/90 font-bold px-8 py-3"
            >
              Falar no WhatsApp
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FazerPedido;
