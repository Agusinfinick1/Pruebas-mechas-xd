// src/data/orders.js
// MOCK DATA para desarrollo — simula pedidos reales en distintos estados
// TODO (T-04 / C. Pérez): Reemplazar con llamadas a la API REST del backend
// ─────────────────────────────────────────────────────────────────────────────

// Helper para generar un historial de cambio de estado
const hist = (status, isoDate, note = "") => ({
  status,
  timestamp: new Date(isoDate),
  note,
})

export const MOCK_ORDERS = [
  // ── 1. Recién ingresado ───────────────────────────────────────────────────
  {
    id: "ORD-2026-007",
    createdAt: new Date("2026-06-07T09:15:00"),
    customer: {
      nombre: "Valentina Torres Rojas",
      rut: "19.876.543-2",
      direccion: "Los Cerezos 892, Villa Alborada",
      region: "RM",
      comuna: "Pudahuel",
    },
    items: [
      {
        id: 5,
        name: "Lazo Satén para Perrita — Rosa Chicle",
        price: 3990,
        qty: 2,
        image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=500&q=80",
      },
      {
        id: 8,
        name: "Set Dúo Dueña + Mascota",
        price: 8990,
        qty: 1,
        image: "https://images.unsplash.com/photo-1601758124277-5f8bf5b87c2a?w=500&q=80",
      },
    ],
    subtotal: 16970,
    shipping: { cost: 2990, isFree: false, region: "Región Metropolitana de Santiago", days: "2-3 días hábiles" },
    total: 19960,
    status: "pending_payment",
    statusHistory: [
      hist("pending_payment", "2026-06-07T09:15:00", "Pedido recibido vía web"),
    ],
  },

  // ── 2. En revisión de pago ───────────────────────────────────────────────
  {
    id: "ORD-2026-006",
    createdAt: new Date("2026-06-06T16:42:00"),
    customer: {
      nombre: "Francisca Muñoz Castro",
      rut: "17.345.678-K",
      direccion: "Av. Independencia 4560 Depto 3C",
      region: "V",
      comuna: "Valparaíso",
    },
    items: [
      {
        id: 1,
        name: "Lazo de Satén Perla — Edición Romántica",
        price: 5990,
        qty: 3,
        image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&q=80",
      },
    ],
    subtotal: 17970,
    shipping: { cost: 3490, isFree: false, region: "Región de Valparaíso", days: "3-4 días hábiles" },
    total: 21460,
    status: "reviewing_payment",
    statusHistory: [
      hist("pending_payment",      "2026-06-06T16:42:00", "Pedido recibido vía web"),
      hist("reviewing_payment",    "2026-06-06T17:10:00", "Webpay reportó transacción pendiente — verificando con banco"),
    ],
  },

  // ── 3. Pago confirmado ───────────────────────────────────────────────────
  {
    id: "ORD-2026-005",
    createdAt: new Date("2026-06-05T11:20:00"),
    customer: {
      nombre: "Daniela Reyes Pizarro",
      rut: "16.012.345-7",
      direccion: "Calle O'Higgins 231, Casa 4",
      region: "VI",
      comuna: "Rancagua",
    },
    items: [
      {
        id: 4,
        name: "Cintillo Floral Artesanal — Primavera",
        price: 8490,
        qty: 1,
        image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=500&q=80",
      },
      {
        id: 2,
        name: "Scrunchie Terciopelo Rosa Profundo",
        price: 3490,
        qty: 2,
        image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=500&q=80",
      },
    ],
    subtotal: 15470,
    shipping: { cost: 3490, isFree: false, region: "Región del Libertador Gral. B. O'Higgins", days: "3-4 días hábiles" },
    total: 18960,
    status: "payment_confirmed",
    statusHistory: [
      hist("pending_payment",   "2026-06-05T11:20:00", "Pedido recibido vía web"),
      hist("reviewing_payment", "2026-06-05T11:25:00", ""),
      hist("payment_confirmed", "2026-06-05T12:01:00", "Transacción aprobada — Webpay #TBK8823412"),
    ],
  },

  // ── 4. Preparando ────────────────────────────────────────────────────────
  {
    id: "ORD-2026-004",
    createdAt: new Date("2026-06-04T09:00:00"),
    customer: {
      nombre: "Catalina Soto Herrera",
      rut: "20.123.456-1",
      direccion: "Pasaje Los Aromos 12",
      region: "IX",
      comuna: "Temuco",
    },
    items: [
      {
        id: 7,
        name: "Coronita Floral para Mascota",
        price: 4490,
        qty: 1,
        image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=500&q=80",
      },
      {
        id: 6,
        name: "Pañuelito Bandana Colección Primavera",
        price: 2990,
        qty: 2,
        image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=500&q=80",
      },
    ],
    subtotal: 10470,
    shipping: { cost: 4990, isFree: false, region: "Región de La Araucanía", days: "4-6 días hábiles" },
    total: 15460,
    status: "preparing",
    statusHistory: [
      hist("pending_payment",   "2026-06-04T09:00:00", "Pedido recibido vía web"),
      hist("reviewing_payment", "2026-06-04T09:05:00", ""),
      hist("payment_confirmed", "2026-06-04T09:45:00", "Webpay #TBK7710923"),
      hist("preparing",         "2026-06-04T14:30:00", "Iniciando preparación del paquete"),
    ],
  },

  // ── 5. Enviado ───────────────────────────────────────────────────────────
  {
    id: "ORD-2026-003",
    createdAt: new Date("2026-06-02T14:10:00"),
    customer: {
      nombre: "Ana García López",
      rut: "15.234.567-8",
      direccion: "Av. Providencia 1234 Depto 5B",
      region: "RM",
      comuna: "Providencia",
    },
    items: [
      {
        id: 1,
        name: "Lazo de Satén Perla — Edición Romántica",
        price: 5990,
        qty: 2,
        image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&q=80",
      },
      {
        id: 3,
        name: "Set Pinches Perla x6 — Coquette Edition",
        price: 6990,
        qty: 1,
        image: "https://images.unsplash.com/photo-1522338140262-f46f5913618a?w=500&q=80",
      },
    ],
    subtotal: 18970,
    shipping: { cost: 2990, isFree: false, region: "Región Metropolitana de Santiago", days: "2-3 días hábiles" },
    total: 21960,
    status: "shipped",
    statusHistory: [
      hist("pending_payment",   "2026-06-02T14:10:00", "Pedido recibido vía web"),
      hist("reviewing_payment", "2026-06-02T14:12:00", ""),
      hist("payment_confirmed", "2026-06-02T14:58:00", "Webpay #TBK6619001"),
      hist("preparing",         "2026-06-02T16:00:00", ""),
      hist("shipped",           "2026-06-03T09:20:00", "Despachado por Starken — guía #STK44512"),
    ],
  },

  // ── 6. Entregado ─────────────────────────────────────────────────────────
  {
    id: "ORD-2026-002",
    createdAt: new Date("2026-05-30T10:00:00"),
    customer: {
      nombre: "Martina Vidal Sepúlveda",
      rut: "18.456.789-3",
      direccion: "Calle Las Flores 78",
      region: "RM",
      comuna: "Las Condes",
    },
    items: [
      {
        id: 8,
        name: "Set Dúo Dueña + Mascota",
        price: 8990,
        qty: 1,
        image: "https://images.unsplash.com/photo-1601758124277-5f8bf5b87c2a?w=500&q=80",
      },
    ],
    subtotal: 8990,
    shipping: { cost: 0, isFree: true, region: "Región Metropolitana de Santiago", days: "2-3 días hábiles" },
    total: 8990,
    status: "delivered",
    statusHistory: [
      hist("pending_payment",   "2026-05-30T10:00:00", ""),
      hist("reviewing_payment", "2026-05-30T10:02:00", ""),
      hist("payment_confirmed", "2026-05-30T10:44:00", "Webpay #TBK5509877"),
      hist("preparing",         "2026-05-30T15:00:00", ""),
      hist("shipped",           "2026-05-31T08:30:00", "Blue Express — guía #BLX8831"),
      hist("delivered",         "2026-06-02T14:05:00", "Confirmación de recepción"),
    ],
  },

  // ── 7. Cancelado ─────────────────────────────────────────────────────────
  {
    id: "ORD-2026-001",
    createdAt: new Date("2026-05-28T18:30:00"),
    customer: {
      nombre: "Isabella Morales Díaz",
      rut: "14.987.654-5",
      direccion: "Av. Grecia 2211 Block C Depto 801",
      region: "RM",
      comuna: "Ñuñoa",
    },
    items: [
      {
        id: 3,
        name: "Set Pinches Perla x6 — Coquette Edition",
        price: 6990,
        qty: 1,
        image: "https://images.unsplash.com/photo-1522338140262-f46f5913618a?w=500&q=80",
      },
    ],
    subtotal: 6990,
    shipping: { cost: 2990, isFree: false, region: "Región Metropolitana de Santiago", days: "2-3 días hábiles" },
    total: 9980,
    status: "cancelled",
    statusHistory: [
      hist("pending_payment", "2026-05-28T18:30:00", ""),
      hist("cancelled",       "2026-05-28T19:45:00", "Pago no procesado — transacción rechazada por banco"),
    ],
  },
]
