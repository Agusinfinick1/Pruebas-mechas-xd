// src/data/orderStatuses.js
// Definición centralizada de estados de pedido — Mechitas Mechonas
// Mantener aquí cualquier cambio de estados, colores o transiciones

// Paleta de colores para cada estado (usando hex directos para seguridad con Tailwind JIT)
// ─────────────────────────────────────────────────────────────────────────────
const COLORS = {
  gold:    { bg: "#fff8dc", text: "#a07a10", border: "#f5c842" },
  amber:   { bg: "#fef3c7", text: "#92400e", border: "#fbbf24" },
  teal:    { bg: "#e4f7f5", text: "#2a7068", border: "#5DBFB0" },
  blue:    { bg: "#eff6ff", text: "#1d4ed8", border: "#93c5fd" },
  green:   { bg: "#d1fae5", text: "#065f46", border: "#34d399" },
  emerald: { bg: "#f0fdf4", text: "#15803d", border: "#86efac" },
  rose:    { bg: "#fde8ec", text: "#9b4f60", border: "#f29eab" },
  gray:    { bg: "#f0f0f0", text: "#557570", border: "#ddd0d3" },
}

export const ORDER_STATUSES = {
  // ── Cliente acaba de pagar (o simular pago) ──────────────────────────────
  pending_payment: {
    key:         "pending_payment",
    label:       "Pendiente de pago",
    short:       "Pendiente",
    icon:        "",
    description: "El cliente completó el pedido. Esperando confirmación de la pasarela de pago.",
    colors:      COLORS.gold,
    // Estados a los que este puede avanzar
    next: ["reviewing_payment", "cancelled"],
  },

  // ── Webpay notificó pero se verifica manualmente ─────────────────────────
  reviewing_payment: {
    key:         "reviewing_payment",
    label:       "En revisión de pago",
    short:       "En revisión",
    icon:        "",
    description: "El equipo está verificando la transacción con Webpay/banco.",
    colors:      COLORS.amber,
    next: ["payment_confirmed", "cancelled"],
  },

  // ── Pago confirmado, a preparar ──────────────────────────────────────────
  payment_confirmed: {
    key:         "payment_confirmed",
    label:       "Pago confirmado",
    short:       "Confirmado",
    icon:        "",
    description: "El pago fue verificado y aprobado correctamente.",
    colors:      COLORS.teal,
    next: ["preparing", "cancelled"],
  },

  // ── Se está armando el pedido ────────────────────────────────────────────
  preparing: {
    key:         "preparing",
    label:       "Preparando pedido",
    short:       "Preparando",
    icon:        "",
    description: "El pedido está siendo empaquetado y listo para despacho.",
    colors:      COLORS.blue,
    next: ["shipped"],
  },

  // ── Entregado al courier ─────────────────────────────────────────────────
  shipped: {
    key:         "shipped",
    label:       "Enviado",
    short:       "Enviado",
    icon:        "",
    description: "El pedido fue despachado al transportista. En camino al cliente.",
    colors:      COLORS.green,
    next: ["delivered"],
  },

  // ── Cliente recibió el pedido ────────────────────────────────────────────
  delivered: {
    key:         "delivered",
    label:       "Entregado",
    short:       "Entregado",
    icon:        "",
    description: "El pedido fue entregado con éxito al cliente.",
    colors:      COLORS.emerald,
    next: [], // estado terminal
  },

  // ── Pedido cancelado (por cualquier razón) ───────────────────────────────
  cancelled: {
    key:         "cancelled",
    label:       "Cancelado",
    short:       "Cancelado",
    icon:        "",
    description: "El pedido fue cancelado. Si hay pago pendiente, procesar reembolso.",
    colors:      COLORS.rose,
    next: ["refunded"],
  },

  // ── Pago devuelto al cliente ─────────────────────────────────────────────
  refunded: {
    key:         "refunded",
    label:       "Reembolsado",
    short:       "Reembolsado",
    icon:        "",
    description: "El monto fue devuelto al cliente correctamente.",
    colors:      COLORS.gray,
    next: [], // estado terminal
  },
}

// Orden visual para el filtro de estados (de más común a menos en producción)
export const STATUS_DISPLAY_ORDER = [
  "pending_payment",
  "reviewing_payment",
  "payment_confirmed",
  "preparing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
]

// Helper: obtiene el objeto de estado, o null si key inválida
export function getStatus(key) {
  return ORDER_STATUSES[key] ?? null
}

// Helper: retorna los estados siguientes posibles desde el estado actual
export function getNextStatuses(currentKey) {
  const current = ORDER_STATUSES[currentKey]
  if (!current) return []
  return current.next.map((k) => ORDER_STATUSES[k])
}
