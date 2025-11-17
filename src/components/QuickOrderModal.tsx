import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Minus, Trash2, ArrowLeft, Package, ShoppingCart, Cake, Coffee, Utensils, Droplet, Cookie, CheckCircle2 } from "lucide-react";
import { products, Product } from "@/data/products";
import { formatWhatsAppMessage, generateWhatsAppUrl, parsePrice, formatPrice, CartItem } from "@/lib/orderUtils";
import QuickOrderProgressBar from "./QuickOrderProgressBar";
import { toast } from "sonner";

interface QuickOrderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

const QuickOrderModal = ({ open, onOpenChange }: QuickOrderModalProps) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [street, setStreet] = useState("");
  const [complement, setComplement] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [payment, setPayment] = useState("");
  const [progress, setProgress] = useState(2);
  const [isLoading, setIsLoading] = useState(false);

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

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      increaseQuantity(product.id);
    } else {
      setCart([...cart, { 
        id: product.id, 
        nome: product.nome, 
        preco: product.preco, 
        quantidade: 1
      }]);
    }
    toast.success(`${product.nome} adicionado!`);
  };

  const increaseQuantity = (id: number) => {
    setCart(cart.map(item => 
      item.id === id ? { ...item, quantidade: item.quantidade + 1 } : item
    ));
  };

  const decreaseQuantity = (id: number) => {
    setCart(cart.map(item => 
      item.id === id && item.quantidade > 1 
        ? { ...item, quantidade: item.quantidade - 1 } 
        : item
    ));
  };

  const removeItem = (id: number) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const calculateTotal = (): number => {
    return cart.reduce((sum, item) => {
      return sum + (parsePrice(item.preco) * item.quantidade);
    }, 0);
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

    window.open(whatsappUrl, '_blank');
    
    setCart([]);
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
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] md:max-w-2xl max-h-[90vh] p-0">
        <div className="p-6">
          <QuickOrderProgressBar progress={progress} />

          {step === 5 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
              <h3 className="text-xl font-bold text-doce-brown mb-2">
                Pedido realizado com sucesso.
              </h3>
              <p className="text-sm text-doce-brown/70">
                Aguarde! Estamos direcionando seu pedido para o whatsapp.
              </p>
            </div>
          ) : step === 1 ? (
            <div>
              <h2 className="text-2xl font-bold text-doce-brown mb-6 text-center">
                Escolha uma categoria
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {categories.map((category) => {
                  const Icon = categoryIcons[category];
                  return (
                    <Button
                      key={category}
                      onClick={() => handleCategorySelect(category)}
                      className="h-24 flex flex-col items-center justify-center gap-2 bg-doce-yellow/10 hover:bg-doce-yellow text-doce-brown border-2 border-doce-yellow/20 hover:border-doce-yellow"
                    >
                      <Icon className="w-8 h-8" />
                      <span className="text-sm font-medium">{category}</span>
                    </Button>
                  );
                })}
              </div>
            </div>
          ) : step === 2 ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBack}
                  className="text-doce-brown"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
                <h2 className="text-xl font-bold text-doce-brown">{selectedCategory}</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setStep(1);
                    setProgress(2);
                  }}
                  className="text-doce-brown text-xs"
                >
                  Trocar
                </Button>
              </div>

              <ScrollArea className="h-[400px] pr-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {getFilteredProducts().map((product) => (
                    <div
                      key={product.id}
                      className="bg-white rounded-lg border-2 border-doce-brown/10 overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <img
                        src={product.image}
                        alt={product.nome}
                        className="w-full aspect-square object-cover"
                      />
                      <div className="p-3">
                        <h3 className="font-bold text-doce-brown text-sm mb-1">
                          {product.nome}
                        </h3>
                        <p className="text-lg font-bold text-doce-brown mb-2">
                          {product.preco}
                        </p>
                        <Button
                          onClick={() => addToCart(product)}
                          className="w-full bg-red-600 hover:bg-red-700 text-white"
                          size="sm"
                        >
                          +1
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {cart.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <Button
                    onClick={handleViewCart}
                    className="w-full bg-doce-yellow text-doce-brown hover:bg-doce-yellow/90"
                  >
                    Visualizar Carrinho ({cart.length})
                  </Button>
                </div>
              )}
            </div>
          ) : step === 3 ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBack}
                  className="text-doce-brown"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Continuar
                </Button>
                <h2 className="text-xl font-bold text-doce-brown">Carrinho</h2>
                <div></div>
              </div>

              <ScrollArea className="h-[350px] pr-4">
                {cart.map((item) => {
                  const product = products.find(p => p.id === item.id);
                  return (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-4 mb-3 bg-white rounded-lg border-2 border-doce-brown/10"
                    >
                      {product && (
                        <img
                          src={product.image}
                          alt={item.nome}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-bold text-doce-brown text-sm">{item.nome}</h3>
                        <p className="text-doce-brown/70 text-sm">{item.preco}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => decreaseQuantity(item.id)}
                          className="h-8 w-8"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-8 text-center font-bold">{item.quantidade}</span>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => increaseQuantity(item.id)}
                          className="h-8 w-8"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => removeItem(item.id)}
                          className="h-8 w-8 text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </ScrollArea>

              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-bold text-doce-brown">Total:</span>
                  <span className="text-2xl font-bold text-doce-brown">
                    {formatPrice(calculateTotal())}
                  </span>
                </div>
                <Button
                  onClick={handleCheckout}
                  className="w-full bg-doce-yellow text-doce-brown hover:bg-doce-yellow/90"
                  disabled={cart.length === 0}
                >
                  Finalizar Pedido
                </Button>
              </div>
            </div>
          ) : step === 4 ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBack}
                  className="text-doce-brown"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
                <h2 className="text-xl font-bold text-doce-brown">Informações</h2>
                <div></div>
              </div>

              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-doce-brown mb-1">
                      Nome completo *
                    </label>
                    <Input
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Seu nome"
                      className="border-doce-brown/20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-doce-brown mb-1">
                      Rua e número *
                    </label>
                    <Input
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="Ex: Rua das Flores, 123"
                      className="border-doce-brown/20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-doce-brown mb-1">
                      Complemento (opcional)
                    </label>
                    <Input
                      value={complement}
                      onChange={(e) => setComplement(e.target.value)}
                      placeholder="Ex: Apto 45"
                      className="border-doce-brown/20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-doce-brown mb-1">
                      Bairro *
                    </label>
                    <Input
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                      placeholder="Seu bairro"
                      className="border-doce-brown/20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-doce-brown mb-1">
                      Cidade *
                    </label>
                    <Input
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Sua cidade"
                      className="border-doce-brown/20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-doce-brown mb-2">
                      Forma de pagamento *
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {["Pix", "Dinheiro", "Débito/Crédito"].map((method) => (
                        <Button
                          key={method}
                          onClick={() => setPayment(method)}
                          variant={payment === method ? "default" : "outline"}
                          className={
                            payment === method
                              ? "bg-red-600 hover:bg-red-700 text-white"
                              : "border-doce-brown/20 text-doce-brown hover:bg-doce-brown/5"
                          }
                        >
                          {method}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollArea>

              <div className="mt-4 pt-4 border-t">
                <Button
                  onClick={handleSendOrder}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold"
                  disabled={!customerName || !street || !neighborhood || !city || !payment || isLoading}
                >
                  ENVIAR
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
