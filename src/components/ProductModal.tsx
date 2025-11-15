
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus } from "lucide-react";
interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: number;
    nome: string;
    descricao: string;
    preco: string;
    categoria: string;
    peso?: string;
    image?: string;
  } | null;
  onAddToCart: (product: {
    id: number;
    nome: string;
    descricao: string;
    preco: string;
    categoria: string;
    peso?: string;
    image?: string;
  }) => void;
}

const ProductModal = ({ isOpen, onClose, product, onAddToCart }: ProductModalProps) => {
  if (!product) return null;

  const handleWhatsAppRedirect = () => {
    const message = `Olá! Quero pedir o doce ${product.nome}.`;
    const whatsappUrl = `https://wa.me/5511976824710?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto bg-doce-white border-0">
        <DialogHeader>
          <DialogTitle className="text-doce-brown text-xl font-bold">
            {product.nome}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Product Image */}
          <div className="h-48 bg-doce-yellow/20 rounded-lg flex items-center justify-center overflow-hidden">
            <img
              src={product.image || "/placeholder.svg"}
              alt={`Imagem de ${product.nome} - Doce Emergência`}
              className="h-full w-auto object-contain"
              loading="lazy"
            />
          </div>
          
          {/* Product Info */}
          <div className="space-y-3">
            <span className="text-xs font-semibold text-doce-yellow bg-doce-yellow/20 px-2 py-1 rounded">
              {product.categoria}
            </span>
            
            <p className="text-doce-brown/70 text-sm leading-relaxed">
              {product.descricao}
            </p>
            
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-doce-brown">
                  {product.preco}
                </span>
                {product.peso && (
                  <span className="text-sm text-doce-brown/70">• {product.peso}</span>
                )}
              </div>
            </div>
          </div>
          
      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          onClick={() => onAddToCart(product)}
          className="w-full bg-doce-yellow text-foreground hover:bg-doce-yellow/90 font-bold py-3"
          aria-label="Adicionar ao carrinho"
        >
          <span className="relative inline-flex items-center justify-center gap-1">
            <ShoppingCart className="h-4 w-4" />
            <Plus className="h-3 w-3 -ml-1" />
          </span>
        </Button>
        <Button
          onClick={handleWhatsAppRedirect}
          className="w-full bg-doce-yellow text-doce-brown hover:bg-doce-yellow/90 font-bold py-3"
        >
          Pedir pelo WhatsApp
        </Button>
      </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;
