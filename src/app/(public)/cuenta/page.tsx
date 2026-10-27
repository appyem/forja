"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User as UserIcon, LogOut, Package, Mail, Loader2 } from "lucide-react";
import { subscribeToAuthStateChanged, logoutUser, getUserProfile } from "@/services/auth";
import type { User as UserType } from "@/lib/types";

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    // Suscribirse al estado de autenticación de Firebase
    const unsubscribe = subscribeToAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const profile = await getUserProfile(firebaseUser.uid);
        setUser(profile);
      } else {
        // Si no hay usuario, redirigir al login
        router.push("/login");
      }
      setIsLoading(false);
    });

    // Limpiar la suscripción al desmontar el componente
    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logoutUser();
    router.push("/");
  };

  if (isLoading) {
    return (
      <section className="mx-auto flex min-h-[60vh] w-full max-w-7xl items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-brand-pink-500" />
          <p className="text-sm text-brand-neutral-500">Cargando tu perfil...</p>
        </div>
      </section>
    );
  }

  if (!user) {
    return null; // El useEffect ya redirige, esto es solo por seguridad de tipo
  }

  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-extrabold tracking-tight text-brand-purple-900">
          Mi Cuenta
        </h1>
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoggingOut ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <LogOut className="h-4 w-4" />
          )}
          Cerrar sesión
        </button>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Información del Perfil */}
        <div className="md:col-span-1">
          <div className="rounded-2xl border border-brand-neutral-200 bg-white p-6 shadow-soft">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-purple-900 text-white">
              <UserIcon className="h-8 w-8" />
            </div>
            <h2 className="text-lg font-bold text-brand-purple-900">{user.displayName}</h2>
            <div className="mt-3 space-y-2 text-sm text-brand-neutral-600">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-brand-neutral-400" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <UserIcon className="h-4 w-4 text-brand-neutral-400" />
                <span className="capitalize">{user.role === "admin" ? "Administrador" : "Cliente"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Historial de Pedidos */}
        <div className="md:col-span-2">
          <div className="rounded-2xl border border-brand-neutral-200 bg-white p-6 shadow-soft">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-brand-purple-900">
              <Package className="h-5 w-5 text-brand-pink-500" />
              Historial de Pedidos
            </h2>
            
            {/* Placeholder hasta la Etapa 7 (Integración de Pedidos) */}
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-brand-neutral-300 bg-brand-neutral-50 py-12 text-center">
              <Package className="mb-3 h-10 w-10 text-brand-neutral-300" />
              <p className="text-sm font-semibold text-brand-purple-900">Aún no tienes pedidos</p>
              <p className="mt-1 text-xs text-brand-neutral-500">
                Cuando realices tu primera compra, aparecerá aquí con todos los detalles de seguimiento.
              </p>
              <Link
                href="/catalogo"
                className="mt-4 inline-flex items-center rounded-lg bg-brand-pink-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-brand-pink-600"
              >
                Ir a comprar
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}