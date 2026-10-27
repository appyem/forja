"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  MessageCircle,
  Save,
  CheckCircle2,
  Clock,
  XCircle,
  User,
  Mail,
  Phone,
  Package,
  Hash,
  FileText,
} from "lucide-react";
import {
  getQuoteById,
  updateQuoteStatus,
  type Quote,
  type QuoteStatus,
} from "@/services/admin/quotes";

const statusOptions: { value: QuoteStatus; label: string; color: string; icon: typeof Clock }[] = [
  { value: "pending", label: "Pendiente", color: "bg-yellow-100 text-yellow-700 border-yellow-300", icon: Clock },
  { value: "contacted", label: "Contactada", color: "bg-blue-100 text-blue-700 border-blue-300", icon: CheckCircle2 },
  { value: "closed", label: "Cerrada", color: "bg-brand-neutral-200 text-brand-neutral-600 border-brand-neutral-300", icon: XCircle },
];

const productLabels: Record<string, string> = {
  balones: "Balones",
  pesas: "Pesas y Mancuernas",
  uniformes: "Uniformes",
  accesorios: "Accesorios",
  otros: "Otros",
};

export default function QuoteDetailPage() {
  const router = useRouter();
  const params = useParams();
  const quoteId = params.id as string;

  const [quote, setQuote] = useState<Quote | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newStatus, setNewStatus] = useState<QuoteStatus>("pending");
  const [adminNotes, setAdminNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const data = await getQuoteById(quoteId);
        if (isMounted) {
          if (data) {
            setQuote(data);
            setNewStatus(data.status);
            setAdminNotes(data.adminNotes ?? "");
          } else {
            router.push("/admin/cotizaciones");
          }
        }
      } catch {
        if (isMounted) router.push("/admin/cotizaciones");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    load();
    return () => { isMounted = false; };
  }, [quoteId, router]);

  const handleSave = async () => {
    if (!quote) return;
    setIsSaving(true);
    setSaveMessage(null);
    try {
      await updateQuoteStatus(quote.id, newStatus, adminNotes);
      setQuote({ ...quote, status: newStatus, adminNotes });
      setSaveMessage("Cambios guardados correctamente");
      setTimeout(() => setSaveMessage(null), 3000);
    } catch {
      setSaveMessage("Error al guardar los cambios");
    } finally {
      setIsSaving(false);
    }
  };

  const whatsappMessage = quote
    ? `Hola ${quote.fullName}, soy de FORJA. Respecto a tu cotización de ${quote.quantity} ${productLabels[quote.productType] ?? quote.productType}, queríamos comentarte lo siguiente:\n\n${adminNotes || "[Tu respuesta aquí]"}`
    : "";

  const whatsappUrl = quote
    ? `https://wa.me/${quote.phone.replace(/\D/g, "")}?text=${encodeURIComponent(whatsappMessage)}`
    : "";

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-pink-500" />
      </div>
    );
  }

  if (!quote) return null;

  const currentStatus = statusOptions.find((s) => s.value === quote.status) ?? statusOptions[0];
  const StatusIcon = currentStatus.icon;

  return (
    <div>
      <Link
        href="/admin/cotizaciones"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-brand-neutral-500 transition hover:text-brand-pink-500"
      >
        <ArrowLeft className="h-4 w-4" /> Volver a cotizaciones
      </Link>

      {saveMessage && (
        <div className="mb-6 flex items-center gap-2 rounded-lg bg-green-50 p-4 text-sm text-green-700">
          <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
          <span>{saveMessage}</span>
        </div>
      )}

      {/* TICKET */}
      <div className="mx-auto max-w-3xl">
        <div className="relative overflow-hidden rounded-2xl border border-brand-neutral-200 bg-gradient-to-br from-amber-50 via-white to-brand-pink-50 shadow-xl">
          {/* Encabezado del ticket */}
          <div className="border-b-2 border-dashed border-brand-neutral-300 bg-brand-purple-950 px-6 py-5 text-white sm:px-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-brand-pink-400">
                  FORJA · Cotización
                </p>
                <h1 className="mt-1 text-xl font-bold sm:text-2xl">
                  Ticket #{quote.id.slice(-6).toUpperCase()}
                </h1>
              </div>
              <div className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${currentStatus.color}`}>
                <StatusIcon className="h-3.5 w-3.5" />
                {currentStatus.label}
              </div>
            </div>
            <p className="mt-2 text-xs text-brand-neutral-300">
              Recibido el {quote.createdAt.toLocaleDateString("es-CO", {
                day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
              })}
            </p>
          </div>

          {/* Cuerpo del ticket */}
          <div className="space-y-6 px-6 py-6 sm:px-8">
            {/* Datos del cliente */}
            <section>
              <h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-brand-purple-900">
                <User className="h-4 w-4 text-brand-pink-500" />
                Datos del cliente
              </h2>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl bg-white p-3 shadow-sm ring-1 ring-brand-neutral-200">
                  <p className="text-xs text-brand-neutral-500">Nombre</p>
                  <p className="mt-0.5 text-sm font-semibold text-brand-purple-900">{quote.fullName}</p>
                </div>
                <div className="rounded-xl bg-white p-3 shadow-sm ring-1 ring-brand-neutral-200">
                  <p className="flex items-center gap-1 text-xs text-brand-neutral-500">
                    <Mail className="h-3 w-3" /> Email
                  </p>
                  <p className="mt-0.5 truncate text-sm font-semibold text-brand-purple-900">{quote.email}</p>
                </div>
                <div className="rounded-xl bg-white p-3 shadow-sm ring-1 ring-brand-neutral-200">
                  <p className="flex items-center gap-1 text-xs text-brand-neutral-500">
                    <Phone className="h-3 w-3" /> Teléfono
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-brand-purple-900">{quote.phone}</p>
                </div>
              </div>
            </section>

            {/* Solicitud */}
            <section>
              <h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-brand-purple-900">
                <Package className="h-4 w-4 text-brand-pink-500" />
                Solicitud
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-white p-3 shadow-sm ring-1 ring-brand-neutral-200">
                  <p className="flex items-center gap-1 text-xs text-brand-neutral-500">
                    <Package className="h-3 w-3" /> Tipo de producto
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-brand-purple-900">
                    {productLabels[quote.productType] ?? quote.productType}
                  </p>
                </div>
                <div className="rounded-xl bg-white p-3 shadow-sm ring-1 ring-brand-neutral-200">
                  <p className="flex items-center gap-1 text-xs text-brand-neutral-500">
                    <Hash className="h-3 w-3" /> Cantidad
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-brand-purple-900">{quote.quantity} unidades</p>
                </div>
              </div>
              <div className="mt-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-brand-neutral-200">
                <p className="flex items-center gap-1 text-xs text-brand-neutral-500">
                  <FileText className="h-3 w-3" /> Detalles de personalización
                </p>
                <p className="mt-1 whitespace-pre-wrap text-sm text-brand-purple-900">{quote.details}</p>
              </div>
            </section>

            {/* Nota del admin */}
            <section>
              <h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-brand-purple-900">
                <MessageCircle className="h-4 w-4 text-brand-pink-500" />
                Tu respuesta al cliente
              </h2>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={5}
                placeholder="Escribe aquí la respuesta que le darás al cliente. Este texto también se enviará por WhatsApp."
                className="w-full rounded-xl border border-brand-neutral-200 bg-white px-4 py-3 text-sm text-brand-purple-900 shadow-sm focus:border-brand-pink-500 focus:outline-none focus:ring-2 focus:ring-brand-pink-400/30"
              />
            </section>

            {/* Acciones */}
            <section className="rounded-xl border border-brand-neutral-200 bg-white p-4 shadow-sm">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-brand-neutral-500">
                Cambiar estado
              </label>
              <div className="flex flex-wrap gap-2">
                {statusOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isActive = newStatus === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setNewStatus(opt.value)}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                        isActive
                          ? `${opt.color} ring-2 ring-offset-1 ring-brand-pink-400`
                          : "border-brand-neutral-200 bg-white text-brand-neutral-500 hover:bg-brand-neutral-50"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </section>
          </div>

          {/* Pie del ticket (acciones) */}
          <div className="border-t-2 border-dashed border-brand-neutral-300 bg-brand-neutral-50 px-6 py-4 sm:px-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="inline-flex items-center gap-2 rounded-xl bg-brand-pink-500 px-5 py-2.5 text-sm font-bold text-white shadow-soft transition hover:bg-brand-pink-600 disabled:cursor-not-allowed disabled:bg-brand-neutral-300"
              >
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Guardar cambios
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-5 py-2.5 text-sm font-bold text-white shadow-soft transition hover:bg-green-600"
              >
                <MessageCircle className="h-4 w-4" />
                Responder por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}