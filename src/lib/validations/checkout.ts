import { z } from "zod";

export const checkoutSchema = z.object({
  fullName: z
    .string()
    .min(3, "El nombre completo debe tener al menos 3 caracteres")
    .max(100, "El nombre es demasiado largo"),
  phone: z
    .string()
    .min(7, "El teléfono debe tener al menos 7 dígitos")
    .regex(/^[0-9+\-\s()]+$/, "El teléfono solo puede contener números, espacios o guiones"),
  department: z.string().min(1, "Selecciona un departamento válido"),
  city: z.string().min(2, "La ciudad debe tener al menos 2 caracteres"),
  address: z.string().min(5, "La dirección debe ser más específica (ej: Calle 123 # 45-67)"),
  addressDetail: z.string().max(100, "El detalle es demasiado largo").optional(),
  paymentMethod: z.string().min(1, "Selecciona un método de pago válido"),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "Debes aceptar los términos y condiciones",
  }),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;