// Almacén de pedidos del módulo tienda.
//
// DEMO/MVP: en memoria (globalThis), igual que booking-store — suficiente para
// mostrar el flujo completo (carrito → Webpay → confirmación → panel). En
// producción este módulo se respalda en Postgres (Neon) reemplazando solo estas
// funciones; por eso la página de confirmación también lee los datos del pago
// desde la URL de retorno y no depende únicamente de esta memoria.

export interface OrderItem {
  slug: string;
  name: string;
  price: number; // CLP unitario
  qty: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  buyer: { name: string; email: string; phone: string; address?: string; note?: string };
  status: "pendiente_pago" | "pagada" | "rechazada" | "anulada";
  authorizationCode?: string;
  cardLast4?: string;
  createdAt: string;
}

const g = globalThis as unknown as { __orderStore?: { orders: Order[] } };

function store(): { orders: Order[] } {
  if (!g.__orderStore) g.__orderStore = { orders: [] };
  return g.__orderStore;
}

export function createOrder(data: Pick<Order, "items" | "total" | "buyer">): Order {
  const order: Order = {
    ...data,
    // Alfanumérico corto: Webpay exige buy_order de máx. 26 caracteres.
    id: "P" + Math.random().toString(36).slice(2, 8).toUpperCase(),
    status: "pendiente_pago",
    createdAt: new Date().toISOString(),
  };
  store().orders.push(order);
  return order;
}

export function getOrder(id: string): Order | undefined {
  return store().orders.find((o) => o.id === id);
}

export function setOrderResult(
  id: string,
  status: Order["status"],
  detail?: { authorizationCode?: string; cardLast4?: string }
): void {
  const o = getOrder(id);
  if (!o) return;
  o.status = status;
  if (detail?.authorizationCode) o.authorizationCode = detail.authorizationCode;
  if (detail?.cardLast4) o.cardLast4 = detail.cardLast4;
}

export function listOrders(): Order[] {
  return [...store().orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
