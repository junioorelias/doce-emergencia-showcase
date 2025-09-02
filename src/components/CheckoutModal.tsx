import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export type PaymentMethod = "Pix" | "Dinheiro" | "Cartão";

interface CheckoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (data: { name: string; address: string; payment: PaymentMethod }) => void;
}

const CheckoutModal = ({ open, onOpenChange, onConfirm }: CheckoutModalProps) => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState<PaymentMethod>("Pix");

  const canConfirm = name.trim().length > 2 && address.trim().length > 8;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle className="text-doce-brown">Finalizar pedido</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-doce-brown">Seu nome</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Ana Silva" />
          </div>
          <div>
            <Label htmlFor="address" className="text-doce-brown">Endereço de entrega</Label>
            <Textarea id="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Rua, número, complemento, bairro, cidade" />
          </div>
          <div>
            <Label className="text-doce-brown mb-2 block">Forma de pagamento</Label>
            <RadioGroup value={payment} onValueChange={(v) => setPayment(v as PaymentMethod)} className="grid grid-cols-3 gap-2">
              {(["Pix", "Dinheiro", "Cartão"] as PaymentMethod[]).map((opt) => (
                <div key={opt} className="flex items-center space-x-2 border rounded-md p-2">
                  <RadioGroupItem id={`pm-${opt}`} value={opt} />
                  <Label htmlFor={`pm-${opt}`} className="text-doce-brown text-sm">{opt}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>

        <DialogFooter>
          <Button
            disabled={!canConfirm}
            onClick={() => onConfirm({ name, address, payment })}
            className="bg-doce-yellow text-doce-brown hover:bg-doce-yellow/90 font-bold"
          >
            Enviar pedido no WhatsApp
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutModal;
