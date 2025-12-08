import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Minus, Trash2, ArrowLeft, Package, ShoppingCart, Cake, Coffee, Utensils, Droplet, Cookie, CheckCircle2 } from "lucide-react";
import { products, Product } from "@/data/products";
import { formatWhatsAppMessage, generateWhatsAppUrl, formatPrice } from "@/lib/orderUtils";
import { useCart } from "@/contexts/CartContext";
import QuickOrderProgressBar from "./QuickOrderProgressBar";
import { toast } from "sonner";

interface QuickOrderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialStep?: 1 | 2 | 3 | 4 | 5;
}

type Category = "Mais Pedidos" | "Todos" | "Tradicionais" | "Dia a Dia" | "Bolo" | "Snacks" | "Salgados" | "Bebidas";

const categoryIcons: Record<Category, any> = {
  "Mais Pedidos": Package,
  "Todos": ShoppingCart,
  "Tradicionais": Cookie,
  "Dia a Dia": Coffee,
  "Bolo": Cake,
  "Snacks": Coffee,
  "Salgados": Utensils,
  "Bebidas": Droplet,
};

const QuickOrderModal = ({ open, onOpenChange, initialStep }: QuickOrderModalProps) => {
  const { cart, addToCart, increaseQuantity, decreaseQuantity, removeItem, clearCart, calculateTotal } = useCart();
  
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [street, setStreet] = useState("");
  const [complement, setComplement] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [payment, setPayment] = useState("");
  const [progress, setProgress] = useState(2);
  const [isLoading, setIsLoading] = useState(false);

  // Handle initial step when opening from Cardápio
  useEffect(() => {
    if (open && initialStep) {
      setStep(initialStep);
      if (initialStep === 3) setProgress(65);
      else if (initialStep === 4) setProgress(95);
    }
  }, [open, initialStep]);

  // Reset step/progress when modal closes (cart persists)
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setStep(1);
        setProgress(2);
        setSelectedCategory(null);
      }, 300);
    }
  }, [open]);

  const categories: Category[] = [
    "Mais Pedidos",
    "Todos",
    "Tradicionais",
    "Dia a Dia",
    "Bolo",
    "Snacks",
    "Salgados",
    "Bebidas",
  ];

  const mostOrderedIds = [1, 2, 6, 9, 19];

  const getFilteredProducts = (): Product[] => {
    if (!selectedCategory) return [];
    if (selectedCategory === "Todos") return products;
    if (selectedCategory === "Mais Pedidos") {
      return products.filter(p => mostOrderedIds.includes(p.id));
    }
    return products.filter(p => p.categoria === selectedCategory);
  };

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      nome: product.nome,
      preco: product.preco,
      quantidade: 1
    });
    toast.success(`${product.nome} adicionado!`);
  };

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setStep(2);
    setProgress(30);
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
      setProgress(2);
    } else if (step === 3) {
      setStep(2);
      setProgress(30);
    } else if (step === 4) {
      setStep(3);
      setProgress(65);
    }
  };

  const handleBackToCategories = () => {
    setStep(1);
    setProgress(2);
    setSelectedCategory(null);
  };

  const handleViewCart = () => {
    setStep(3);
    setProgress(65);
  };

  const handleCheckout = () => {
    setStep(4);
    setProgress(95);
  };

  const handleSendOrder = async () => {
    if (!customerName || !street || !neighborhood || !city || !payment) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    setProgress(100);
    setStep(5);
    setIsLoading(true);

    const address = `${street}${complement ? ', ' + complement : ''}, ${neighborhood}, ${city}`;
    const message = formatWhatsAppMessage(cart, customerName, address, payment);
    const whatsappUrl = generateWhatsAppUrl(message);

    await new Promise(resolve => setTimeout(resolve, 3000));

    window.location.href = whatsappUrl;
    
    setTimeout(() => {
      clearCart();
      setCustomerName("");
      setStreet("");
      setComplement("");
      setNeighborhood("");
      setCity("");
      setPayment("");
      setStep(1);
      setProgress(2);
      setSelectedCategory(null);
      setIsLoading(false);
      onOpenChange(false);
    }, 500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] md:max-w-2xl max-h-[90vh] bg-white rounded-2xl p-0 overflow-hidden">
        <div className="p-4 md:p-6">
          <QuickOrderProgressBar progress={progress} />

          {step === 5 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <CheckCircle2 className="w-16 h-16 mb-4" style={{ color: '#49C861' }} />
              <h3 className="text-xl font-bold text-doce-brown mb-2">
                Pedido realizado com sucesso.
              </h3>
              <p className="text-sm text-doce-brown/70">
                Aguarde! Estamos direcionando seu pedido para o WhatsApp.
              </p>
            </div>
          ) : step === 1 ? (
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-doce-brown mb-4 md:mb-6 text-center">
                Escolha uma categoria
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
                {categories.map((category) => {
                  const Icon = categoryIcons[category];
                  return (
                    <Button
                      key={category}
                      onClick={() => handleCategorySelect(category)}
                      className="h-16 md:h-20 flex flex-col items-center justify-center gap-1 md:gap-2 text-white border-0"
                      style={{ backgroundColor: '#E53935' }}
                    >
                      <Icon className="w-5 h-5 md:w-6 md:h-6" />
                      <span className="text-[10px] md:text-xs font-medium">{category}</span>
                    </Button>
                  );
                })}
              </div>
            </div>
          ) : step === 2 ? (
            <div>
              <div className="flex items-center justify-between mb-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBack}
                  className="text-doce-brown p-1"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Voltar
                </Button>
                <h2 className="text-lg font-bold text-doce-brown">{selectedCategory}</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setStep(1);
                    setProgress(2);
                  }}
                  className="text-doce-brown text-xs p-1"
                >
                  Trocar
                </Button>
              </div>

              <div className="max-h-[45vh] overflow-y-auto pr-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {getFilteredProducts().map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center gap-3 p-2 bg-white rounded-lg border border-gray-200"
                    >
                      <img
                        src={product.image}
                        alt={product.nome}
                        className="w-14 h-14 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 flex items-center justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-doce-brown text-xs leading-tight mb-0.5">
                            {product.nome}
                          </h3>
                          <p className="text-xs font-semibold text-doce-brown">
                            {product.preco}
                          </p>
                        </div>
                        <Button
                          onClick={() => handleAddToCart(product)}
                          className="text-white font-bold text-xs px-2 py-1 h-7"
                          style={{ backgroundColor: '#E53935' }}
                        >
                          +1
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {cart.length > 0 && (
                <div className="mt-3 pt-3 border-t">
                  <Button
                    onClick={handleViewCart}
                    className="w-full text-white font-bold"
                    style={{ backgroundColor: '#E53935' }}
                  >
                    Visualizar Carrinho ({cart.length})
                  </Button>
                </div>
              )}
            </div>
          ) : step === 3 ? (
            <div>
              <div className="flex items-center justify-between mb-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackToCategories}
                  className="text-doce-brown p-1"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Continuar comprando
                </Button>
                <h2 className="text-lg font-bold text-doce-brown">Carrinho</h2>
                <div></div>
              </div>

              <div className="max-h-[40vh] overflow-y-auto pr-2">
                {cart.map((item) => {
                  const product = products.find(p => p.id === item.id);
                  return (
                    <div
                      key={item.id}
                      className="flex items-center gap-2 p-2 mb-2 bg-white rounded-lg border border-gray-200"
                    >
                      {product && (
                        <img
                          src={product.image}
                          alt={item.nome}
                          className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-doce-brown text-xs">{item.nome}</h3>
                        <p className="text-doce-brown/70 text-xs">{item.preco}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => decreaseQuantity(item.id)}
                          className="h-7 w-7"
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-6 text-center font-bold text-sm">{item.quantidade}</span>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => increaseQuantity(item.id)}
                          className="h-7 w-7"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => removeItem(item.id)}
                          className="h-7 w-7"
                          style={{ color: '#E53935' }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-3 pt-3 border-t">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-base font-bold text-doce-brown">Total:</span>
                  <span className="text-xl font-bold text-doce-brown">
                    {formatPrice(calculateTotal())}
                  </span>
                </div>
                <Button
                  onClick={handleCheckout}
                  className="w-full text-white font-bold"
                  style={{ backgroundColor: '#E53935' }}
                  disabled={cart.length === 0}
                >
                  Finalizar pedido
                </Button>
              </div>
            </div>
          ) : step === 4 ? (
            <div>
              <div className="flex items-center justify-between mb-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBack}
                  className="text-doce-brown p-1"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Voltar
                </Button>
                <h2 className="text-lg font-bold text-doce-brown">Informações</h2>
                <div></div>
              </div>

              {/* Compact form - no scroll needed */}
              <div className="space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-doce-brown mb-1">
                      Nome completo *
                    </label>
                    <Input
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Seu nome"
                      className="border-doce-brown/20 h-9 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-doce-brown mb-1">
                      Rua e número *
                    </label>
                    <Input
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="Ex: Rua das Flores, 123"
                      className="border-doce-brown/20 h-9 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-doce-brown mb-1">
                      Complemento
                    </label>
                    <Input
                      value={complement}
                      onChange={(e) => setComplement(e.target.value)}
                      placeholder="Ex: Apto 45"
                      className="border-doce-brown/20 h-9 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-doce-brown mb-1">
                      Bairro *
                    </label>
                    <Input
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                      placeholder="Seu bairro"
                      className="border-doce-brown/20 h-9 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-doce-brown mb-1">
                    Cidade *
                  </label>
                  <Input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Sua cidade"
                    className="border-doce-brown/20 h-9 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-doce-brown mb-1">
                    Forma de pagamento *
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {["Pix", "Dinheiro", "Débito/Crédito"].map((method) => (
                      <Button
                        key={method}
                        onClick={() => setPayment(method)}
                        variant={payment === method ? "default" : "outline"}
                        className={`h-9 text-xs ${
                          payment === method
                            ? "text-white font-medium"
                            : "border-doce-brown/20 text-doce-brown hover:bg-doce-brown/5"
                        }`}
                        style={payment === method ? { backgroundColor: '#E53935' } : {}}
                      >
                        {method}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t">
                <Button
                  onClick={handleSendOrder}
                  className="w-full text-white font-bold"
                  style={{ backgroundColor: '#E53935' }}
                  disabled={!customerName || !street || !neighborhood || !city || !payment || isLoading}
                >
                  ENVIAR PEDIDO
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickOrderModal;
