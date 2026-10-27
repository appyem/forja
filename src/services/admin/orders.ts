import { collection, doc, getDoc, getDocs, updateDoc, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { Order, OrderStatus } from "@/lib/types";

/**
 * Obtiene todos los pedidos ordenados por fecha (más recientes primero).
 */
export async function getAllOrdersForAdmin(): Promise<Order[]> {
  try {
    const q = query(
      collection(db, "orders"),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() ?? new Date(),
        updatedAt: data.updatedAt?.toDate?.() ?? new Date(),
      } as Order;
    });
  } catch (error: unknown) {
    console.error("[admin/orders] Error al obtener pedidos:", error);
    return [];
  }
}

/**
 * Obtiene un pedido por su ID.
 */
export async function getOrderById(orderId: string): Promise<Order | null> {
  try {
    const docRef = doc(db, "orders", orderId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      createdAt: data.createdAt?.toDate?.() ?? new Date(),
      updatedAt: data.updatedAt?.toDate?.() ?? new Date(),
    } as Order;
  } catch (error: unknown) {
    console.error("[admin/orders] Error al obtener pedido:", error);
    return null;
  }
}

/**
 * Actualiza el estado de un pedido.
 */
export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
  try {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, {
      status,
      updatedAt: new Date(),
    });
  } catch (error: unknown) {
    console.error("[admin/orders] Error al actualizar estado:", error);
    throw new Error("No se pudo actualizar el estado del pedido");
  }
}