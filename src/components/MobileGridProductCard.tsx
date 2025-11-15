import { Card } from "@/components/ui/card";
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

interface MobileGridProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onOpenDetails: (product: Product) => void;
}

const MobileGridProductCard = ({ product, onAddToCart, onOpenDetails }: MobileGridProductCardProps) => {
  return (
    <Card onClick={() => onOpenDetails(product)} className="bg-doce-white border-0 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer">
      <div className="p-3 flex flex-col gap-2">
        <div className="w-full aspect-square bg-doce-yellow/10 rounded-lg flex items-center justify-center overflow-hidden">
          <img
            src={product.image || "/placeholder.svg"}
            alt={`Imagem de ${product.nome} - Doce Emergência`}
            className="w-3/4 h-3/4 object-contain"
            loading="lazy"
          />
        </div>
        <div className="min-h-[44px]">
          <p className="text-[11px] font-semibold text-doce-brown leading-snug line-clamp-2">
            {product.nome}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-doce-brown">{product.preco}</span>
          <Button
            onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
            className="bg-doce-yellow text-doce-brown hover:bg-doce-yellow/90 font-bold h-8 px-3 text-[11px] rounded-full"
          >
            Adicionar
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default MobileGridProductCard;
