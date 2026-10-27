// Roles de usuario
export type UserRole = "client" | "admin";

// Estados de un pedido
export type OrderStatus = 
  | "pending_payment"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

// Estados de pago
export type PaymentStatus = "pending" | "approved" | "rejected" | "refunded";

// Producto
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  images: string[];
  price: number; // En centavos o entero para evitar problemas de punto flotante (COP)
  promotionalPrice?: number;
  sku: string;
  stock: number;
  isActive: boolean;
  allowsCustomization: boolean;
  customizationOptions?: {
    hasName: boolean;
    hasNumber: boolean;
    hasColors: boolean;
    maxTextLength?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Ítem en el carrito / detalle de pedido
export interface CartItem {
  productId: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  image: string;
  customization?: {
    name?: string;
    number?: string;
    colors?: string;
    text?: string;
  };
}

// Pedido (Order)
export interface Order {
  id: string;
  userId: string; // ID del usuario de Firebase Auth (o "guest" si es invitado)
  guestEmail?: string; // Para compras como invitado
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  currency: "COP";
  shippingAddress: {
    fullName: string;
    phone: string;
    department: string;
    city: string;
    address: string;
    addressDetail?: string;
  };
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: string; // ej: "wompi", "mercadopago", "nequi"
  paymentReference?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Usuario
export interface User {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  phone?: string;
  createdAt: Date;
}