// src/data/shipping.js
// Tarifas de envio por region — Mechitas Mechonas
// Ordenadas de Norte a Sur (orden geografico de Chile)

export const SHIPPING_RATES = [
  {
    code: "XV",
    region: "Region de Arica y Parinacota",
    cost: 7490,
    days: "5-8 dias habiles",
    zone: "Norte Extremo",
    freeAbove: null,
  },
  {
    code: "I",
    region: "Region de Tarapaca",
    cost: 6990,
    days: "5-7 dias habiles",
    zone: "Norte",
    freeAbove: null,
  },
  {
    code: "II",
    region: "Region de Antofagasta",
    cost: 6490,
    days: "4-7 dias habiles",
    zone: "Norte",
    freeAbove: null,
  },
  {
    code: "III",
    region: "Region de Atacama",
    cost: 5490,
    days: "4-6 dias habiles",
    zone: "Norte Chico",
    freeAbove: null,
  },
  {
    code: "IV",
    region: "Region de Coquimbo",
    cost: 3990,
    days: "3-5 dias habiles",
    zone: "Norte Chico",
    freeAbove: 40000,
  },
  {
    code: "V",
    region: "Region de Valparaiso",
    cost: 3490,
    days: "3-4 dias habiles",
    zone: "Centro",
    freeAbove: 35000,
  },
  {
    code: "RM",
    region: "Region Metropolitana de Santiago",
    cost: 2990,
    days: "2-3 dias habiles",
    zone: "Centro",
    freeAbove: 25000,
  },
  {
    code: "VI",
    region: "Region del Libertador Gral. B. O'Higgins",
    cost: 3490,
    days: "3-4 dias habiles",
    zone: "Centro",
    freeAbove: 35000,
  },
  {
    code: "VII",
    region: "Region del Maule",
    cost: 3990,
    days: "3-5 dias habiles",
    zone: "Centro Sur",
    freeAbove: 40000,
  },
  {
    code: "XVI",
    region: "Region de Nuble",
    cost: 3990,
    days: "3-5 dias habiles",
    zone: "Centro Sur",
    freeAbove: 40000,
  },
  {
    code: "VIII",
    region: "Region del Biobio",
    cost: 4490,
    days: "4-5 dias habiles",
    zone: "Centro Sur",
    freeAbove: 45000,
  },
  {
    code: "IX",
    region: "Region de La Araucania",
    cost: 4990,
    days: "4-6 dias habiles",
    zone: "Sur",
    freeAbove: 50000,
  },
  {
    code: "XIV",
    region: "Region de Los Rios",
    cost: 5490,
    days: "4-6 dias habiles",
    zone: "Sur",
    freeAbove: 50000,
  },
  {
    code: "X",
    region: "Region de Los Lagos",
    cost: 5490,
    days: "5-7 dias habiles",
    zone: "Sur",
    freeAbove: 50000,
  },
  {
    code: "XI",
    region: "Region de Aysen del Gral. C. Ibanez",
    cost: 7490,
    days: "5-8 dias habiles",
    zone: "Austral",
    freeAbove: null,
  },
  {
    code: "XII",
    region: "Region de Magallanes y la Antartica Chilena",
    cost: 8990,
    days: "6-10 dias habiles",
    zone: "Austral",
    freeAbove: null,
  },
]

/**
 * Calcula el costo de envio dado un codigo de region y el subtotal del carrito.
 * Retorna { cost, isFree, rate }
 */
export function getShipping(regionCode, subtotal = 0) {
  const rate = SHIPPING_RATES.find((r) => r.code === regionCode)
  if (!rate) return { cost: 0, isFree: false, rate: null }
  const isFree = rate.freeAbove !== null && subtotal >= rate.freeAbove
  return { cost: isFree ? 0 : rate.cost, isFree, rate }
}
