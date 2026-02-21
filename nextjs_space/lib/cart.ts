export interface CartItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  uploadedPhotoUrl?: string;
  uploadedPhotoKey?: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

export function getCartFromStorage(): Cart {
  if (typeof window === 'undefined') {
    return { items: [], total: 0 };
  }
  
  try {
    const stored = localStorage.getItem('peoplesprints_cart');
    if (stored) {
      const cart = JSON.parse(stored);
      return cart ?? { items: [], total: 0 };
    }
  } catch (e) {
    console.error('Error reading cart:', e);
  }
  
  return { items: [], total: 0 };
}

export function saveCartToStorage(cart: Cart): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('peoplesprints_cart', JSON.stringify(cart));
  } catch (e) {
    console.error('Error saving cart:', e);
  }
}

export function addToCart(item: CartItem): Cart {
  const cart = getCartFromStorage();
  
  // For photo products, each upload is unique, so always add as new item
  cart.items.push(item);
  cart.total = cart.items.reduce((sum, i) => sum + (i?.price ?? 0) * (i?.quantity ?? 0), 0);
  
  saveCartToStorage(cart);
  return cart;
}

export function removeFromCart(index: number): Cart {
  const cart = getCartFromStorage();
  
  if (index >= 0 && index < (cart?.items?.length ?? 0)) {
    cart.items.splice(index, 1);
    cart.total = cart.items.reduce((sum, i) => sum + (i?.price ?? 0) * (i?.quantity ?? 0), 0);
    saveCartToStorage(cart);
  }
  
  return cart;
}

export function clearCart(): void {
  saveCartToStorage({ items: [], total: 0 });
}

export function updateQuantity(index: number, quantity: number): Cart {
  const cart = getCartFromStorage();
  
  if (index >= 0 && index < (cart?.items?.length ?? 0) && quantity > 0) {
    cart.items[index].quantity = quantity;
    cart.total = cart.items.reduce((sum, i) => sum + (i?.price ?? 0) * (i?.quantity ?? 0), 0);
    saveCartToStorage(cart);
  }
  
  return cart;
}
