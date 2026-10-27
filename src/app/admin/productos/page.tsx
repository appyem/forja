"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Edit2, Trash2, Loader2, Package, AlertTriangle, Tag } from "lucide-react";
import { getAllProductsForAdmin, deleteProduct } from "@/services/admin/products";
import { formatCOP } from "@/lib/utils/format";
import type { Product } from "@/lib/types";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      try {
        const data = await getAllProductsForAdmin();
        if (isMounted) {
          setProducts(data);
        }
      } catch (error: unknown) {
        console.error("[admin/productos] Error al cargar productos:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleDelete = async (productId: string, productName: string) => {
    const confirmed = window.confirm(
      `¿Estás seguro de eliminar "${productName}"? Esta acción no se puede deshacer.`
    );
    if (!confirmed) return;

    setDeletingId(productId);
    try {
      await deleteProduct(productId);
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    } catch (error: unknown) {
      console.error("[admin/productos] Error al eliminar:", error);
      alert("No se pudo eliminar el producto. Intenta de nuevo.");
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-brand-pink-500" />
          <p className="text-sm text-brand-neutral-500">Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-purple-900">Productos</h1>
          <p className="mt-1 text-sm text-brand-neutral-500">
            {products.length} {products.length === 1 ? "producto registrado" : "productos registrados"}
          </p>
        </div>
        <Link
          href="/admin/productos/nuevo"
          className="inline-flex items-center gap-2 rounded-xl bg-brand-pink-500 px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-pink-600"
        >
          <Plus className="h-4 w-4" />
          Nuevo producto
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-brand-neutral-300 bg-white py-16 text-center">
          <Package className="mb-3 h-12 w-12 text-brand-neutral-300" />
          <p className="text-lg font-semibold text-brand-purple-900">No hay productos aún</p>
          <p className="mt-1 text-sm text-brand-neutral-500">
            Crea tu primer producto para empezar a vender.
          </p>
          <Link
            href="/admin/productos/nuevo"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brand-pink-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-pink-600"
          >
            <Plus className="h-4 w-4" />
            Crear producto
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-brand-neutral-200 bg-white shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-brand-neutral-200 bg-brand-neutral-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-brand-neutral-500">
                    Producto
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-brand-neutral-500">
                    SKU
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-brand-neutral-500">
                    Precio
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-brand-neutral-500">
                    Stock
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-brand-neutral-500">
                    Estado
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-brand-neutral-500">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-neutral-200">
                {products.map((product) => (
                  <tr key={product.id} className="transition hover:bg-brand-neutral-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-brand-neutral-100">
                          <Image
                            src={product.images[0] || "/logo-FORJA.png"}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-brand-purple-900">
                            {product.name}
                          </p>
                          <p className="truncate text-xs text-brand-neutral-500">
                            {product.categoryId === "balones" ? "Balones" : "Pesas"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-brand-neutral-600">
                      {product.sku}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <p className="font-semibold text-brand-purple-900">
                        {formatCOP(product.promotionalPrice ?? product.price)}
                      </p>
                      {product.promotionalPrice && product.promotionalPrice < product.price && (
                        <p className="text-xs text-brand-neutral-400 line-through">
                          {formatCOP(product.price)}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {product.stock <= 0 ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
                          <AlertTriangle className="h-3 w-3" />
                          Agotado
                        </span>
                      ) : product.stock <= 5 ? (
                        <span className="inline-flex items-center rounded-full bg-brand-pink-100 px-2 py-0.5 text-xs font-semibold text-brand-pink-700">
                          {product.stock} uds.
                        </span>
                      ) : (
                        <span className="text-brand-neutral-600">{product.stock} uds.</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex flex-col gap-1.5">
                        {product.isActive ? (
                          <span className="inline-flex w-fit items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                            Activo
                          </span>
                        ) : (
                          <span className="inline-flex w-fit items-center rounded-full bg-brand-neutral-200 px-2 py-0.5 text-xs font-semibold text-brand-neutral-600">
                            Inactivo
                          </span>
                        )}
                        
                        {/* ✅ NUEVO: Badge de Promoción */}
                        {product.promotionalPrice && product.promotionalPrice > 0 && product.promotionalPrice < product.price && (
                          <span className="inline-flex w-fit items-center gap-1 rounded-full bg-brand-pink-100 px-2 py-0.5 text-xs font-semibold text-brand-pink-700">
                            <Tag className="h-3 w-3" />
                            Promoción
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/productos/${product.id}`}
                          className="inline-flex items-center gap-1 rounded-lg border border-brand-neutral-200 px-3 py-1.5 text-xs font-semibold text-brand-purple-900 transition hover:bg-brand-neutral-100"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                          Editar
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id, product.name)}
                          disabled={deletingId === product.id}
                          className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {deletingId === product.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="h-3.5 w-3.5" />
                          )}
                          Eliminar
                        </button>
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
