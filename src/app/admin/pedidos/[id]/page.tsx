"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Loader2 } from "lucide-react";
import { getOrderById, updateOrderStatus } from "@/services/admin/orders";
import { formatCOP } from "@/lib/utils/format";
import type { Order, OrderStatus } from "@/lib/types";

const ORDER_STATUSES: OrderStatus[] = [
  "pending_payment",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export default function AdminOrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadOrder = async () => {
      try {
        const data = await getOrderById(orderId);
        if (isMounted) {
          if (data) {
            setOrder(data);
          } else {
            router.push("/admin/pedidos");
          }
        }
      } catch {
        if (isMounted) {
          router.push("/admin/pedidos");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadOrder();

    return () => {
      isMounted = false;
    };
  }, [orderId, router]);

  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (!order) return;

    setIsUpdating(true);
    try {
      await updateOrderStatus(order.id, newStatus);
      setOrder({ ...order, status: newStatus });
    } catch (error: unknown) {
      console.error("[admin/pedidos] Error al actualizar estado:", error);
      alert("No se pudo actualizar el estado del pedido");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-brand-pink-500" />
          <p className="text-sm text-brand-neutral-500">Cargando pedido...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div>
      <Link
        href="/admin/pedidos"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-brand-neutral-500 transition hover:text-brand-pink-500"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a pedidos
      </Link>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-purple-900">Pedido #{order.id.slice(0, 8)}</h1>
          <p className="mt-1 text-sm text-brand-neutral-500">
            Realizado el {new Date(order.createdAt).toLocaleDateString("es-CO")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-brand-purple-900">Estado:</label>
          <select
            value={order.status}
            onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
            disabled={isUpdating}
            className="rounded-lg border border-brand-neutral-200 bg-white px-3 py-1.5 text-sm font-semibold focus:border-brand-pink-500 focus:outline-none focus:ring-2 focus:ring-brand-pink-400/30 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {ORDER_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-brand-neutral-200 bg-white p-6 shadow-soft">
            <h2 className="mb-4 text-lg font-bold text-brand-purple-900">Productos</h2>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex gap-4 border-b border-brand-neutral-200 pb-4 last:border-0 last:pb-0">
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-brand-neutral-100">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-brand-purple-900">{item.name}</p>
                    <p className="text-sm text-brand-neutral-500">SKU: {item.sku}</p>
                    <div className="mt-1 flex items-center gap-4 text-sm">
                      <span className="text-brand-neutral-600">Cantidad: {item.quantity}</span>
                      <span className="font-semibold text-brand-purple-900">{formatCOP(item.price)} c/u</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-brand-neutral-200 bg-white p-6 shadow-soft">
            <h2 className="mb-4 text-lg font-bold text-brand-purple-900">Dirección de Envío</h2>
            <div className="space-y-2 text-sm">
              <p className="font-semibold text-brand-purple-900">{order.shippingAddress.fullName}</p>
              <p className="text-brand-neutral-600">{order.shippingAddress.phone}</p>
              <p className="text-brand-neutral-600">{order.shippingAddress.address}</p>
              {order.shippingAddress.addressDetail && (
                <p className="text-brand-neutral-500">{order.shippingAddress.addressDetail}</p>
              )}
              <p className="text-brand-neutral-600">
                {order.shippingAddress.city}, {order.shippingAddress.department}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-brand-neutral-200 bg-white p-6 shadow-soft">
            <h2 className="mb-4 text-lg font-bold text-brand-purple-900">Resumen</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-brand-neutral-600">
                <span>Subtotal</span>
                <span>{formatCOP(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-brand-neutral-600">
                <span>Envío</span>
                <span>{formatCOP(order.shippingCost)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Descuento</span>
                  <span>-{formatCOP(order.discount)}</span>
                </div>
              )}
              <div className="border-t border-brand-neutral-200 pt-3">
                <div className="flex justify-between text-lg font-bold text-brand-purple-900">
                  <span>Total</span>
                  <span>{formatCOP(order.total)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-brand-neutral-200 bg-white p-6 shadow-soft">
            <h2 className="mb-4 text-lg font-bold text-brand-purple-900">Información de Pago</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-brand-neutral-600">Método:</span>
                <span className="font-semibold text-brand-purple-900">{order.paymentMethod || "No especificado"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-neutral-600">Estado:</span>
                <span className="inline-flex items-center rounded-full bg-brand-pink-100 px-2 py-0.5 text-xs font-semibold text-brand-pink-700">
                  {order.paymentStatus}
                </span>
              </div>
              {order.paymentReference && (
                <div className="flex justify-between">
                  <span className="text-brand-neutral-600">Referencia:</span>
                  <span className="font-mono text-xs text-brand-neutral-600">{order.paymentReference}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}