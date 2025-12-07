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
const categoryConfig: { name: Category; icon: any; color: string; shortName: string }[] = [
  { name: "Mais Pedidos", icon: Star, color: "bg-amber-500", shortName: "Top" },
  { name: "Dia a Dia", icon: Coffee, color: "bg-orange-500", shortName: "Dia" },
  { name: "Bolo", icon: Cake, color: "bg-pink-500", shortName: "Bolo" },
  { name: "Snacks", icon: Cookie, color: "bg-purple-500", shortName: "Snack" },
  { name: "Tradicionais", icon: Utensils, color: "bg-yellow-600", shortName: "Trad" },
  { name: "Salgados", icon: Sandwich, color: "bg-green-600", shortName: "Salg" },
  { name: "Bebidas", icon: Droplet, color: "bg-blue-500", shortName: "Beb" },
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
    setQuantity(1);
  };

  // Handle modal close
  const handleModalClose = (open: boolean) => {
    setQuickOrderOpen(open);
    // Don't clear initialCartForModal on close - cart is managed in modal
  };

  // Mobile Categories - All icons visible, active expands with short name
  const MobileCategories = () => (
    <div className="flex justify-between items-center w-full px-1">
      {categoryConfig.map((cat) => {
        const IconComponent = cat.icon;
        const isActive = activeCategory === cat.name;
        
        return (
          <button
            key={cat.name}
            onClick={() => handleCategoryChange(cat.name)}
            className={`
              flex items-center justify-center rounded-full transition-all duration-200
              ${isActive 
                ? 'bg-doce-yellow px-2.5 py-1.5 gap-1 shadow-md' 
                : 'p-1.5'
              }
            `}
          >
            <div className={`
              ${isActive ? 'w-5 h-5' : 'w-7 h-7'} 
              ${isActive ? '' : cat.color} 
              rounded-full flex items-center justify-center
            `}>
              <IconComponent className={`w-3.5 h-3.5 ${isActive ? 'text-doce-brown' : 'text-white'}`} />
            </div>
            {isActive && (
              <span className="text-[10px] font-bold text-doce-brown">
                {cat.shortName}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );

  // Desktop Categories
  const DesktopCategories = () => (
    <div className="flex justify-center gap-2 flex-wrap">
      {categoryConfig.map((cat) => {
        const IconComponent = cat.icon;
        const isActive = activeCategory === cat.name;
        
        return (
          <button
            key={cat.name}
            onClick={() => handleCategoryChange(cat.name)}
            className={`
              flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-200
              ${isActive 
                ? 'bg-doce-yellow text-doce-brown shadow-lg scale-105' 
                : 'bg-doce-white/10 text-doce-white hover:bg-doce-white/20'
              }
            `}
          >
            <div className={`w-6 h-6 ${isActive ? 'bg-doce-brown/20' : cat.color} rounded-full flex items-center justify-center`}>
              <IconComponent className={`w-3 h-3 ${isActive ? 'text-doce-brown' : 'text-white'}`} />
            </div>
            <span className="text-xs font-semibold whitespace-nowrap">
              {cat.name}
            </span>
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="h-[100dvh] bg-background flex flex-col overflow-hidden">
      {/* Main content - fixed height, no scroll */}
      <div className="flex-1 flex flex-col px-3 md:px-6 py-2 md:py-4 overflow-hidden">
        
        {/* Header - Very compact */}
        <div className="text-center mb-2 flex-shrink-0">
          <h1 className="text-lg md:text-2xl font-bold text-doce-white">
            Nosso Cardápio
          </h1>
          <p className="text-doce-white/70 text-[10px] md:text-xs">
            Explore e faça seu pedido
          </p>
        </div>

        {/* Categories */}
        <div className="mb-2 md:mb-3 flex-shrink-0">
          {isMobile ? <MobileCategories /> : <DesktopCategories />}
        </div>

        {/* Product Carousel + Info - Compact layout */}
        <div className="flex flex-col">
          {/* Carousel - Image without white card */}
          <div className="relative">
            <Carousel
              opts={{
                align: "center",
                loop: true,
              }}
              setApi={setCarouselApi}
              className="w-full"
            >
              <CarouselContent className="-ml-2">
                {currentProducts.map((product, index) => {
                  const isActive = index === currentSlide;
                  return (
                    <CarouselItem 
                      key={product.id} 
                      className={`pl-2 ${isMobile ? 'basis-[85%]' : 'basis-[50%]'}`}
                    >
                      <div 
                        className={`
                          transition-all duration-300 cursor-pointer
                          ${isActive 
                            ? 'scale-100 opacity-100' 
                            : 'scale-90 opacity-50'
                          }
                        `}
                        onClick={() => !isActive && carouselApi?.scrollTo(index)}
                      >
                        {/* Product Image - Floating, no card */}
                        <div 
                          className="w-full flex items-center justify-center"
                          style={{ height: isMobile ? '22vh' : '24vh' }}
                        >
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.nome}
                            className="max-h-full max-w-full object-contain drop-shadow-lg"
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
                  <CarouselPrevious className="left-2 bg-doce-white text-doce-brown hover:bg-doce-yellow h-7 w-7" />
                  <CarouselNext className="right-2 bg-doce-white text-doce-brown hover:bg-doce-yellow h-7 w-7" />
                </>
              )}
            </Carousel>
          </div>

          {/* Product Info - White card with auto height */}
          {currentProduct && (
            <div className="px-4 mt-3">
              <div className="bg-white rounded-2xl p-4 shadow-lg">
                {/* Name & Price */}
                <div className="text-center">
                  <h2 className="text-base md:text-xl font-bold text-doce-brown">
                    {currentProduct.nome}
                  </h2>
                  <p className="text-lg md:text-2xl font-bold text-doce-red mt-0.5">
                    {currentProduct.preco}
                  </p>
                  
                  {/* Description - Max 2 lines */}
                  <p className="text-doce-brown/70 text-xs md:text-sm line-clamp-2 mt-1">
                    {currentProduct.descricao}
                  </p>
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center justify-center gap-4 mt-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={decreaseQuantity}
                    className="h-9 w-9 rounded-full border-doce-brown/30 text-doce-brown hover:bg-doce-brown/10 bg-transparent"
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
                    className="h-9 w-9 rounded-full border-doce-brown/30 text-doce-brown hover:bg-doce-brown/10 bg-transparent"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {/* Add to Cart Button */}
                <Button
                  onClick={handleAddToCart}
                  className="w-full h-11 text-sm font-bold rounded-lg text-white mt-3"
                  style={{ backgroundColor: '#E53935' }}
                >
                  ADICIONAR AO CARRINHO
                </Button>
              </div>

              {/* Carousel Indicators - Outside white card */}
              <div className="flex justify-center gap-1.5 mt-3">
                {currentProducts.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => carouselApi?.scrollTo(index)}
                    className={`h-1.5 rounded-full transition-all duration-200 ${
                      index === currentSlide 
                        ? 'bg-doce-yellow w-5' 
                        : 'bg-doce-white/30 w-1.5 hover:bg-doce-white/50'
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
