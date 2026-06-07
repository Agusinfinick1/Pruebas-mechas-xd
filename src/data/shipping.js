// src/data/shipping.js
// Tarifas de envío por región — Mechitas Mechonas
// Ordenadas de Norte a Sur (orden geográfico de Chile)

export const SHIPPING_RATES = [
  {
    code: "XV",
    region: "Región de Arica y Parinacota",
    cost: 7490,
    days: "5-8 días hábiles",
    zone: "Norte Extremo",
    freeAbove: null,
  },
  {
    code: "I",
    region: "Región de Tarapacá",
    cost: 6990,
    days: "5-7 días hábiles",
    zone: "Norte",
    freeAbove: null,
  },
  {
    code: "II",
    region: "Región de Antofagasta",
    cost: 6490,
    days: "4-7 días hábiles",
    zone: "Norte",
    freeAbove: null,
  },
  {
    code: "III",
    region: "Región de Atacama",
    cost: 5490,
    days: "4-6 días hábiles",
    zone: "Norte Chico",
    freeAbove: null,
  },
  {
    code: "IV",
    region: "Región de Coquimbo",
    cost: 3990,
    days: "3-5 días hábiles",
    zone: "Norte Chico",
    freeAbove: 40000,
  },
  {
    code: "V",
    region: "Región de Valparaíso",
    cost: 3490,
    days: "3-4 días hábiles",
    zone: "Centro",
    freeAbove: 35000,
  },
  {
    code: "RM",
    region: "Región Metropolitana de Santiago",
    cost: 2990,
    days: "2-3 días hábiles",
    zone: "Centro",
    freeAbove: 25000,
  },
  {
    code: "VI",
    region: "Región del Libertador Gral. B. O'Higgins",
    cost: 3490,
    days: "3-4 días hábiles",
    zone: "Centro",
    freeAbove: 35000,
  },
  {
    code: "VII",
    region: "Región del Maule",
    cost: 3990,
    days: "3-5 días hábiles",
    zone: "Centro Sur",
    freeAbove: 40000,
  },
  {
    code: "XVI",
    region: "Región de Ñuble",
    cost: 3990,
    days: "3-5 días hábiles",
    zone: "Centro Sur",
    freeAbove: 40000,
  },
  {
    code: "VIII",
    region: "Región del Biobío",
    cost: 4490,
    days: "4-5 días hábiles",
    zone: "Centro Sur",
    freeAbove: 45000,
  },
  {
    code: "IX",
    region: "Región de La Araucanía",
    cost: 4990,
    days: "4-6 días hábiles",
    zone: "Sur",
    freeAbove: 50000,
  },
  {
    code: "XIV",
    region: "Región de Los Ríos",
    cost: 5490,
    days: "4-6 días hábiles",
    zone: "Sur",
    freeAbove: 50000,
  },
  {
    code: "X",
    region: "Región de Los Lagos",
    cost: 5490,
    days: "5-7 días hábiles",
    zone: "Sur",
    freeAbove: 50000,
  },
  {
    code: "XI",
    region: "Región de Aysén del Gral. C. Ibáñez",
    cost: 7490,
    days: "5-8 días hábiles",
    zone: "Austral",
    freeAbove: null,
  },
  {
    code: "XII",
    region: "Región de Magallanes y la Antártica Chilena",
    cost: 8990,
    days: "6-10 días hábiles",
    zone: "Austral",
    freeAbove: null,
  },
]

/**
 * Calcula el costo de envío para una región y subtotal dados.
 * Retorna { cost, isFree, rate } donde:
 *   - cost: costo real a cobrar (0 si aplica envío gratis)
 *   - isFree: boolean si el subtotal supera el umbral de envío gratis
 *   - rate: el objeto SHIPPING_RATES completo, o null si no se encontró
 */
export function getShipping(regionCode, subtotal = 0) {
  const rate = SHIPPING_RATES.find((r) => r.code === regionCode)
  if (!rate) return { cost: 0, isFree: false, rate: null }
  const isFree = rate.freeAbove !== null && subtotal >= rate.freeAbove
  return { cost: isFree ? 0 : rate.cost, isFree, rate }
}
