import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus } from "lucide-react";
interface Product {
  id: number;
  nome: string;
  descricao: string;
  preco: string;
  categoria: string;
  peso?: string;
  image?: string;
}

interface DesktopProductCardProps {
  product: Product;
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onPedir: (nome: string) => void;
}

const DesktopProductCard = ({ product, onProductClick, onAddToCart, onPedir }: DesktopProductCardProps) => {
  return (
    <Card 
      className="bg-doce-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border-0 cursor-pointer"
      onClick={() => onProductClick(product)}
    >
      <div className="p-2 md:p-4 lg:p-6">
        <div className="h-16 md:h-24 lg:h-32 bg-doce-yellow/20 rounded-lg mb-2 flex items-center justify-center">
          <img
            src={product.image || "/doce-placeholder.svg"}
            alt={`Imagem de ${product.nome} - Doce Emergência`}
            className="h-12 md:h-20 lg:h-28 object-contain"
            loading="lazy"
          />
        </div>
        
        <div className="space-y-1">
          <span className="text-xs font-semibold text-doce-yellow bg-doce-yellow/20 px-1 py-0.5 rounded block md:hidden lg:block">
            {product.categoria}
          </span>
          
          <h3 className="text-xs md:text-sm lg:text-lg font-bold text-doce-brown leading-tight">
            {product.nome}
          </h3>
          
          {/* Hide description, price and button on mobile/tablet */}
          <div className="hidden lg:block">
            <p className="text-doce-brown/70 text-sm leading-relaxed mb-2">
              {product.descricao}
            </p>
            
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-doce-brown">
                  {product.preco}
                </span>
                {product.peso && (
                  <span className="text-xs text-doce-brown/70">• {product.peso}</span>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPedir(product.nome);
                  }}
                  className="bg-doce-yellow text-doce-brown hover:bg-doce-yellow/90 font-bold text-sm px-3 py-1"
                >
                  Pedir
                </Button>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart(product);
                  }}
                  className="h-9 w-9 p-0 bg-doce-yellow text-doce-brown hover:bg-doce-yellow/90"
                  aria-label="Adicionar ao carrinho"
                >
                  <span className="relative inline-block">
                    <ShoppingCart className="h-4 w-4" />
                    <Plus className="h-3 w-3 absolute -top-1 -right-2" />
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DesktopProductCard;