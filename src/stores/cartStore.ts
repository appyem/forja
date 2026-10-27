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
            // ✅ Si maxStock es 0, es bajo pedido, permitimos agregar. Si no, validamos.
            if (maxStock > 0 && newQuantity > maxStock) {
              alert(`Solo hay ${maxStock} unidades disponibles en inventario inmediato.`);
              return state;
            }
            
            return {
              items: state.items.map((i) =>
                i.productId === item.productId ? { ...i, quantity: newQuantity } : i
              ),
            };
          }

          // ✅ Misma lógica para el primer agregado
          if (maxStock > 0 && item.quantity > maxStock) {
            alert(`Solo hay ${maxStock} unidades disponibles en inventario inmediato.`);
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
        // ✅ Validación respetando el stock 0 como bajo pedido
        if (maxStock > 0 && quantity > maxStock) {
          alert(`Solo hay ${maxStock} unidades disponibles en inventario inmediato.`);
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
      name: "FORJA-cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);