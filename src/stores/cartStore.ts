import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartItem } from "@/lib/types";

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem, maxStock: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number, maxStock: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item, maxStock) => {
        set((state) => {
          const existingItem = state.items.find((i) => i.productId === item.productId);
          
          if (existingItem) {
            const newQuantity = existingItem.quantity + item.quantity;
            // Validar contra el inventario máximo
            if (newQuantity > maxStock) {
              alert(`Solo hay ${maxStock} unidades disponibles de este producto.`);
              return state; // No hacer cambios si excede el stock
            }
            
            return {
              items: state.items.map((i) =>
                i.productId === item.productId ? { ...i, quantity: newQuantity } : i
              ),
            };
          }

          // Validar al agregar un item nuevo
          if (item.quantity > maxStock) {
            alert(`Solo hay ${maxStock} unidades disponibles de este producto.`);
            return state;
          }

          return { items: [...state.items, item] };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        }));
      },

      updateQuantity: (productId, quantity, maxStock) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        if (quantity > maxStock) {
          alert(`Solo hay ${maxStock} unidades disponibles.`);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      getSubtotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: "FORJA-cart-storage", // Nombre de la clave en localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);