"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Mail, Lock, User, AlertCircle } from "lucide-react";
import { loginUser, registerUser, getUserProfile } from "@/services/auth";

const authSchema = z.object({
  email: z.string().email("Correo electrónico inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  displayName: z.string().optional(),
});

type AuthFormData = z.infer<typeof authSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
      displayName: "",
    },
  });

  const onSubmit = async (data: AuthFormData) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      if (isRegistering) {
        const cleanName = data.displayName?.trim() || "";
        if (cleanName.length < 3) {
          setErrorMessage("El nombre es obligatorio para registrarse y debe tener al menos 3 caracteres.");
          setIsLoading(false);
          return;
        }
        
        const result = await registerUser(data.email, data.password, cleanName);
        if (!result.success) {
          setErrorMessage(result.error || "Error al registrar el usuario.");
        } else {
          // Los nuevos registros siempre van a /cuenta primero
          router.push("/cuenta");
        }
              } else {
        const result = await loginUser(data.email, data.password);
        if (!result.success) {
          setErrorMessage("Correo o contraseña incorrectos.");
        } else if (result.user) {
          // 🔍 Verificamos el rol antes de redirigir (con validación de tipo segura)
          const profile = await getUserProfile(result.user.uid);
          if (profile?.role === "admin") {
            router.push("/admin");
          } else {
            router.push("/cuenta");
          }
        }
      }
    } catch {
      setErrorMessage("Ocurrió un error inesperado. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setErrorMessage(null);
    reset();
  };

  return (
    <section className="mx-auto flex min-h-[80vh] w-full max-w-md flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-brand-neutral-500 transition hover:text-brand-pink-500"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al inicio
      </Link>

      <div className="rounded-2xl border border-brand-neutral-200 bg-white p-8 shadow-soft">
        <h1 className="text-2xl font-extrabold tracking-tight text-brand-purple-900">
          {isRegistering ? "Crea tu cuenta" : "Bienvenido de nuevo"}
        </h1>
        <p className="mt-2 text-sm text-brand-neutral-500">
          {isRegistering
            ? "Regístrate para guardar tu historial de pedidos y direcciones."
            : "Ingresa tus credenciales para acceder a tu cuenta."}
        </p>

        {errorMessage && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          {isRegistering && (
            <div>
              <label className="mb-1 block text-sm font-medium text-brand-purple-900">
                Nombre completo *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-neutral-400" />
                <input
                  {...register("displayName")}
                  className="w-full rounded-xl border border-brand-neutral-200 bg-white py-2.5 pl-9 pr-3 text-sm text-brand-purple-900 placeholder:text-brand-neutral-400 focus:border-brand-pink-500 focus:outline-none focus:ring-2 focus:ring-brand-pink-400/30"
                  placeholder="Juan Pérez"
                />
              </div>
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium text-brand-purple-900">
              Correo electrónico *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-neutral-400" />
              <input
                {...register("email")}
                type="email"
                className="w-full rounded-xl border border-brand-neutral-200 bg-white py-2.5 pl-9 pr-3 text-sm text-brand-purple-900 placeholder:text-brand-neutral-400 focus:border-brand-pink-500 focus:outline-none focus:ring-2 focus:ring-brand-pink-400/30"
                placeholder="tu@correo.com"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-brand-purple-900">
              Contraseña *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-neutral-400" />
              <input
                {...register("password")}
                type="password"
                className="w-full rounded-xl border border-brand-neutral-200 bg-white py-2.5 pl-9 pr-3 text-sm text-brand-purple-900 placeholder:text-brand-neutral-400 focus:border-brand-pink-500 focus:outline-none focus:ring-2 focus:ring-brand-pink-400/30"
                placeholder="••••••••"
              />
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-pink-500 px-6 py-3 text-sm font-bold text-white shadow-soft transition hover:bg-brand-pink-600 disabled:cursor-not-allowed disabled:bg-brand-neutral-300"
          >
            {isLoading ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              isRegistering ? "Crear cuenta" : "Iniciar sesión"
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-brand-neutral-600">
          {isRegistering ? "¿Ya tienes una cuenta?" : "¿No tienes una cuenta?"}{" "}
          <button
            type="button"
            onClick={toggleMode}
            className="font-semibold text-brand-pink-500 transition hover:text-brand-pink-600 hover:underline"
          >
            {isRegistering ? "Inicia sesión aquí" : "Regístrate gratis"}
          </button>
        </div>
      </div>
    </section>
  );
}