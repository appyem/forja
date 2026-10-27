/**
 * Formatea un número a pesos colombianos (COP).
 * Ejemplo: 120000 -> "$ 120.000"
 */
export function formatCOP(amount: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount).replace("COP", "").trim();
}

/**
 * Convierte un texto en un slug válido para URLs.
 * Ejemplo: "Balón de Fútbol Personalizado" -> "balon-de-futbol-personalizado"
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Reemplaza espacios con guiones
    .replace(/[^\w\-]+/g, "") // Elimina caracteres no alfanuméricos
    .replace(/\-\-+/g, "-"); // Reemplaza múltiples guiones con uno solo
}

/**
 * Calcula el precio final de un producto (aplica precio promocional si existe).
 */
export function getFinalPrice(price: number, promotionalPrice?: number): number {
  if (promotionalPrice && promotionalPrice > 0 && promotionalPrice < price) {
    return promotionalPrice;
  }
  return price;
}

/**
 * Calcula el porcentaje de descuento para mostrar en la UI.
 */
export function getDiscountPercentage(price: number, promotionalPrice?: number): number | null {
  if (!promotionalPrice || promotionalPrice >= price || promotionalPrice <= 0) {
    return null;
  }
  const discount = Math.round(((price - promotionalPrice) / price) * 100);
  return discount > 0 ? discount : null;
}