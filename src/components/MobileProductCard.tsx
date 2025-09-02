import { Button } from "@/components/ui/button";

interface Product {
  id: number;
  nome: string;
  descricao: string;
  preco: string;
  categoria: string;
  peso?: string;
  image?: string;
}

interface MobileProductCardProps {
  product: Product;
  onWhatsAppRedirect: (nome: string) => void;
}

const MobileProductCard = ({ product, onWhatsAppRedirect }: MobileProductCardProps) => {
  return (
    <div className="relative w-full h-[560px] sm:h-[600px] bg-menu-gradient">
      {/* Product Image - Centralized */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -translate-y-8 z-20">
        <div className="relative">
          {/* Product container with soft shadow and floating effect */}
          <div className="relative w-52 h-52 flex items-center justify-center">
            {/* Soft shadow ellipse */}
            <div className="absolute inset-0 bg-doce-brown/10 rounded-full blur-lg translate-y-2"></div>
            {/* Product */}
            <div className="relative w-44 h-44 bg-doce-white/10 rounded-full flex items-center justify-center backdrop-blur-sm overflow-hidden drop-shadow-xl animate-float-slow">
              <img
                src={product.image || "/placeholder.svg"}
                alt={`Imagem de ${product.nome} - Doce Emergência`}
                className="w-40 h-40 object-contain"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Card - Starbucks Style */}
      <div className="absolute bottom-0 left-0 right-0 z-30">
          <div className="mx-6 mb-12 bg-doce-white rounded-3xl p-6 shadow-xl">
            <div className="flex flex-col min-h-[260px]">
              {/* Price and weight */}
              <div className="mb-3 animate-fade-in">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-doce-brown">{product.preco}</span>
                  {product.peso && (
                    <span className="text-xs text-doce-brown/70">• {product.peso}</span>
                  )}
                </div>
              </div>

              {/* Product Name */}
              <div className="mb-2 animate-fade-in">
                <h2 className="text-xl font-bold text-doce-brown leading-tight">
                  {product.nome}
                </h2>
              </div>

              {/* Description */}
              <div className="mb-6 animate-fade-in">
                <p className="text-doce-brown/80 text-sm leading-relaxed">
                  {product.descricao}
                </p>
              </div>

              {/* CTA */}
              <div className="mt-auto">
                <Button
                  onClick={() => onWhatsAppRedirect(product.nome)}
                  aria-label={`Pedir agora ${product.nome}`}
                  className="w-full h-12 bg-doce-yellow text-doce-brown hover:bg-doce-yellow/90 font-bold rounded-full text-base transition-all duration-200 shadow-lg"
                >
                  Pedir agora
                </Button>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default MobileProductCard;