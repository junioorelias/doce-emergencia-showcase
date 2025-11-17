export interface CartItem {
  id: number;
  nome: string;
  preco: string;
  quantidade: number;
}

export const parsePrice = (priceStr: string): number => {
  return parseFloat(priceStr.replace('R$', '').replace(',', '.'));
};

export const formatPrice = (price: number): string => {
  return `R$ ${price.toFixed(2).replace('.', ',')}`;
};

export const formatWhatsAppMessage = (
  items: CartItem[],
  customerName: string,
  address: string,
  payment: string
): string => {
  let message = '✨🍫 *Novo Pedido Doce Emergência!* 🍫✨\n\n';
  message += '📦 *Itens:*\n';
  
  items.forEach((item) => {
    const total = parsePrice(item.preco) * item.quantidade;
    message += `${item.quantidade}x ${item.nome} — ${formatPrice(total)}\n`;
  });
  
  const total = items.reduce((sum, item) => {
    return sum + (parsePrice(item.preco) * item.quantidade);
  }, 0);
  
  message += `\n💰 *Total:* ${formatPrice(total)}\n\n`;
  message += `👤 *Cliente:* ${customerName}\n`;
  message += `📍 *Endereço:* ${address}\n`;
  message += `💳 *Forma de Pagamento:* ${payment}`;
  
  return message;
};

export const generateWhatsAppUrl = (message: string): string => {
  const phone = '5511976824710';
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
};
