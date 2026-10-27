"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, FileText, Clock, CheckCircle2, XCircle, Eye } from "lucide-react";
import { getAllQuotes, type Quote, type QuoteStatus } from "@/services/admin/quotes";

const statusConfig: Record<QuoteStatus, { label: string; color: string; icon: typeof Clock }> = {
  pending: { label: "Pendiente", color: "bg-yellow-100 text-yellow-700", icon: Clock },
  contacted: { label: "Contactada", color: "bg-blue-100 text-blue-700", icon: CheckCircle2 },
  closed: { label: "Cerrada", color: "bg-brand-neutral-200 text-brand-neutral-600", icon: XCircle },
};

const productLabels: Record<string, string> = {
  balones: "Balones",
  pesas: "Pesas y Mancuernas",
  uniformes: "Uniformes",
  accesorios: "Accesorios",
  otros: "Otros",
};

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const data = await getAllQuotes();
        if (isMounted) setQuotes(data);
      } catch (error: unknown) {
        console.error("[admin/cotizaciones] Error:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    load();
    return () => { isMounted = false; };
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-brand-pink-500" />
          <p className="text-sm text-brand-neutral-500">Cargando cotizaciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brand-purple-900">Cotizaciones</h1>
        <p className="mt-1 text-sm text-brand-neutral-500">
          {quotes.length} {quotes.length === 1 ? "solicitud recibida" : "solicitudes recibidas"}
        </p>
      </div>

      {quotes.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-brand-neutral-300 bg-white py-16 text-center">
          <FileText className="mb-3 h-12 w-12 text-brand-neutral-300" />
          <p className="text-lg font-semibold text-brand-purple-900">No hay cotizaciones aún</p>
          <p className="mt-1 text-sm text-brand-neutral-500">
            Las solicitudes de la página de personalización aparecerán aquí.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-brand-neutral-200 bg-white shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-brand-neutral-200 bg-brand-neutral-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-brand-neutral-500">Cliente</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-brand-neutral-500">Producto</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-brand-neutral-500">Cantidad</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-brand-neutral-500">Fecha</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-brand-neutral-500">Estado</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-brand-neutral-500">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-neutral-200">
                {quotes.map((q) => {
                  const status = statusConfig[q.status];
                  const StatusIcon = status.icon;
                  return (
                    <tr key={q.id} className="transition hover:bg-brand-neutral-50">
                      <td className="px-4 py-3">
                        <p className="truncate text-sm font-semibold text-brand-purple-900">{q.fullName}</p>
                        <p className="truncate text-xs text-brand-neutral-500">{q.email}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-brand-neutral-600">
                        {productLabels[q.productType] ?? q.productType}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-brand-purple-900">
                        {q.quantity} uds.
                      </td>
                      <td className="px-4 py-3 text-sm text-brand-neutral-600">
                        {q.createdAt.toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" })}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${status.color}`}>
                          <StatusIcon className="h-3 w-3" />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end">
                          <Link
                            href={`/admin/cotizaciones/${q.id}`}
                            className="inline-flex items-center gap-1 rounded-lg border border-brand-neutral-200 px-3 py-1.5 text-xs font-semibold text-brand-purple-900 transition hover:bg-brand-neutral-100"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            Ver ticket
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}