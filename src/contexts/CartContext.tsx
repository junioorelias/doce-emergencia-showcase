import { createContext, useContext, useState, ReactNode } from "react";
import { parsePrice, formatPrice } from "@/lib/orderUtils";

export interface CartItem {
  id: number;
  nome: string;
  preco: string;
  quantidade: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  increaseQuantity: (id: number) => void;
  decreaseQuantity: (id: number) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
  calculateTotal: () => number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(i => i.id === item.id);
      if (existingIndex >= 0) {
        // Item exists - sum quantities
        const newCart = [...prevCart];
        newCart[existingIndex] = {
          ...newCart[existingIndex],
          quantidade: newCart[existingIndex].quantidade + item.quantidade
        };
        return newCart;
      } else {
        // New item
        return [...prevCart, item];
      }
    });
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

  const clearCart = () => {
    setCart([]);
  };

  const calculateTotal = (): number => {
    return cart.reduce((sum, item) => {
      return sum + (parsePrice(item.preco) * item.quantidade);
    }, 0);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantidade, 0);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      increaseQuantity,
      decreaseQuantity,
      removeItem,
      clearCart,
      calculateTotal,
      cartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
