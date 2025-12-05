import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import QuickOrderModal from "@/components/QuickOrderModal";
import { products, Product } from "@/data/products";
import { CartItem } from "@/lib/orderUtils";
import { Button } from "@/components/ui/button";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious,
  type CarouselApi 
} from "@/components/ui/carousel";
import { Utensils, Cake, Cookie, Coffee, Sandwich, Star, Minus, Plus, Droplet } from "lucide-react";

type Category = "Mais Pedidos" | "Dia a Dia" | "Bolo" | "Snacks" | "Tradicionais" | "Salgados" | "Bebidas";

// Category configuration
const categoryConfig: { name: Category; icon: any; color: string }[] = [
  { name: "Mais Pedidos", icon: Star, color: "bg-amber-500" },
  { name: "Dia a Dia", icon: Coffee, color: "bg-orange-500" },
  { name: "Bolo", icon: Cake, color: "bg-pink-500" },
  { name: "Snacks", icon: Cookie, color: "bg-purple-500" },
  { name: "Tradicionais", icon: Utensils, color: "bg-yellow-600" },
  { name: "Salgados", icon: Sandwich, color: "bg-green-600" },
  { name: "Bebidas", icon: Droplet, color: "bg-blue-500" },
];

// IDs dos mais pedidos
const mostOrderedIds = [1, 2, 6, 9, 19];

const FazerPedido = () => {
  const [searchParams] = useSearchParams();
  const isMobile = useIsMobile();
  
  // State
  const [activeCategory, setActiveCategory] = useState<Category>("Mais Pedidos");
  const [quantity, setQuantity] = useState(1);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [quickOrderOpen, setQuickOrderOpen] = useState(false);
  const [initialCartForModal, setInitialCartForModal] = useState<CartItem[]>([]);

  // Get products by category
  const getProductsByCategory = useCallback((category: Category): Product[] => {
    if (category === "Mais Pedidos") {
      return products.filter(p => mostOrderedIds.includes(p.id));
    }
    return products.filter(p => p.categoria === category);
  }, []);

  const currentProducts = getProductsByCategory(activeCategory);
  const currentProduct = currentProducts[currentSlide] || null;

  // SEO
  useEffect(() => {
    document.title = "Cardápio - Doce Emergência | Peça pelo WhatsApp";
    let meta = document.querySelector(`meta[name="description"]`);
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", "Cardápio Doce Emergência: escolha seus itens e faça seu pedido rápido pelo WhatsApp.");

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = window.location.href;
  }, []);

  // Handle URL params
  useEffect(() => {
    const filter = searchParams.get('filter');
    if (filter === 'mais-pedidos') {
      setActiveCategory("Mais Pedidos");
    }
  }, [searchParams]);

  // Handle carousel slide change
  useEffect(() => {
    if (!carouselApi) return;

    const onSelect = () => {
      setCurrentSlide(carouselApi.selectedScrollSnap());
      setQuantity(1); // Reset quantity when slide changes
    };

    carouselApi.on("select", onSelect);
    return () => {
      carouselApi.off("select", onSelect);
    };
  }, [carouselApi]);

  // Handle category change
  const handleCategoryChange = (category: Category) => {
    setActiveCategory(category);
    setCurrentSlide(0);
    setQuantity(1);
    // Scroll carousel to start
    if (carouselApi) {
      carouselApi.scrollTo(0);
    }
  };

  // Quantity handlers
  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

  // Add to cart and open modal
  const handleAddToCart = () => {
    if (!currentProduct) return;
    
    const cartItem: CartItem = {
      id: currentProduct.id,
      nome: currentProduct.nome,
      preco: currentProduct.preco,
      quantidade: quantity
    };
    
    setInitialCartForModal([cartItem]);
    setQuickOrderOpen(true);
    setQuantity(1); // Reset quantity after adding
  };

  // Handle modal close - reset initial cart
  const handleModalClose = (open: boolean) => {
    setQuickOrderOpen(open);
    if (!open) {
      setInitialCartForModal([]);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 md:py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-doce-white mb-2">
            Nosso Cardápio
          </h1>
          <p className="text-doce-white/80 text-base md:text-lg">
            Explore nossos produtos e faça seu pedido
          </p>
        </div>

        {/* Categories - Fixed horizontal row */}
        <div className="mb-8">
          <div className="flex justify-center">
            <div className={`flex gap-2 md:gap-3 ${isMobile ? 'overflow-x-auto pb-2 max-w-full' : 'flex-wrap justify-center'}`}>
              {categoryConfig.map((cat) => {
                const IconComponent = cat.icon;
                const isActive = activeCategory === cat.name;
                
                return (
                  <button
                    key={cat.name}
                    onClick={() => handleCategoryChange(cat.name)}
                    className={`
                      flex flex-col items-center gap-1 p-3 md:p-4 rounded-xl transition-all duration-200 flex-shrink-0
                      ${isActive 
                        ? 'bg-doce-yellow text-doce-brown scale-105 shadow-lg' 
                        : 'bg-doce-white/10 text-doce-white hover:bg-doce-white/20'
                      }
                    `}
                  >
                    <div className={`w-10 h-10 md:w-12 md:h-12 ${isActive ? 'bg-doce-brown/20' : cat.color} rounded-full flex items-center justify-center`}>
                      <IconComponent className={`w-5 h-5 md:w-6 md:h-6 ${isActive ? 'text-doce-brown' : 'text-white'}`} />
                    </div>
                    <span className="text-xs md:text-sm font-semibold whitespace-nowrap">
                      {cat.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Product Carousel */}
        <div className="max-w-xl mx-auto">
          <Carousel
            opts={{
              align: "center",
              loop: true,
            }}
            setApi={setCarouselApi}
            className="w-full"
          >
            <CarouselContent>
              {currentProducts.map((product) => (
                <CarouselItem key={product.id}>
                  <div className="bg-doce-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Product Image */}
                    <div className="w-full aspect-square bg-gradient-to-br from-doce-yellow/20 to-doce-yellow/5 flex items-center justify-center p-8">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.nome}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            {/* Navigation arrows - only on desktop */}
            {!isMobile && (
              <>
                <CarouselPrevious className="left-0 -translate-x-12 bg-doce-white text-doce-brown hover:bg-doce-yellow" />
                <CarouselNext className="right-0 translate-x-12 bg-doce-white text-doce-brown hover:bg-doce-yellow" />
              </>
            )}
          </Carousel>

          {/* Product Info - Below carousel */}
          {currentProduct && (
            <div className="mt-6 bg-doce-white rounded-2xl p-6 shadow-lg">
              {/* Product Name */}
              <h2 className="text-xl md:text-2xl font-bold text-doce-brown text-center mb-2">
                {currentProduct.nome}
              </h2>
              
              {/* Price */}
              <p className="text-2xl md:text-3xl font-bold text-doce-brown text-center mb-3">
                {currentProduct.preco}
              </p>
              
              {/* Description */}
              <p className="text-doce-brown/70 text-center text-sm md:text-base mb-6">
                {currentProduct.descricao}
              </p>

              {/* Quantity Selector */}
              <div className="flex items-center justify-center gap-4 mb-6">
                <span className="text-doce-brown font-medium">Quantidade:</span>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={decreaseQuantity}
                    className="h-10 w-10 rounded-full border-doce-brown/30 text-doce-brown hover:bg-doce-yellow/20"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="text-xl font-bold text-doce-brown w-8 text-center">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={increaseQuantity}
                    className="h-10 w-10 rounded-full border-doce-brown/30 text-doce-brown hover:bg-doce-yellow/20"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <Button
                onClick={handleAddToCart}
                className="w-full h-14 text-lg font-bold rounded-xl text-white"
                style={{ backgroundColor: '#E53935' }}
              >
                ADICIONAR AO CARRINHO
              </Button>
            </div>
          )}

          {/* Carousel Indicators */}
          <div className="flex justify-center gap-2 mt-4">
            {currentProducts.map((_, index) => (
              <button
                key={index}
                onClick={() => carouselApi?.scrollTo(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentSlide 
                    ? 'bg-doce-yellow w-6' 
                    : 'bg-doce-white/40 hover:bg-doce-white/60'
                }`}
                aria-label={`Ir para produto ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Quick Order Modal */}
        <QuickOrderModal 
          open={quickOrderOpen} 
          onOpenChange={handleModalClose}
          initialCart={initialCartForModal.length > 0 ? initialCartForModal : undefined}
          initialStep={initialCartForModal.length > 0 ? 3 : undefined}
        />
      </div>
    </div>
  );
};

export default FazerPedido;