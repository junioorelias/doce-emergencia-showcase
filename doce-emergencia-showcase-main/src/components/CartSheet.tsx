import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2 } from "lucide-react";

export interface CartItem {
  id: number;
  nome: string;
  precoString: string;
  unitPrice: number;
  quantity: number;
}

interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: CartItem[];
  onIncrease: (id: number) => void;
  onDecrease: (id: number) => void;
  onRemove: (id: number) => void;
  onCheckout: () => void;
}

const CartSheet = ({ open, onOpenChange, items, onIncrease, onDecrease, onRemove, onCheckout }: CartSheetProps) => {
  const subtotal = items.reduce((acc, it) => acc + it.unitPrice * it.quantity, 0);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[92vw] sm:w-[420px] p-0">
        <div className="p-6">
          <SheetHeader>
            <SheetTitle className="text-doce-brown">Seu carrinho</SheetTitle>
          </SheetHeader>
        </div>
        <Separator />
        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-3">
          {items.length === 0 && (
            <p className="text-sm text-doce-brown/70">Seu carrinho está vazio.</p>
          )}
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <div className="flex-1">
                <p className="text-sm font-semibold text-doce-brown">{item.nome}</p>
                <p className="text-xs text-doce-brown/70">{item.precoString}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="secondary" className="h-8 w-8 p-0" onClick={() => onDecrease(item.id)}>
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-6 text-center text-sm font-semibold text-doce-brown">{item.quantity}</span>
                <Button variant="secondary" className="h-8 w-8 p-0" onClick={() => onIncrease(item.id)}>
                  <Plus className="h-4 w-4" />
                </Button>
                <Button variant="ghost" className="h-8 w-8 p-0 text-destructive" onClick={() => onRemove(item.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        <Separator />
        <div className="p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-doce-brown/80">Subtotal</span>
            <span className="text-lg font-bold text-doce-brown">
              {subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          </div>
          <SheetFooter>
            <Button
              disabled={items.length === 0}
              onClick={onCheckout}
              className="w-full bg-doce-yellow text-doce-brown hover:bg-doce-yellow/90 font-bold"
            >
              Finalizar pedido
            </Button>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartSheet;
