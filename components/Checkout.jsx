// src/components/Checkout.jsx
// Flujo de pago en 3 pasos: Datos → Resumen → Confirmacion
// T-09: calculo de costo de envio por region (SHIPPING_RATES + getShipping)

import { useState } from "react"
import { SHIPPING_RATES, getShipping } from "../data/shipping"

export default function Checkout({ items, total, onBack, onPlaceOrder }) {
  const [step,    setStep]    = useState(1)
  const [orderId, setOrderId] = useState(null)
  const [placing, setPlacing] = useState(false) // loading mientras graba en Supabase
  const [placeError, setPlaceError] = useState("")

  const [form, setForm] = useState({
    nombre:    "",
    rut:       "",
    direccion: "",
    region:    "",
    comuna:    "",
  })
  const [errors, setErrors] = useState({})

  // ── Calculo de envio ───────────────────────────────────────────────────────
  const { cost: shippingCost, isFree, rate: shippingRate } = getShipping(
    form.region,
    total
  )
  const grandTotal = total + shippingCost

  // ── Helpers ────────────────────────────────────────────────────────────────
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }))
  }

  const validateStep1 = () => {
    const e = {}
    if (!form.nombre.trim())    e.nombre    = "El nombre es obligatorio"
    if (!form.rut.trim())       e.rut       = "El RUT es obligatorio"
    if (!form.direccion.trim()) e.direccion = "La direccion es obligatoria"
    if (!form.region)           e.region    = "Selecciona tu region"
    if (!form.comuna.trim())    e.comuna    = "La comuna es obligatoria"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handlePayment = async () => {
    setPlaceError("")
    if (!onPlaceOrder) {
      // Fallback si onPlaceOrder no esta disponible
      alert("Pago pendiente de integracion con Webpay.")
      return
    }
    setPlacing(true)
    const newId = await onPlaceOrder({
      customer: { ...form },
      items,
      subtotal: total,
      shipping: {
        cost:     shippingCost,
        is_free:  isFree,
        region:   shippingRate?.region ?? form.region,
        days:     shippingRate?.days   ?? "—",
      },
      total: grandTotal,
    })
    setPlacing(false)

    if (newId) {
      setOrderId(newId)
      setStep(3)
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else {
      setPlaceError(
        "No se pudo registrar el pedido. Revisa tu conexion e intenta nuevamente."
      )
    }
  }

  // ── Clases de input compartidas ────────────────────────────────────────────
  const inputCls = (field) =>
    `w-full bg-white border ${
      errors[field] ? "border-rose-berry" : "border-dust"
    } rounded-xl px-4 py-3 text-sm font-body text-ink outline-none focus:border-teal focus:ring-2 focus:ring-teal/20 transition-all placeholder:text-mist`

  return (
    <section className="bg-sand min-h-screen py-10 sm:py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">

        {/* Cabecera y pasos (solo en paso 1 y 2) */}
        {step < 3 && (
          <div className="mb-8">
            <button
              onClick={() => (step === 2 ? setStep(1) : onBack())}
              className="font-body font-semibold text-sm text-teal-dark hover:text-teal transition-colors mb-4 inline-block"
            >
              {step === 2 ? "Volver al paso anterior" : "Volver al catalogo"}
            </button>
            <h1 className="font-display font-black text-3xl sm:text-4xl text-ink">
              Finalizar Compra
            </h1>
            <div className="flex items-center gap-4 mt-4">
              {[
                { n: 1, label: "Datos de Envio" },
                { n: 2, label: "Resumen y Pago" },
              ].map(({ n, label }, i) => (
                <div key={n} className="flex items-center gap-2">
                  {i > 0 && <div className="w-8 h-px bg-dust" />}
                  <div className={`flex items-center gap-2 ${step === n ? "text-ink" : "text-mist"}`}>
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        step > n ? "bg-teal text-white" : step === n ? "bg-ink text-white" : "bg-dust text-mist"
                      }`}
                    >
                      {step > n ? "OK" : n}
                    </span>
                    <span className="font-body text-sm font-semibold">{label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ════════ PASO 1 — Datos del cliente ════════ */}
        {step === 1 && (
          <div className="bg-white rounded-3xl border border-dust p-6 sm:p-8 shadow-card">
            <h2 className="font-display font-bold text-xl text-ink mb-6">
              Datos del Cliente
            </h2>
            <div className="flex flex-col gap-5">

              {/* Nombre */}
              <div>
                <label htmlFor="co-nombre" className="font-body text-sm font-semibold text-ink mb-1.5 block">
                  Nombre completo
                </label>
                <input id="co-nombre" type="text" placeholder="Ingresa tu nombre"
                  value={form.nombre} onChange={(e) => handleChange("nombre", e.target.value)}
                  className={inputCls("nombre")} />
                {errors.nombre && <p className="text-rose-berry text-xs mt-1 font-semibold">{errors.nombre}</p>}
              </div>

              {/* RUT */}
              <div>
                <label htmlFor="co-rut" className="font-body text-sm font-semibold text-ink mb-1.5 block">
                  RUT
                </label>
                <input id="co-rut" type="text" placeholder="12.345.678-9"
                  value={form.rut} onChange={(e) => handleChange("rut", e.target.value)}
                  className={inputCls("rut")} />
                {errors.rut && <p className="text-rose-berry text-xs mt-1 font-semibold">{errors.rut}</p>}
              </div>

              {/* Direccion */}
              <div>
                <label htmlFor="co-dir" className="font-body text-sm font-semibold text-ink mb-1.5 block">
                  Direccion
                </label>
                <input id="co-dir" type="text" placeholder="Calle, numero, depto."
                  value={form.direccion} onChange={(e) => handleChange("direccion", e.target.value)}
                  className={inputCls("direccion")} />
                {errors.direccion && <p className="text-rose-berry text-xs mt-1 font-semibold">{errors.direccion}</p>}
              </div>

              {/* Region — T-09 */}
              <div>
                <label htmlFor="co-region" className="font-body text-sm font-semibold text-ink mb-1.5 block">
                  Region
                </label>
                <select id="co-region" value={form.region}
                  onChange={(e) => handleChange("region", e.target.value)}
                  className={`${inputCls("region")} cursor-pointer`}
                >
                  <option value="">Selecciona tu region</option>
                  {SHIPPING_RATES.map((r) => (
                    <option key={r.code} value={r.code}>{r.region}</option>
                  ))}
                </select>
                {errors.region && <p className="text-rose-berry text-xs mt-1 font-semibold">{errors.region}</p>}

                {/* Preview del costo al seleccionar region */}
                {form.region && shippingRate && (
                  <div className={`mt-2 rounded-xl px-4 py-3 text-sm font-body flex items-center justify-between gap-2 ${
                    isFree
                      ? "bg-teal-pale border border-teal/30 text-teal-dark"
                      : "bg-sand border border-dust text-mist"
                  }`}>
                    <span>
                      {isFree
                        ? "Envio gratis para esta region"
                        : `Costo de envio: $${shippingCost.toLocaleString("es-CL")}`}
                    </span>
                    <span className="text-xs font-semibold opacity-70 flex-shrink-0">
                      {shippingRate.days}
                    </span>
                  </div>
                )}

                {/* Nota de envio gratis por monto */}
                {form.region && shippingRate && !isFree && shippingRate.freeAbove && (
                  <p className="text-xs text-mist mt-1.5 font-body">
                    Envio gratis al comprar $
                    {shippingRate.freeAbove.toLocaleString("es-CL")} o mas en esta region.
                  </p>
                )}
              </div>

              {/* Comuna */}
              <div>
                <label htmlFor="co-comuna" className="font-body text-sm font-semibold text-ink mb-1.5 block">
                  Ciudad / Comuna
                </label>
                <input id="co-comuna" type="text" placeholder="Ingresa tu comuna"
                  value={form.comuna} onChange={(e) => handleChange("comuna", e.target.value)}
                  className={inputCls("comuna")} />
                {errors.comuna && <p className="text-rose-berry text-xs mt-1 font-semibold">{errors.comuna}</p>}
              </div>

              <button onClick={handleNext} id="checkout-next"
                className="w-full bg-ink hover:bg-ink/90 text-white font-bold rounded-full py-4 transition-all shadow-md mt-2">
                Siguiente
              </button>
            </div>
          </div>
        )}

        {/* ════════ PASO 2 — Resumen y Pago ════════ */}
        {step === 2 && (
          <div className="flex flex-col gap-6">

            {/* Productos */}
            <div className="bg-white rounded-3xl border border-dust p-6 sm:p-8 shadow-card">
              <h2 className="font-display font-bold text-xl text-ink mb-6">Resumen del Pedido</h2>
              <div className="flex flex-col gap-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 pb-4 border-b border-dust/50 last:border-0 last:pb-0">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-sand flex-shrink-0 border border-dust/30">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-body font-semibold text-sm text-ink line-clamp-2">{item.name}</p>
                      <p className="font-body text-xs text-mist mt-0.5">Cantidad: {item.qty}</p>
                    </div>
                    <p className="font-body font-bold text-sm text-ink flex-shrink-0">
                      ${(item.price * item.qty).toLocaleString("es-CL")}
                    </p>
                  </div>
                ))}
              </div>

              {/* Desglose de costos */}
              <div className="border-t border-dust pt-4 flex flex-col gap-2.5">
                <div className="flex justify-between items-center">
                  <span className="font-body text-mist text-sm">Subtotal</span>
                  <span className="font-body font-semibold text-sm text-ink">
                    ${total.toLocaleString("es-CL")}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-body text-mist text-sm">
                    Envio{shippingRate ? ` (${shippingRate.zone})` : ""}
                  </span>
                  {isFree
                    ? <span className="font-body font-semibold text-sm text-teal-dark">GRATIS</span>
                    : <span className="font-body font-semibold text-sm text-ink">
                        ${shippingCost.toLocaleString("es-CL")}
                      </span>
                  }
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-dust mt-1">
                  <span className="font-body font-bold text-base text-ink">Total a pagar</span>
                  <span className="font-display font-black text-2xl text-ink">
                    ${grandTotal.toLocaleString("es-CL")}
                  </span>
                </div>
              </div>
            </div>

            {/* Info de envio */}
            <div className="bg-white rounded-3xl border border-dust p-6 sm:p-8 shadow-card">
              <h3 className="font-display font-bold text-lg text-ink mb-4">Informacion de Envio</h3>
              {shippingRate ? (
                <div className="flex flex-col gap-3">
                  <div>
                    <p className="font-body font-semibold text-sm text-ink">{shippingRate.region}</p>
                    <p className="font-body text-xs text-mist mt-0.5">Zona {shippingRate.zone}</p>
                  </div>
                  <p className="font-body text-sm text-ink">
                    Entrega estimada: <span className="font-semibold">{shippingRate.days}</span>
                  </p>
                  <div className={`rounded-xl px-4 py-3 flex items-center justify-between ${
                    isFree ? "bg-teal-pale border border-teal/30" : "bg-sand border border-dust"
                  }`}>
                    <span className="font-body text-sm font-semibold text-ink">
                      {isFree ? "Envio gratis aplicado" : "Costo de envio"}
                    </span>
                    <span className={`font-display font-black text-lg ${isFree ? "text-teal-dark" : "text-ink"}`}>
                      {isFree ? "GRATIS" : `$${shippingCost.toLocaleString("es-CL")}`}
                    </span>
                  </div>
                  <p className="font-body text-xs text-mist leading-relaxed">
                    El despacho se coordina una vez confirmado el pago.
                  </p>
                </div>
              ) : (
                <p className="font-body text-sm text-mist">No se pudo calcular el envio.</p>
              )}
            </div>

            {/* Datos del cliente */}
            <div className="bg-white rounded-3xl border border-dust p-6 sm:p-8 shadow-card">
              <h3 className="font-display font-bold text-lg text-ink mb-4">Datos del Cliente</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { label: "Nombre",    value: form.nombre },
                  { label: "RUT",       value: form.rut },
                  { label: "Direccion", value: form.direccion },
                  { label: "Region",    value: shippingRate?.region ?? form.region },
                  { label: "Comuna",    value: form.comuna },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="font-body text-xs text-mist uppercase tracking-wider">{label}</p>
                    <p className="font-body font-semibold text-sm text-ink mt-0.5">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Error al crear pedido */}
            {placeError && (
              <div className="bg-rose-blush border border-rose-berry/30 rounded-2xl px-5 py-4">
                <p className="font-body text-sm font-semibold text-rose-berry">{placeError}</p>
              </div>
            )}

            <button
              onClick={handlePayment}
              disabled={placing}
              id="pay-webpay"
              className="w-full bg-teal hover:bg-teal-dark disabled:opacity-60 text-white font-bold rounded-full py-4 transition-all shadow-teal text-base"
            >
              {placing
                ? "Registrando pedido..."
                : `Pagar $${grandTotal.toLocaleString("es-CL")} con Webpay`}
            </button>
          </div>
        )}

        {/* ════════ PASO 3 — Confirmacion ════════ */}
        {step === 3 && (
          <div className="flex flex-col items-center text-center gap-6 py-8">
            <div className="w-24 h-24 bg-teal-pale rounded-full flex items-center justify-center border-4 border-teal/30">
              <div className="w-8 h-8 rounded-full bg-teal" />
            </div>

            <div>
              <h1 className="font-display font-black text-3xl sm:text-4xl text-ink mb-2">
                Pedido recibido
              </h1>
              <p className="font-body text-mist text-sm">
                Gracias por tu compra, <strong className="text-ink">{form.nombre.split(" ")[0]}</strong>
              </p>
            </div>

            <div className="bg-white rounded-3xl border border-dust p-6 sm:p-8 shadow-card w-full max-w-sm">
              <p className="font-body text-xs text-mist uppercase tracking-wider mb-1">
                Numero de pedido
              </p>
              <p className="font-display font-black text-2xl text-ink mb-4">{orderId}</p>

              <div
                className="flex items-center justify-center rounded-xl px-4 py-2.5 mb-4 border"
                style={{ backgroundColor: "#fff8dc", borderColor: "#f5c842" }}
              >
                <span className="font-body font-semibold text-sm" style={{ color: "#a07a10" }}>
                  Pendiente de pago
                </span>
              </div>

              <p className="font-body text-xs text-mist leading-relaxed">
                Verificaremos tu pago con Webpay y actualizaremos el estado del pedido.
                Cualquier consulta, contactanos por Instagram.
              </p>
            </div>

            <div className="bg-white rounded-3xl border border-dust p-5 shadow-card w-full max-w-sm text-left">
              <p className="font-body text-xs text-mist uppercase tracking-wider mb-3">Resumen</p>
              <div className="flex flex-col gap-1.5 text-sm font-body">
                <div className="flex justify-between">
                  <span className="text-mist">Direccion</span>
                  <span className="text-ink font-semibold text-right max-w-[60%]">
                    {form.direccion}, {form.comuna}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-mist">Region</span>
                  <span className="text-ink font-semibold">{shippingRate?.region ?? form.region}</span>
                </div>
                <div className="flex justify-between border-t border-dust pt-2 mt-1">
                  <span className="text-ink font-bold">Total pagado</span>
                  <span className="text-ink font-bold">${grandTotal.toLocaleString("es-CL")}</span>
                </div>
              </div>
            </div>

            <button
              onClick={onBack}
              className="font-body font-semibold text-sm text-teal-dark hover:text-teal transition-colors mt-2"
            >
              Seguir comprando
            </button>
          </div>
        )}

      </div>
    </section>
  )
}
