"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, CheckCircle, CreditCard, Smartphone } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCartStore } from "@/stores/cartStore";
import { checkoutSchema, type CheckoutFormData } from "@/lib/validations/checkout";
import { formatCOP } from "@/lib/utils/format";

const SHIPPING_COST = 15000;
const DEPARTAMENTOS = ["Bogotá D.C.", "Antioquia", "Valle del Cauca", "Atlántico", "Santander", "Cundinamarca", "Bolívar", "Norte de Santander", "Tolima", "Risaralda", "Otros"];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, getItemCount, clearCart } = useCartStore();

  const subtotal = getSubtotal();
  const total = subtotal > 0 ? subtotal + SHIPPING_COST : 0;
  const itemCount = getItemCount();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: "mercadopago",
      acceptTerms: false,
    },
  });

  // Redirección segura si el carrito está vacío (sin setState, por lo tanto, sin error de ESLint)
  useEffect(() => {
    if (itemCount === 0) {
      router.push("/carrito");
    }
  }, [itemCount, router]);

  const onSubmit = async (data: CheckoutFormData) => {
    console.log("Datos del checkout validados:", data);
    console.log("Productos a comprar:", items);
    console.log("Total a cobrar:", total);
    
    alert("¡Pedido simulado con éxito! En la Etapa 7 conectaremos esto con la pasarela de pagos real.");
    clearCart();
    router.push("/");
  };

  if (itemCount === 0) {
    return (
      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-center text-brand-neutral-500">Redirigiendo al carrito...</p>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/carrito"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-brand-neutral-500 transition hover:text-brand-pink-500"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al carrito
      </Link>

      <h1 className="mb-8 text-3xl font-extrabold tracking-tight text-brand-purple-900">
        Finalizar Compra
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-8 lg:grid-cols-3">
        {/* Formulario de Datos */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* 1. Datos de Contacto */}
          <div className="rounded-2xl border border-brand-neutral-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-bold text-brand-purple-900">1. Datos de Contacto</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-brand-purple-900">Nombre completo *</label>
                <input
                  {...register("fullName")}
                  className="w-full rounded-xl border border-brand-neutral-200 px-4 py-2.5 text-sm focus:border-brand-pink-500 focus:outline-none focus:ring-2 focus:ring-brand-pink-400/30"
                  placeholder="Juan Pérez"
                />
                {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName.message}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-brand-purple-900">Teléfono / WhatsApp *</label>
                <input
                  {...register("phone")}
                  className="w-full rounded-xl border border-brand-neutral-200 px-4 py-2.5 text-sm focus:border-brand-pink-500 focus:outline-none focus:ring-2 focus:ring-brand-pink-400/30"
                  placeholder="300 123 4567"
                />
                {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
              </div>
            </div>
          </div>

          {/* 2. Dirección de Envío */}
          <div className="rounded-2xl border border-brand-neutral-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-bold text-brand-purple-900">2. Dirección de Envío</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-brand-purple-900">Departamento *</label>
                <select
                  {...register("department")}
                  className="w-full rounded-xl border border-brand-neutral-200 bg-white px-4 py-2.5 text-sm focus:border-brand-pink-500 focus:outline-none focus:ring-2 focus:ring-brand-pink-400/30"
                >
                  <option value="">Selecciona...</option>
                  {DEPARTAMENTOS.map((dep) => (
                    <option key={dep} value={dep}>{dep}</option>
                  ))}
                </select>
                {errors.department && <p className="mt-1 text-xs text-red-500">{errors.department.message}</p>}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-brand-purple-900">Ciudad / Municipio *</label>
                <input
                  {...register("city")}
                  className="w-full rounded-xl border border-brand-neutral-200 px-4 py-2.5 text-sm focus:border-brand-pink-500 focus:outline-none focus:ring-2 focus:ring-brand-pink-400/30"
                  placeholder="Ej: Medellín"
                />
                {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city.message}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-brand-purple-900">Dirección completa *</label>
                <input
                  {...register("address")}
                  className="w-full rounded-xl border border-brand-neutral-200 px-4 py-2.5 text-sm focus:border-brand-pink-500 focus:outline-none focus:ring-2 focus:ring-brand-pink-400/30"
                  placeholder="Calle 123 # 45-67, Apto 101"
                />
                {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address.message}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-brand-neutral-500">Detalle adicional (Opcional)</label>
                <input
                  {...register("addressDetail")}
                  className="w-full rounded-xl border border-brand-neutral-200 px-4 py-2.5 text-sm focus:border-brand-pink-500 focus:outline-none focus:ring-2 focus:ring-brand-pink-400/30"
                  placeholder="Conjunto, torre, indicaciones de entrega..."
                />
                {errors.addressDetail && <p className="mt-1 text-xs text-red-500">{errors.addressDetail.message}</p>}
              </div>
            </div>
          </div>

          {/* 3. Método de Pago */}
          <div className="rounded-2xl border border-brand-neutral-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-bold text-brand-purple-900">3. Método de Pago</h2>
            <div className="space-y-3">
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-brand-neutral-200 p-4 transition hover:border-brand-pink-500 has-[:checked]:border-brand-pink-500 has-[:checked]:bg-brand-pink-50">
                <input type="radio" value="mercadopago" {...register("paymentMethod")} className="h-4 w-4 text-brand-pink-500" />
                <CreditCard className="h-5 w-5 text-brand-purple-900" />
                <div>
                  <p className="text-sm font-semibold text-brand-purple-900">Tarjeta de Crédito / Débito o PSE</p>
                  <p className="text-xs text-brand-neutral-500">Procesado de forma segura por Mercado Pago</p>
                </div>
              </label>
              
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-brand-neutral-200 p-4 transition hover:border-brand-pink-500 has-[:checked]:border-brand-pink-500 has-[:checked]:bg-brand-pink-50">
                <input type="radio" value="wompi" {...register("paymentMethod")} className="h-4 w-4 text-brand-pink-500" />
                <Smartphone className="h-5 w-5 text-brand-purple-900" />
                <div>
                  <p className="text-sm font-semibold text-brand-purple-900">Nequi / Daviplata / Wompi</p>
                  <p className="text-xs text-brand-neutral-500">Pago rápido desde tu aplicación móvil</p>
                </div>
              </label>
            </div>
            {errors.paymentMethod && <p className="mt-2 text-xs text-red-500">{errors.paymentMethod.message}</p>}
          </div>

          {/* 4. Términos y Condiciones */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              {...register("acceptTerms")}
              className="mt-1 h-4 w-4 rounded border-brand-neutral-300 text-brand-pink-500 focus:ring-brand-pink-500"
            />
            <label className="text-sm text-brand-neutral-600">
              Acepto los <Link href="/terminos" className="text-brand-pink-500 underline">términos y condiciones</Link> y la <Link href="/privacidad" className="text-brand-pink-500 underline">política de privacidad</Link>. Entiendo que mis datos serán usados únicamente para procesar este envío.
            </label>
          </div>
          {errors.acceptTerms && <p className="text-xs text-red-500">{errors.acceptTerms.message}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-brand-pink-500 px-6 py-4 text-base font-bold text-white shadow-soft transition hover:bg-brand-pink-600 disabled:cursor-not-allowed disabled:bg-brand-neutral-300"
          >
            {isSubmitting ? "Procesando..." : `Pagar ${formatCOP(total)}`}
          </button>
        </div>

        {/* Resumen del Pedido (Sticky) */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-brand-neutral-200 bg-white p-6 shadow-soft">
            <h2 className="text-lg font-bold text-brand-purple-900">Resumen del pedido</h2>
            
            <div className="mt-4 max-h-64 space-y-4 overflow-y-auto pr-2">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-3">
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-brand-neutral-100">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-purple-900 text-[10px] font-bold text-white">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-brand-purple-900 line-clamp-2">{item.name}</p>
                    <p className="text-xs text-brand-neutral-500">{formatCOP(item.price)} c/u</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3 border-t border-brand-neutral-200 pt-4 text-sm">
              <div className="flex justify-between text-brand-neutral-600">
                <span>Subtotal ({itemCount} productos)</span>
                <span>{formatCOP(subtotal)}</span>
              </div>
              <div className="flex justify-between text-brand-neutral-600">
                <span>Envío estimado</span>
                <span>{formatCOP(SHIPPING_COST)}</span>
              </div>
              <div className="border-t border-brand-neutral-200 pt-3">
                <div className="flex justify-between text-lg font-bold text-brand-purple-900">
                  <span>Total a pagar</span>
                  <span>{formatCOP(total)}</span>
                </div>
                <p className="mt-1 text-xs text-brand-neutral-500">Impuestos incluidos</p>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-2 rounded-xl bg-green-50 p-3 text-xs text-green-700">
              <CheckCircle className="h-4 w-4 flex-shrink-0" />
              <span>Tus datos están protegidos con encriptación de extremo a extremo.</span>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}