"use client";

import { useState } from "react";
import { ShoppingBag, Check } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import type { Product } from "@/lib/types";

interface AddToCartButtonProps {
  product: Product;
  quantity?: number;
  customization?: {
    name?: string;
    number?: string;
    colors?: string;
    text?: string;
  };
}

export function AddToCartButton({
  product,
  quantity = 1,
  customization,
}: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);
  const isOutOfStock = product.stock <= 0;
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    if (isOutOfStock) return;

    const finalPrice =
      product.promotionalPrice &&
      product.promotionalPrice > 0 &&
      product.promotionalPrice < product.price
        ? product.promotionalPrice
        : product.price;

    addItem(
      {
        productId: product.id,
        name: product.name,
        sku: product.sku,
        price: finalPrice,
        quantity,
        image: product.images[0] || "/logo-FORJA.png",
        customization,
      },
      product.stock
    );

    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <button
      type="button"
      onClick={handleAdd}
      disabled={isOutOfStock}
      className={
        "flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-6 py-4 text-base font-bold text-white shadow-soft transition disabled:cursor-not-allowed " +
        (added
          ? "bg-green-600 hover:bg-green-600"
          : isOutOfStock
          ? "bg-brand-neutral-300"
          : "bg-brand-pink-500 hover:bg-brand-pink-600")
      }
    >
      {added ? (
        <>
          <Check className="h-5 w-5" />
          ¡Agregado!
        </>
      ) : (
        <>
          <ShoppingBag className="h-5 w-5" />
          {isOutOfStock ? "Producto Agotado" : "Agregar al Carrito"}
        </>
      )}
    </button>
  );
}