"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Upload, X, Loader2, AlertCircle } from "lucide-react";
import { getProductById, updateProduct } from "@/services/admin/products";
import type { Product } from "@/lib/types";

const productSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
  categoryId: z.enum(["balones", "pesas"], { message: "Selecciona una categoría válida" }),
  price: z.coerce.number().min(1000, "El precio debe ser al menos $1.000 COP"),
  hasPromotionalPrice: z.boolean(),
  promotionalPrice: z.coerce.number().min(0).optional(),
  sku: z.string().min(3, "El SKU debe tener al menos 3 caracteres"),
  stock: z.coerce.number().int().min(0, "El stock no puede ser negativo"),
  isActive: z.boolean(),
  allowsCustomization: z.boolean(),
});

type ProductFormData = z.infer<typeof productSchema>;

// Omitimos promotionalPrice del Partial para poder redefinirlo correctamente con null
type UpdateProductPayload = Omit<Partial<Omit<Product, "id" | "createdAt" | "updatedAt">>, "promotionalPrice"> & {
  promotionalPrice?: number | null;
};

const compressAndConvertToBase64 = (file: File, maxWidth = 800, quality = 0.7): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (event: ProgressEvent<FileReader>) => {
      const img = document.createElement("img");
      img.src = event.target?.result as string;
      
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        
        if (!ctx) {
          reject(new Error("No se pudo obtener el contexto del canvas"));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        const base64 = canvas.toDataURL("image/jpeg", quality);
        resolve(base64);
      };
      
      img.onerror = (error: Event | string) => reject(error);
    };
    
    reader.onerror = (error: ProgressEvent<FileReader>) => reject(error);
  });
};

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  const hasPromotionalPrice = useWatch({
    control,
    name: "hasPromotionalPrice",
    defaultValue: false,
  });

  useEffect(() => {
    let isMounted = true;
    const loadProduct = async () => {
      try {
        const data = await getProductById(productId);
        if (isMounted) {
          if (data) {
            setProduct(data);
            reset({
              name: data.name,
              description: data.description,
              categoryId: data.categoryId as "balones" | "pesas",
              price: data.price,
              hasPromotionalPrice: !!(data.promotionalPrice && data.promotionalPrice > 0),
              promotionalPrice: data.promotionalPrice || 0,
              sku: data.sku,
              stock: data.stock,
              isActive: data.isActive,
              allowsCustomization: data.allowsCustomization,
            });
          } else {
            router.push("/admin/productos");
          }
        }
      } catch {
        if (isMounted) setErrorMessage("Error al cargar el producto");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    loadProduct();
    return () => { isMounted = false; };
  }, [productId, router, reset]);

  const handleNewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const updatedImages = [...newImages, ...files].slice(0, 5);
    setNewImages(updatedImages);
    const previews = updatedImages.map((file) => URL.createObjectURL(file));
    setNewImagePreviews(previews);
  };

  const removeNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const markImageForDeletion = (imageStr: string) => setImagesToDelete((prev) => [...prev, imageStr]);
  const unmarkImageForDeletion = (imageStr: string) => setImagesToDelete((prev) => prev.filter((url) => url !== imageStr));

  const onSubmit = async (data: ProductFormData) => {
    if (!product) return;
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const keptImages = product.images.filter((img: string) => !imagesToDelete.includes(img));
      
      // ✅ CORRECCIÓN: Envolver la llamada para evitar el conflicto de argumentos de .map()
      const newBase64Images = await Promise.all(
        newImages.map((file) => compressAndConvertToBase64(file))
      );
      
      const finalImages = [...keptImages, ...newBase64Images];

      // ✅ CORRECCIÓN: Tipado estricto sin 'any'
      const productData: UpdateProductPayload = {
        name: data.name,
        description: data.description,
        categoryId: data.categoryId,
        price: data.price,
        sku: data.sku,
        stock: data.stock,
        isActive: data.isActive,
        allowsCustomization: data.allowsCustomization,
        customizationOptions: data.allowsCustomization 
          ? { hasName: true, hasNumber: true, hasColors: true, maxTextLength: 15 } 
          : undefined,
        images: finalImages,
      };

      if (data.hasPromotionalPrice && data.promotionalPrice && data.promotionalPrice > 0) {
        productData.promotionalPrice = data.promotionalPrice;
      } else {
        productData.promotionalPrice = null; // El servicio usará deleteField()
      }

      await updateProduct(productId, productData);
      router.push("/admin/productos");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Error desconocido al actualizar";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-brand-pink-500" />
          <p className="text-sm text-brand-neutral-500">Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const currentImages = product.images.filter((img: string) => !imagesToDelete.includes(img));

  return (
    <div>
      <Link href="/admin/productos" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-brand-neutral-500 transition hover:text-brand-pink-500">
        <ArrowLeft className="h-4 w-4" /> Volver a productos
      </Link>

      <h1 className="mb-6 text-2xl font-bold text-brand-purple-900">Editar Producto</h1>

      {errorMessage && (
        <div className="mb-6 flex items-center gap-2 rounded-lg bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-brand-neutral-200 bg-white p-6 shadow-soft">
            <h2 className="mb-4 text-lg font-bold text-brand-purple-900">Información Básica</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-brand-purple-900">Nombre del producto *</label>
                <input {...register("name")} className="w-full rounded-xl border border-brand-neutral-200 px-4 py-2.5 text-sm focus:border-brand-pink-500 focus:outline-none focus:ring-2 focus:ring-brand-pink-400/30" />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-brand-purple-900">Descripción *</label>
                <textarea {...register("description")} rows={4} className="w-full rounded-xl border border-brand-neutral-200 px-4 py-2.5 text-sm focus:border-brand-pink-500 focus:outline-none focus:ring-2 focus:ring-brand-pink-400/30" />
                {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-brand-purple-900">Categoría *</label>
                  <select {...register("categoryId")} className="w-full rounded-xl border border-brand-neutral-200 bg-white px-4 py-2.5 text-sm focus:border-brand-pink-500 focus:outline-none focus:ring-2 focus:ring-brand-pink-400/30">
                    <option value="balones">Balones</option>
                    <option value="pesas">Pesas y Mancuernas</option>
                  </select>
                  {errors.categoryId && <p className="mt-1 text-xs text-red-500">{errors.categoryId.message}</p>}
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-brand-purple-900">SKU *</label>
                  <input {...register("sku")} className="w-full rounded-xl border border-brand-neutral-200 px-4 py-2.5 text-sm focus:border-brand-pink-500 focus:outline-none focus:ring-2 focus:ring-brand-pink-400/30" />
                  {errors.sku && <p className="mt-1 text-xs text-red-500">{errors.sku.message}</p>}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-brand-neutral-200 bg-white p-6 shadow-soft">
            <h2 className="mb-4 text-lg font-bold text-brand-purple-900">Precio e Inventario</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-brand-purple-900">Precio (COP) *</label>
                <input type="number" {...register("price")} className="w-full rounded-xl border border-brand-neutral-200 px-4 py-2.5 text-sm focus:border-brand-pink-500 focus:outline-none focus:ring-2 focus:ring-brand-pink-400/30" />
                {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price.message}</p>}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-brand-purple-900">Precio Promocional</label>
                <input
                  type="number"
                  {...register("promotionalPrice")}
                  disabled={!hasPromotionalPrice}
                  className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                    hasPromotionalPrice
                      ? "border-brand-neutral-200 focus:border-brand-pink-500 focus:ring-brand-pink-400/30"
                      : "border-brand-neutral-200 bg-brand-neutral-100 text-brand-neutral-400 cursor-not-allowed"
                  }`}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-brand-purple-900">Stock *</label>
                <input type="number" {...register("stock")} className="w-full rounded-xl border border-brand-neutral-200 px-4 py-2.5 text-sm focus:border-brand-pink-500 focus:outline-none focus:ring-2 focus:ring-brand-pink-400/30" />
                {errors.stock && <p className="mt-1 text-xs text-red-500">{errors.stock.message}</p>}
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <input
                type="checkbox"
                {...register("hasPromotionalPrice")}
                className="h-4 w-4 rounded border-brand-neutral-300 text-brand-pink-500 focus:ring-brand-pink-500"
              />
              <span className="text-sm font-medium text-brand-purple-900">
                Activar precio promocional
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-brand-neutral-200 bg-white p-6 shadow-soft">
            <h2 className="mb-4 text-lg font-bold text-brand-purple-900">Opciones</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input type="checkbox" {...register("isActive")} className="h-4 w-4 rounded border-brand-neutral-300 text-brand-pink-500 focus:ring-brand-pink-500" />
                <span className="text-sm font-medium text-brand-purple-900">Producto activo (visible en la tienda)</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" {...register("allowsCustomization")} className="h-4 w-4 rounded border-brand-neutral-300 text-brand-pink-500 focus:ring-brand-pink-500" />
                <span className="text-sm font-medium text-brand-purple-900">Permite personalización</span>
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-brand-neutral-200 bg-white p-6 shadow-soft">
            <h2 className="mb-4 text-lg font-bold text-brand-purple-900">Imágenes Actuales</h2>
            {currentImages.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {currentImages.map((imageStr: string) => {
                  const isMarkedForDeletion = imagesToDelete.includes(imageStr);
                  return (
                    <div key={imageStr} className={`relative aspect-square overflow-hidden rounded-lg border-2 ${isMarkedForDeletion ? "border-red-400 opacity-50" : "border-brand-neutral-200"}`}>
                      <Image src={imageStr} alt="Imagen del producto" fill className="object-cover" />
                      <button type="button" onClick={() => isMarkedForDeletion ? unmarkImageForDeletion(imageStr) : markImageForDeletion(imageStr)} className={`absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full text-white transition ${isMarkedForDeletion ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}`}>
                        <X className="h-4 w-4" />
                      </button>
                      {isMarkedForDeletion && (
                        <div className="absolute inset-0 flex items-center justify-center bg-red-500/20">
                          <span className="rounded bg-red-500 px-2 py-1 text-xs font-semibold text-white">Se eliminará</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-brand-neutral-500">No hay imágenes actuales</p>
            )}
          </div>

          <div className="rounded-2xl border border-brand-neutral-200 bg-white p-6 shadow-soft">
            <h2 className="mb-4 text-lg font-bold text-brand-purple-900">Agregar Nuevas Imágenes</h2>
            <div className="space-y-4">
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-brand-neutral-300 bg-brand-neutral-50 p-6 transition hover:border-brand-pink-500 hover:bg-brand-pink-50">
                <Upload className="mb-2 h-8 w-8 text-brand-neutral-400" />
                <span className="text-sm font-medium text-brand-purple-900">Haz clic para subir imágenes</span>
                <span className="mt-1 text-xs text-brand-neutral-500">Se comprimen automáticamente (máx. 5 imágenes)</span>
                <input type="file" accept="image/*" multiple onChange={handleNewImageChange} className="hidden" />
              </label>
              {newImagePreviews.length > 0 && (
                <div className="grid grid-cols-2 gap-3">
                  {newImagePreviews.map((preview, index) => (
                    <div key={index} className="relative aspect-square overflow-hidden rounded-lg border border-brand-neutral-200">
                      <Image src={preview} alt={`Nueva imagen ${index + 1}`} fill className="object-cover" />
                      <button type="button" onClick={() => removeNewImage(index)} className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white transition hover:bg-red-600">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button type="submit" disabled={isSubmitting} className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-pink-500 px-6 py-3 text-sm font-bold text-white shadow-soft transition hover:bg-brand-pink-600 disabled:cursor-not-allowed disabled:bg-brand-neutral-300">
              {isSubmitting ? (<><Loader2 className="h-4 w-4 animate-spin" />Guardando...</>) : "Guardar cambios"}
            </button>
            <Link href="/admin/productos" className="flex w-full items-center justify-center rounded-xl border border-brand-neutral-200 px-6 py-3 text-sm font-semibold text-brand-purple-900 transition hover:bg-brand-neutral-50">Cancelar</Link>
          </div>
        </div>
      </form>
    </div>
  );
}