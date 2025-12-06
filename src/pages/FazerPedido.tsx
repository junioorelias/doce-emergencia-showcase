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

  // Go to next slide (for clicking on preview)
  const goToNextSlide = () => {
    if (carouselApi) {
      carouselApi.scrollNext();
    }
  };

  // Mobile Categories Component - Icons only, expand on tap
  const MobileCategories = () => (
    <div className="flex justify-center items-center gap-1 px-2 w-full">
      {categoryConfig.map((cat) => {
        const IconComponent = cat.icon;
        const isActive = activeCategory === cat.name;
        
        return (
          <button
            key={cat.name}
            onClick={() => handleCategoryChange(cat.name)}
            className={`
              flex items-center gap-1.5 rounded-full transition-all duration-300 ease-out
              ${isActive 
                ? 'bg-doce-yellow text-doce-brown px-3 py-2 shadow-md' 
                : 'bg-doce-white/10 text-doce-white p-2 hover:bg-doce-white/20'
              }
            `}
          >
            <div className={`
              ${isActive ? 'w-6 h-6' : 'w-8 h-8'} 
              ${isActive ? '' : cat.color} 
              rounded-full flex items-center justify-center transition-all
            `}>
              <IconComponent className={`${isActive ? 'w-4 h-4' : 'w-4 h-4'} ${isActive ? 'text-doce-brown' : 'text-white'}`} />
            </div>
            {isActive && (
              <span className="text-xs font-semibold whitespace-nowrap pr-1 animate-in fade-in slide-in-from-left-2 duration-200">
                {cat.name}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );

  // Desktop Categories Component
  const DesktopCategories = () => (
    <div className="flex justify-center gap-2">
      {categoryConfig.map((cat) => {
        const IconComponent = cat.icon;
        const isActive = activeCategory === cat.name;
        
        return (
          <button
            key={cat.name}
            onClick={() => handleCategoryChange(cat.name)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200
              ${isActive 
                ? 'bg-doce-yellow text-doce-brown shadow-lg scale-105' 
                : 'bg-doce-white/10 text-doce-white hover:bg-doce-white/20'
              }
            `}
          >
            <div className={`w-8 h-8 ${isActive ? 'bg-doce-brown/20' : cat.color} rounded-full flex items-center justify-center`}>
              <IconComponent className={`w-4 h-4 ${isActive ? 'text-doce-brown' : 'text-white'}`} />
            </div>
            <span className="text-sm font-semibold whitespace-nowrap">
              {cat.name}
            </span>
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Main content - fill available height */}
      <div className="flex-1 flex flex-col container mx-auto px-3 md:px-4 py-3 md:py-6 max-h-[calc(100vh-64px)] overflow-hidden">
        
        {/* Header - Compact */}
        <div className="text-center mb-3 md:mb-4 flex-shrink-0">
          <h1 className="text-xl md:text-3xl font-bold text-doce-white">
            Nosso Cardápio
          </h1>
          <p className="text-doce-white/70 text-xs md:text-sm">
            Explore e faça seu pedido
          </p>
        </div>

        {/* Categories */}
        <div className="mb-3 md:mb-4 flex-shrink-0">
          {isMobile ? <MobileCategories /> : <DesktopCategories />}
        </div>

        {/* Product Area - Takes remaining space */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Carousel with Preview */}
          <div className="relative flex-shrink-0">
            <Carousel
              opts={{
                align: "center",
                loop: true,
              }}
              setApi={setCarouselApi}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {currentProducts.map((product, index) => {
                  const isActive = index === currentSlide;
                  return (
                    <CarouselItem 
                      key={product.id} 
                      className={`pl-2 md:pl-4 ${isMobile ? 'basis-[75%]' : 'basis-[50%] md:basis-[40%]'}`}
                    >
                      <div 
                        className={`
                          bg-doce-white rounded-xl overflow-hidden transition-all duration-300 cursor-pointer
                          ${isActive 
                            ? 'shadow-xl scale-100 opacity-100' 
                            : 'shadow-md scale-95 opacity-60 hover:opacity-80'
                          }
                        `}
                        onClick={() => !isActive && carouselApi?.scrollTo(index)}
                      >
                        {/* Product Image - Compact height */}
                        <div className={`
                          w-full bg-gradient-to-br from-doce-yellow/20 to-doce-yellow/5 
                          flex items-center justify-center p-3 md:p-4
                          ${isMobile ? 'h-28' : 'h-36 md:h-44'}
                        `}>
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.nome}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                      </div>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
              
              {/* Navigation arrows - Desktop only */}
              {!isMobile && (
                <>
                  <CarouselPrevious className="left-0 -translate-x-4 bg-doce-white text-doce-brown hover:bg-doce-yellow h-8 w-8" />
                  <CarouselNext className="right-0 translate-x-4 bg-doce-white text-doce-brown hover:bg-doce-yellow h-8 w-8" />
                </>
              )}
            </Carousel>
          </div>

          {/* Product Info - Below carousel, compact */}
          {currentProduct && (
            <div className="flex-1 flex flex-col mt-3 md:mt-4 bg-doce-white rounded-xl p-3 md:p-4 shadow-lg min-h-0">
              {/* Name & Price - Same line on mobile */}
              <div className="flex items-center justify-between mb-1 md:mb-2 flex-shrink-0">
                <h2 className="text-base md:text-xl font-bold text-doce-brown truncate flex-1 mr-2">
                  {currentProduct.nome}
                </h2>
                <p className="text-lg md:text-2xl font-bold text-doce-brown whitespace-nowrap">
                  {currentProduct.preco}
                </p>
              </div>
              
              {/* Description - Limited height */}
              <p className="text-doce-brown/70 text-xs md:text-sm mb-2 md:mb-3 line-clamp-2 flex-shrink-0">
                {currentProduct.descricao}
              </p>

              {/* Quantity & Add to Cart - Row layout on mobile */}
              <div className={`flex items-center gap-3 flex-shrink-0 ${isMobile ? 'flex-row' : 'flex-col'}`}>
                {/* Quantity Selector */}
                <div className="flex items-center gap-2">
                  <span className="text-doce-brown text-xs md:text-sm font-medium">Qtd:</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={decreaseQuantity}
                      className="h-8 w-8 rounded-full border-doce-brown/30 text-doce-brown hover:bg-doce-yellow/20"
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="text-lg font-bold text-doce-brown w-6 text-center">
                      {quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={increaseQuantity}
                      className="h-8 w-8 rounded-full border-doce-brown/30 text-doce-brown hover:bg-doce-yellow/20"
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <Button
                  onClick={handleAddToCart}
                  className={`${isMobile ? 'flex-1' : 'w-full'} h-10 md:h-12 text-sm md:text-base font-bold rounded-lg text-white`}
                  style={{ backgroundColor: '#E53935' }}
                >
                  ADICIONAR AO CARRINHO
                </Button>
              </div>

              {/* Carousel Indicators - Compact */}
              <div className="flex justify-center gap-1.5 mt-2 md:mt-3 flex-shrink-0">
                {currentProducts.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => carouselApi?.scrollTo(index)}
                    className={`h-1.5 rounded-full transition-all duration-200 ${
                      index === currentSlide 
                        ? 'bg-doce-brown w-4' 
                        : 'bg-doce-brown/30 w-1.5 hover:bg-doce-brown/50'
                    }`}
                    aria-label={`Ir para produto ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          )}
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
