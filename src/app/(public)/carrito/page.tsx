"use client";

import Link from "next/link";
import Image from "next/image";
import { Trash2, Minus, Plus, ArrowLeft, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { formatCOP } from "@/lib/utils/format";

const SHIPPING_COST = 15000; // Costo de envío fijo de ejemplo

export default function CartPage() {
  const { items, updateQuantity, removeItem, getSubtotal, getItemCount, clearCart } = useCartStore();

  const subtotal = getSubtotal();
  const total = subtotal > 0 ? subtotal + SHIPPING_COST : 0;
  const itemCount = getItemCount();

  // Estado vacío (también se muestra mientras Zustand se hidrata desde localStorage)
  if (itemCount === 0) {
    return (
      <section className="mx-auto w-full max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-brand-neutral-100">
          <ShoppingBag className="h-12 w-12 text-brand-neutral-400" />
        </div>
        <h1 className="mt-6 text-2xl font-bold text-brand-purple-900">Tu carrito está vacío</h1>
        <p className="mt-2 text-brand-neutral-500">
          Parece que aún no has agregado productos. ¡Explora nuestro catálogo!
        </p>
        <Link
          href="/catalogo"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-brand-pink-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-pink-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Ir al catálogo
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-extrabold tracking-tight text-brand-purple-900">
        Tu Carrito <span className="text-brand-neutral-400">({itemCount} {itemCount === 1 ? "producto" : "productos"})</span>
      </h1>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Lista de Productos */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.productId}
                className="flex flex-col gap-4 rounded-2xl border border-brand-neutral-200 bg-white p-4 sm:flex-row sm:items-center"
              >
                {/* Imagen */}
                <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-brand-neutral-100">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Info y Controles */}
                <div className="flex flex-1 flex-col justify-between sm:flex-row sm:items-center">
                  <div className="flex-1">
                    <h3 className="font-semibold text-brand-purple-900">{item.name}</h3>
                    <p className="text-sm text-brand-neutral-500">SKU: {item.sku}</p>
                    {item.customization && (
                      <p className="mt-1 text-xs text-brand-pink-600">
                        Personalizado: {item.customization.name && `Nombre: ${item.customization.name}`}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-between sm:mt-0 sm:flex-col sm:items-end sm:gap-2">
                    <p className="font-bold text-brand-purple-900">{formatCOP(item.price)}</p>
                    
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1, 999)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-brand-neutral-200 text-brand-purple-900 transition hover:bg-brand-neutral-100"
                        aria-label="Disminuir cantidad"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center font-semibold text-brand-purple-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1, 999)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-brand-neutral-200 text-brand-purple-900 transition hover:bg-brand-neutral-100"
                        aria-label="Aumentar cantidad"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => removeItem(item.productId)}
                    className="mt-4 sm:mt-0 sm:ml-4"
                    aria-label="Eliminar producto"
                  >
                    <Trash2 className="h-5 w-5 text-brand-neutral-400 transition hover:text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={clearCart}
            className="mt-6 text-sm font-medium text-brand-neutral-500 underline transition hover:text-red-600"
          >
            Vaciar carrito completo
          </button>
        </div>

        {/* Resumen del Pedido */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-brand-neutral-200 bg-white p-6 shadow-soft">
            <h2 className="text-lg font-bold text-brand-purple-900">Resumen del pedido</h2>
            
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between text-brand-neutral-600">
                <span>Subtotal</span>
                <span>{formatCOP(subtotal)}</span>
              </div>
              <div className="flex justify-between text-brand-neutral-600">
                <span>Envío estimado</span>
                <span>{formatCOP(SHIPPING_COST)}</span>
              </div>
              <div className="border-t border-brand-neutral-200 pt-3">
                <div className="flex justify-between text-base font-bold text-brand-purple-900">
                  <span>Total</span>
                  <span>{formatCOP(total)}</span>
                </div>
                <p className="mt-1 text-xs text-brand-neutral-500">Impuestos incluidos</p>
              </div>
            </div>

            <Link
              href="/checkout"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-pink-500 px-6 py-3.5 text-sm font-bold text-white shadow-soft transition hover:bg-brand-pink-600"
            >
              Proceder al pago
            </Link>

            <Link
              href="/catalogo"
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-brand-neutral-200 px-6 py-3.5 text-sm font-semibold text-brand-purple-900 transition hover:bg-brand-neutral-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Seguir comprando
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}