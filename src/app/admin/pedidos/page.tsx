"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Package, Eye } from "lucide-react";
import { getAllOrdersForAdmin } from "@/services/admin/orders";
import { formatCOP } from "@/lib/utils/format";
import type { Order } from "@/lib/types";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadOrders = async () => {
      try {
        const data = await getAllOrdersForAdmin();
        if (isMounted) {
          setOrders(data);
        }
      } catch (error: unknown) {
        console.error("[admin/pedidos] Error al cargar pedidos:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadOrders();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-brand-pink-500" />
          <p className="text-sm text-brand-neutral-500">Cargando pedidos...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brand-purple-900">Pedidos</h1>
        <p className="mt-1 text-sm text-brand-neutral-500">
          {orders.length} {orders.length === 1 ? "pedido registrado" : "pedidos registrados"}
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-brand-neutral-300 bg-white py-16 text-center">
          <Package className="mb-3 h-12 w-12 text-brand-neutral-300" />
          <p className="text-lg font-semibold text-brand-purple-900">No hay pedidos aún</p>
          <p className="mt-1 text-sm text-brand-neutral-500">
            Los pedidos aparecerán aquí cuando los clientes realicen compras.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-brand-neutral-200 bg-white shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-brand-neutral-200 bg-brand-neutral-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-brand-neutral-500">
                    ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-brand-neutral-500">
                    Cliente
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-brand-neutral-500">
                    Total
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-brand-neutral-500">
                    Estado
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-brand-neutral-500">
                    Fecha
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-brand-neutral-500">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-neutral-200">
                {orders.map((order) => (
                  <tr key={order.id} className="transition hover:bg-brand-neutral-50">
                    <td className="px-4 py-3 text-sm font-mono text-brand-neutral-600">
                      {order.id.slice(0, 8)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <p className="font-semibold text-brand-purple-900">
                        {order.shippingAddress.fullName}
                      </p>
                      <p className="text-xs text-brand-neutral-500">{order.shippingAddress.phone}</p>
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-brand-purple-900">
                      {formatCOP(order.total)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className="inline-flex items-center rounded-full bg-brand-pink-100 px-2 py-0.5 text-xs font-semibold text-brand-pink-700">
                        {order.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-brand-neutral-600">
                      {new Date(order.createdAt).toLocaleDateString("es-CO")}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end">
                        <Link
                          href={`/admin/pedidos/${order.id}`}
                          className="inline-flex items-center gap-1 rounded-lg border border-brand-neutral-200 px-3 py-1.5 text-xs font-semibold text-brand-purple-900 transition hover:bg-brand-neutral-100"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          Ver
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}