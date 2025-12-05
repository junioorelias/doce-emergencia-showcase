import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import ProductModal from "@/components/ProductModal";
import { useIsMobile } from "@/hooks/use-mobile";
import QuickOrderModal from "@/components/QuickOrderModal";
import { products, Product } from "@/data/products";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Utensils, Cake, Cookie, Coffee, Sandwich, Star, ShoppingBag } from "lucide-react";

const doces = products;

// Category configuration with icons
const categoryConfig = [
  { name: "Dia a Dia", icon: Star, color: "bg-amber-500" },
  { name: "Bolo", icon: Cake, color: "bg-pink-500" },
  { name: "Snacks", icon: Cookie, color: "bg-orange-500" },
  { name: "Tradicionais", icon: Utensils, color: "bg-yellow-600" },
  { name: "Salgados", icon: Sandwich, color: "bg-green-600" },
  { name: "Bebidas", icon: Coffee, color: "bg-blue-500" },
];

const FazerPedido = () => {
  const [searchParams] = useSearchParams();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quickOrderOpen, setQuickOrderOpen] = useState(false);
  const isMobile = useIsMobile();
  
  // Refs for category sections
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // SEO básico para a página
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

  // Handle filter from URL params - open quick order if coming from "favoritos"
  useEffect(() => {
    const filter = searchParams.get('filter');
    if (filter === 'mais-pedidos') {
      setQuickOrderOpen(true);
    }
  }, [searchParams]);

  const handleProductClick = (doce: Product) => {
    setSelectedProduct(doce);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handlePedir = () => {
    setQuickOrderOpen(true);
  };

  const scrollToCategory = (categoryName: string) => {
    const section = sectionRefs.current[categoryName];
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Get products by category
  const getProductsByCategory = (category: string) => {
    return doces.filter(d => d.categoria === category);
  };

  // Get featured product (first one) and recommended products (rest)
  const getFeaturedProduct = (category: string) => {
    const products = getProductsByCategory(category);
    return products[0] || null;
  };

  const getRecommendedProducts = (category: string) => {
    const products = getProductsByCategory(category);
    return products.slice(1);
  };

  return (
    <div className="min-h-screen bg-background py-6">
      <div className="container mx-auto px-4 py-4 md:py-12">
        {/* Header */}
        <div className="text-center mb-6 md:mb-10">
          <h1 className="text-4xl font-bold text-doce-white mb-2 md:mb-4">
            Nosso Cardápio
          </h1>
          <p className="text-doce-white/80 text-lg mb-6">
            Explore nossos produtos e faça seu pedido
          </p>
          
          {/* Quick Order CTA Button */}
          <Button 
            onClick={handlePedir}
            className="bg-doce-yellow text-doce-brown hover:bg-doce-yellow/90 font-bold text-lg px-8 py-6 h-auto rounded-xl shadow-lg"
          >
            <ShoppingBag className="w-5 h-5 mr-2" />
            FAZER PEDIDO RÁPIDO
          </Button>
        </div>

        {/* Category Cards - Horizontal Scroll */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-doce-white mb-4">Categorias</h2>
          <div className="overflow-x-auto pb-2">
            <div className="flex gap-3 min-w-max">
              {categoryConfig.map((cat) => {
                const IconComponent = cat.icon;
                return (
                  <Card
                    key={cat.name}
                    onClick={() => scrollToCategory(cat.name)}
                    className="bg-doce-white border-0 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-105 flex-shrink-0"
                  >
                    <div className="p-4 flex flex-col items-center gap-2 min-w-[100px]">
                      <div className={`w-12 h-12 ${cat.color} rounded-full flex items-center justify-center`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-sm font-semibold text-doce-brown text-center">
                        {cat.name}
                      </span>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>

        {/* Category Sections */}
        <div className="space-y-12">
          {categoryConfig.map((cat) => {
            const featured = getFeaturedProduct(cat.name);
            const recommended = getRecommendedProducts(cat.name);
            const IconComponent = cat.icon;

            if (!featured) return null;

            return (
              <section 
                key={cat.name} 
                ref={(el: HTMLDivElement | null) => { sectionRefs.current[cat.name] = el; }}
                className="scroll-mt-24"
              >
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-10 h-10 ${cat.color} rounded-full flex items-center justify-center`}>
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-doce-white">{cat.name}</h2>
                </div>

                {/* Featured Product (Banner) */}
                <Card 
                  onClick={() => handleProductClick(featured)}
                  className="bg-doce-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer mb-6 overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3 h-48 md:h-auto bg-doce-yellow/20 flex items-center justify-center p-6">
                      <img
                        src={featured.image || "/placeholder.svg"}
                        alt={`${featured.nome} - Doce Emergência`}
                        className="h-32 md:h-40 object-contain"
                        loading="lazy"
                      />
                    </div>
                    <div className="md:w-2/3 p-6 flex flex-col justify-center">
                      <span className="text-xs font-semibold text-doce-yellow bg-doce-yellow/20 px-2 py-1 rounded w-fit mb-2">
                        ⭐ Destaque
                      </span>
                      <h3 className="text-xl md:text-2xl font-bold text-doce-brown mb-2">
                        {featured.nome}
                      </h3>
                      <p className="text-doce-brown/70 mb-4">
                        {featured.descricao}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-doce-brown">
                            {featured.preco}
                          </span>
                          {featured.peso && (
                            <span className="text-sm text-doce-brown/70">• {featured.peso}</span>
                          )}
                        </div>
                        <Button
                          onClick={(e) => { e.stopPropagation(); handlePedir(); }}
                          className="bg-doce-yellow text-doce-brown hover:bg-doce-yellow/90 font-bold"
                        >
                          Pedir
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Recommended Products Grid */}
                {recommended.length > 0 && (
                  <>
                    <h3 className="text-lg font-semibold text-doce-white/80 mb-4">
                      Mais opções
                    </h3>
                    <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-3 lg:grid-cols-4'} gap-4`}>
                      {recommended.map((product) => (
                        <Card
                          key={product.id}
                          onClick={() => handleProductClick(product)}
                          className="bg-doce-white border-0 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-102"
                        >
                          <div className="p-3">
                            <div className="w-full aspect-square bg-doce-yellow/10 rounded-lg flex items-center justify-center overflow-hidden mb-3">
                              <img
                                src={product.image || "/placeholder.svg"}
                                alt={`${product.nome} - Doce Emergência`}
                                className="w-3/4 h-3/4 object-contain"
                                loading="lazy"
                              />
                            </div>
                            <p className="text-sm font-semibold text-doce-brown leading-snug line-clamp-2 mb-2">
                              {product.nome}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-bold text-doce-brown">{product.preco}</span>
                              <Button
                                onClick={(e) => { e.stopPropagation(); handlePedir(); }}
                                className="bg-doce-yellow text-doce-brown hover:bg-doce-yellow/90 font-bold h-8 px-3 text-xs rounded-full"
                              >
                                Pedir
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </>
                )}
              </section>
            );
          })}
        </div>

        {/* Product Modal */}
        <ProductModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          product={selectedProduct}
          onAddToCart={handlePedir}
        />

        {/* Quick Order Modal */}
        <QuickOrderModal open={quickOrderOpen} onOpenChange={setQuickOrderOpen} />

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-doce-white rounded-2xl p-8 shadow-xl max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-doce-brown mb-4">
              Pronto para pedir?
            </h2>
            <p className="text-doce-brown/80 mb-6">
              Clique no botão abaixo para montar seu pedido e enviar pelo WhatsApp!
            </p>
            <Button
              onClick={handlePedir}
              className="bg-doce-yellow text-doce-brown hover:bg-doce-yellow/90 font-bold px-8 py-3"
            >
              FAZER PEDIDO RÁPIDO
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FazerPedido;
