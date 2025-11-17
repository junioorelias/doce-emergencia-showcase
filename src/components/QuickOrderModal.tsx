import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import QuickOrderProgressBar from "./QuickOrderProgressBar";
import { products, Product } from "@/data/products";
import { CartItem, formatWhatsAppMessage, generateWhatsAppUrl, parsePrice, formatPrice } from "@/lib/orderUtils";
import { Plus, Minus, Trash2, ArrowLeft, ShoppingCart, TrendingUp, Package, Cake, Pizza, Coffee, Cookie } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QuickOrderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Category = "Mais Pedidos" | "Todos" | "Tradicionais" | "Dia a Dia" | "Bolo" | "Salgados" | "Bebidas" | "Snacks";

const categoryIcons: Record<Category, any> = {
  "Mais Pedidos": TrendingUp,
  "Todos": Package,
  "Tradicionais": Cookie,
  "Dia a Dia": Coffee,
  "Bolo": Cake,
  "Salgados": Pizza,
  "Bebidas": Coffee,
  "Snacks": Cookie,
};

const QuickOrderModal = ({ open, onOpenChange }: QuickOrderModalProps) => {
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState("");
  const { toast } = useToast();

  const progress = step === 1 ? 33 : step === 2 ? 66 : step === 3 ? 66 : 100;

  const mostOrderedIds = [1, 2, 6, 9, 19]; // IDs dos produtos mais pedidos

  const getFilteredProducts = (): Product[] => {
    if (!selectedCategory) return [];
    if (selectedCategory === "Todos") return products;
    if (selectedCategory === "Mais Pedidos") {
      return products.filter(p => mostOrderedIds.includes(p.id));
    }
    return products.filter(p => p.categoria === selectedCategory);
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        );
      }
      return [...prev, {
        id: product.id,
        nome: product.nome,
        preco: product.preco,
        quantidade: 1
      }];
    });
    toast({
      title: "Adicionado ao carrinho",
      description: product.nome,
    });
  };

  const increaseQuantity = (id: number) => {
    setCart(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantidade: item.quantidade + 1 } : item
      )
    );
  };

  const decreaseQuantity = (id: number) => {
    setCart(prev =>
      prev.map(item =>
        item.id === id && item.quantidade > 1
          ? { ...item, quantidade: item.quantidade - 1 }
          : item
      ).filter(item => item.quantidade > 0)
    );
  };

  const removeItem = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const calculateTotal = (): number => {
    return cart.reduce((sum, item) => {
      return sum + (parsePrice(item.preco) * item.quantidade);
    }, 0);
  };

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setStep(2);
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
      setSelectedCategory(null);
    } else if (step === 3) {
      setStep(2);
    } else if (step === 4) {
      setStep(3);
    }
  };

  const handleViewCart = () => {
    setStep(3);
  };

  const handleCheckout = () => {
    setStep(4);
  };

  const handleSendOrder = () => {
    if (!customerName.trim() || customerName.length < 3) {
      toast({
        title: "Nome inválido",
        description: "Por favor, insira seu nome completo.",
        variant: "destructive",
      });
      return;
    }
    if (!address.trim() || address.length < 10) {
      toast({
        title: "Endereço inválido",
        description: "Por favor, insira seu endereço completo.",
        variant: "destructive",
      });
      return;
    }
    if (!payment) {
      toast({
        title: "Forma de pagamento",
        description: "Por favor, selecione uma forma de pagamento.",
        variant: "destructive",
      });
      return;
    }

    const message = formatWhatsAppMessage(cart, customerName, address, payment);
    const whatsappUrl = generateWhatsAppUrl(message);
    
    window.open(whatsappUrl, '_blank');
    
    // Resetar modal
    setStep(1);
    setSelectedCategory(null);
    setCart([]);
    setCustomerName("");
    setAddress("");
    setPayment("");
    onOpenChange(false);
    
    toast({
      title: "Pedido enviado!",
      description: "Você será redirecionado para o WhatsApp.",
    });
  };

  const categories: Category[] = [
    "Mais Pedidos",
    "Todos",
    "Tradicionais",
    "Dia a Dia",
    "Bolo",
    "Salgados",
    "Bebidas",
    "Snacks",
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] md:max-w-2xl max-h-[90vh] p-0 bg-card">
        <div className="p-6">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-2xl font-bold text-doce-brown">
              Faça um Pedido Rápido!
            </DialogTitle>
          </DialogHeader>

          <QuickOrderProgressBar progress={progress} />

          <ScrollArea className="h-[calc(90vh-220px)] pr-4">
            {/* ETAPA 1: Escolha de Categoria */}
            {step === 1 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {categories.map((category) => {
                  const Icon = categoryIcons[category];
                  return (
                    <Button
                      key={category}
                      onClick={() => handleCategorySelect(category)}
                      variant="outline"
                      className="h-24 flex flex-col items-center justify-center gap-2 bg-doce-yellow/10 hover:bg-doce-yellow hover:text-doce-brown border-2 border-doce-yellow/30 transition-all"
                    >
                      <Icon className="w-6 h-6" />
                      <span className="font-semibold text-sm text-center">{category}</span>
                    </Button>
                  );
                })}
              </div>
            )}

            {/* ETAPA 2: Montar Carrinho */}
            {step === 2 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Button
                    variant="ghost"
                    onClick={handleBack}
                    className="text-doce-brown"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Voltar
                  </Button>
                  <h3 className="font-bold text-doce-brown">{selectedCategory}</h3>
                  <Button
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="text-sm"
                  >
                    Trocar
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {getFilteredProducts().map((product) => (
                    <div
                      key={product.id}
                      className="border-2 border-doce-yellow/20 rounded-lg p-4 bg-card hover:border-doce-yellow/50 transition-all"
                    >
                      <h4 className="font-bold text-doce-brown mb-1">{product.nome}</h4>
                      <p className="text-sm text-doce-brown/70 mb-2">{product.descricao}</p>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-doce-red">{product.preco}</span>
                        <Button
                          onClick={() => addToCart(product)}
                          size="sm"
                          className="bg-doce-yellow hover:bg-doce-yellow/90 text-doce-brown"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Adicionar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {cart.length > 0 && (
                  <div className="fixed bottom-0 left-0 right-0 p-4 bg-card border-t-2 border-doce-yellow">
                    <div className="max-w-2xl mx-auto">
                      <Button
                        onClick={handleViewCart}
                        className="w-full bg-doce-yellow hover:bg-doce-yellow/90 text-doce-brown font-bold py-6"
                      >
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        Visualizar Carrinho ({cart.length} {cart.length === 1 ? 'item' : 'itens'})
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ETAPA 3: Revisar Carrinho */}
            {step === 3 && (
              <div>
                <div className="flex items-center mb-4">
                  <Button
                    variant="ghost"
                    onClick={handleBack}
                    className="text-doce-brown"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Continuar Comprando
                  </Button>
                </div>

                <div className="space-y-4">
                  {cart.map((item) => {
                    const subtotal = parsePrice(item.preco) * item.quantidade;
                    return (
                      <div
                        key={item.id}
                        className="border-2 border-doce-yellow/20 rounded-lg p-4 bg-card"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h4 className="font-bold text-doce-brown">{item.nome}</h4>
                            <p className="text-sm text-doce-brown/70">{item.preco} cada</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="text-doce-red hover:text-doce-red"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => decreaseQuantity(item.id)}
                              className="h-8 w-8 p-0"
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="font-bold text-doce-brown min-w-[2rem] text-center">
                              {item.quantidade}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => increaseQuantity(item.id)}
                              className="h-8 w-8 p-0"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                          <span className="font-bold text-doce-red">
                            {formatPrice(subtotal)}
                          </span>
                        </div>
                      </div>
                    );
                  })}

                  <div className="border-t-2 border-doce-yellow pt-4 mt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xl font-bold text-doce-brown">Total:</span>
                      <span className="text-2xl font-bold text-doce-red">
                        {formatPrice(calculateTotal())}
                      </span>
                    </div>
                    <Button
                      onClick={handleCheckout}
                      className="w-full bg-doce-yellow hover:bg-doce-yellow/90 text-doce-brown font-bold py-6"
                    >
                      Finalizar Pedido
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* ETAPA 4: Informações do Cliente */}
            {step === 4 && (
              <div>
                <div className="flex items-center mb-4">
                  <Button
                    variant="ghost"
                    onClick={handleBack}
                    className="text-doce-brown"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Voltar
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-doce-brown font-semibold">
                      Nome Completo *
                    </Label>
                    <Input
                      id="name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Seu nome completo"
                      className="mt-1 bg-input-background"
                    />
                  </div>

                  <div>
                    <Label htmlFor="address" className="text-doce-brown font-semibold">
                      Endereço Completo *
                    </Label>
                    <Textarea
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Rua, número, complemento, bairro, cidade"
                      className="mt-1 min-h-[100px] bg-input-background"
                    />
                  </div>

                  <div>
                    <Label className="text-doce-brown font-semibold mb-3 block">
                      Forma de Pagamento *
                    </Label>
                    <RadioGroup value={payment} onValueChange={setPayment}>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 border-2 border-doce-yellow/20 rounded-lg p-3 hover:border-doce-yellow/50 transition-all">
                          <RadioGroupItem value="Pix" id="pix" />
                          <Label htmlFor="pix" className="flex-1 cursor-pointer text-doce-brown">
                            Pix
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 border-2 border-doce-yellow/20 rounded-lg p-3 hover:border-doce-yellow/50 transition-all">
                          <RadioGroupItem value="Dinheiro" id="dinheiro" />
                          <Label htmlFor="dinheiro" className="flex-1 cursor-pointer text-doce-brown">
                            Dinheiro
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 border-2 border-doce-yellow/20 rounded-lg p-3 hover:border-doce-yellow/50 transition-all">
                          <RadioGroupItem value="Débito/Crédito na Maquininha" id="cartao" />
                          <Label htmlFor="cartao" className="flex-1 cursor-pointer text-doce-brown">
                            Débito/Crédito na Maquininha
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="border-t-2 border-doce-yellow pt-4 mt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-bold text-doce-brown">Total do Pedido:</span>
                      <span className="text-2xl font-bold text-doce-red">
                        {formatPrice(calculateTotal())}
                      </span>
                    </div>
                    <Button
                      onClick={handleSendOrder}
                      className="w-full bg-doce-yellow hover:bg-doce-yellow/90 text-doce-brown font-bold py-6 text-lg"
                    >
                      ENVIAR PEDIDO
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickOrderModal;
