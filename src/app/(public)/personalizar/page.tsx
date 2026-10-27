"use client";

import { useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, CheckCircle2, Loader2, MessageCircle, AlertCircle } from "lucide-react";
import { createQuote } from "@/services/quotes";

const quoteSchema = z.object({
  fullName: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  email: z.string().email("Ingresa un correo electrónico válido"),
  phone: z.string().min(7, "El teléfono debe tener al menos 7 dígitos"),
  productType: z.enum(["balones", "pesas", "uniformes", "accesorios", "otros"], {
    message: "Selecciona un tipo de producto",
  }),
  quantity: z.coerce.number().min(1, "La cantidad mínima es 1"),
  details: z.string().min(10, "Cuéntanos más detalles (mínimo 10 caracteres)"),
});

type QuoteFormData = z.infer<typeof quoteSchema>;

export default function PersonalizarPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<QuoteFormData>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      productType: "balones",
      quantity: 10,
    },
  });

  const onSubmit = async (data: QuoteFormData) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await createQuote(data);
      setIsSuccess(true);
      reset();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Error desconocido";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 py-16 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-brand-purple-900">¡Solicitud enviada!</h1>
        <p className="mt-4 text-lg text-brand-neutral-600">
          Hemos recibido tu solicitud de cotización. Un asesor de FORJA se pondrá en contacto contigo en menos de 24 horas hábiles.
        </p>
        <button
          onClick={() => setIsSuccess(false)}
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-brand-pink-500 px-6 py-3 text-sm font-bold text-white shadow-soft transition hover:bg-brand-pink-600"
        >
          Enviar otra solicitud
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-brand-purple-900 sm:text-5xl">
          Personaliza tu equipamiento
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-brand-neutral-600">
          ¿Eres academia, club o entrenadora? Cuéntanos qué necesitas y te enviaremos una cotización personalizada con los mejores precios por volumen.
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-3">
        {/* Formulario */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-brand-neutral-200 bg-white p-6 shadow-soft sm:p-8">
            <h2 className="mb-6 text-xl font-bold text-brand-purple-900">Solicitar cotización</h2>

            {errorMessage && (
              <div className="mb-6 flex items-center gap-2 rounded-lg bg-red-50 p-4 text-sm text-red-700">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-brand-purple-900">Nombre completo *</label>
                  <input
                    {...register("fullName")}
                    className="w-full rounded-xl border border-brand-neutral-200 px-4 py-2.5 text-sm focus:border-brand-pink-500 focus:outline-none focus:ring-2 focus:ring-brand-pink-400/30"
                    placeholder="Tu nombre o el de la academia"
                  />
                  {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName.message}</p>}
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-brand-purple-900">Correo electrónico *</label>
                  <input
                    type="email"
                    {...register("email")}
                    className="w-full rounded-xl border border-brand-neutral-200 px-4 py-2.5 text-sm focus:border-brand-pink-500 focus:outline-none focus:ring-2 focus:ring-brand-pink-400/30"
                    placeholder="tucorreo@ejemplo.com"
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-brand-purple-900">Teléfono / WhatsApp *</label>
                  <input
                    {...register("phone")}
                    className="w-full rounded-xl border border-brand-neutral-200 px-4 py-2.5 text-sm focus:border-brand-pink-500 focus:outline-none focus:ring-2 focus:ring-brand-pink-400/30"
                    placeholder="300 123 4567"
                  />
                  {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-brand-purple-900">Tipo de producto *</label>
                  <select
                    {...register("productType")}
                    className="w-full rounded-xl border border-brand-neutral-200 bg-white px-4 py-2.5 text-sm focus:border-brand-pink-500 focus:outline-none focus:ring-2 focus:ring-brand-pink-400/30"
                  >
                    <option value="balones">Balones</option>
                    <option value="pesas">Pesas y Mancuernas</option>
                    <option value="uniformes">Uniformes</option>
                    <option value="accesorios">Accesorios</option>
                    <option value="otros">Otros</option>
                  </select>
                  {errors.productType && <p className="mt-1 text-xs text-red-500">{errors.productType.message}</p>}
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-brand-purple-900">Cantidad aproximada *</label>
                <input
                  type="number"
                  {...register("quantity")}
                  className="w-full rounded-xl border border-brand-neutral-200 px-4 py-2.5 text-sm focus:border-brand-pink-500 focus:outline-none focus:ring-2 focus:ring-brand-pink-400/30"
                  placeholder="Ej: 20"
                />
                {errors.quantity && <p className="mt-1 text-xs text-red-500">{errors.quantity.message}</p>}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-brand-purple-900">Detalles de la personalización *</label>
                <textarea
                  {...register("details")}
                  rows={4}
                  className="w-full rounded-xl border border-brand-neutral-200 px-4 py-2.5 text-sm focus:border-brand-pink-500 focus:outline-none focus:ring-2 focus:ring-brand-pink-400/30"
                  placeholder="Cuéntanos qué colores, nombres, números o logos necesitas..."
                />
                {errors.details && <p className="mt-1 text-xs text-red-500">{errors.details.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-pink-500 px-6 py-3 text-sm font-bold text-white shadow-soft transition hover:bg-brand-pink-600 disabled:cursor-not-allowed disabled:bg-brand-neutral-300"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Enviar solicitud
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Información lateral */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-brand-neutral-200 bg-brand-purple-950 p-6 text-white shadow-soft">
            <h3 className="text-lg font-bold">¿Prefieres hablar ahora?</h3>
            <p className="mt-2 text-sm text-brand-neutral-200">
              Si tienes dudas urgentes o quieres una cotización inmediata, escríbenos directamente por WhatsApp.
            </p>
            <a
              href="https://wa.me/573001234567?text=Hola%20FORJA,%20quiero%20cotizar%20un%20pedido%20personalizado"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-green-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-green-600"
            >
              <MessageCircle className="h-5 w-5" />
              Chatear por WhatsApp
            </a>
          </div>

          <div className="rounded-2xl border border-brand-neutral-200 bg-white p-6 shadow-soft">
            <h3 className="text-lg font-bold text-brand-purple-900">¿Qué puedes personalizar?</h3>
            <ul className="mt-4 space-y-3 text-sm text-brand-neutral-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-pink-500" />
                <span><strong>Balones:</strong> Nombres, números y logos de equipos.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-pink-500" />
                <span><strong>Uniformes:</strong> Colores, dorsales y patrocinadores.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-pink-500" />
                <span><strong>Accesorios:</strong> Botellas, toallas y bolsas con tu marca.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}