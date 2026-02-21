"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Cart, CartItem, getCartFromStorage, saveCartToStorage } from '@/lib/cart';

interface CartContextType {
  cart: Cart;
  addItem: (item: CartItem) => void;
  removeItem: (index: number) => void;
  updateQuantity: (index: number, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>({ items: [], total: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCart(getCartFromStorage());
  }, []);

  const addItem = (item: CartItem) => {
    setCart(prev => {
      const newItems = [...(prev?.items ?? []), item];
      const newCart = {
        items: newItems,
        total: newItems.reduce((sum, i) => sum + (i?.price ?? 0) * (i?.quantity ?? 0), 0)
      };
      saveCartToStorage(newCart);
      return newCart;
    });
  };

  const removeItem = (index: number) => {
    setCart(prev => {
      const newItems = [...(prev?.items ?? [])];
      newItems.splice(index, 1);
      const newCart = {
        items: newItems,
        total: newItems.reduce((sum, i) => sum + (i?.price ?? 0) * (i?.quantity ?? 0), 0)
      };
      saveCartToStorage(newCart);
      return newCart;
    });
  };

  const updateQuantity = (index: number, quantity: number) => {
    if (quantity < 1) return;
    setCart(prev => {
      const newItems = [...(prev?.items ?? [])];
      if (newItems[index]) {
        newItems[index] = { ...newItems[index], quantity };
      }
      const newCart = {
        items: newItems,
        total: newItems.reduce((sum, i) => sum + (i?.price ?? 0) * (i?.quantity ?? 0), 0)
      };
      saveCartToStorage(newCart);
      return newCart;
    });
  };

  const clearCart = () => {
    const emptyCart = { items: [], total: 0 };
    setCart(emptyCart);
    saveCartToStorage(emptyCart);
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    return { 
      cart: { items: [], total: 0 }, 
      addItem: () => {}, 
      removeItem: () => {}, 
      updateQuantity: () => {}, 
      clearCart: () => {} 
    };
  }
  return context;
}
