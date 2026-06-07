import { useState } from "react"
import { SHIPPING_RATES, getShipping } from "../data/shipping"

export default function Checkout({ items, total, onBack }) {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    nombre: "",
    rut: "",
    direccion: "",
    region: "",
    comuna: "",
  })
  const [errors, setErrors] = useState({})

  // ─── Cálculo de envío reactivo ────────────────────────────────────────────
  const { cost: shippingCost, isFree, rate: shippingRate } = getShipping(
    form.region,
    total
  )
  const grandTotal = total + shippingCost

  // ─── Handlers ────────────────────────────────────────────────────────────
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }))
  }

  const validateStep1 = () => {
    const newErrors = {}
    if (!form.nombre.trim()) newErrors.nombre = "El nombre es obligatorio"
    if (!form.rut.trim()) newErrors.rut = "El RUT es obligatorio"
    if (!form.direccion.trim()) newErrors.direccion = "La dirección es obligatoria"
    if (!form.region) newErrors.region = "Selecciona tu región"
    if (!form.comuna.trim()) newErrors.comuna = "La comuna es obligatoria"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handlePayment = () => {
    alert("Redirigiendo a Webpay para completar el pago. (Integración pendiente)")
  }

  // ─── Clases compartidas ──────────────────────────────────────────────────
  const inputClasses = (field) =>
    `w-full bg-white border ${
      errors[field] ? "border-rose-berry" : "border-dust"
    } rounded-xl px-4 py-3 text-sm font-body text-ink outline-none focus:border-teal focus:ring-2 focus:ring-teal/20 transition-all placeholder:text-mist`

  return (
    <section className="bg-sand min-h-screen py-10 sm:py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">

        {/* ── Header ── */}
        <div className="mb-8">
          <button
            onClick={() => (step === 2 ? setStep(1) : onBack())}
            className="font-body font-semibold text-sm text-teal-dark hover:text-teal transition-colors mb-4 inline-block"
          >
            {step === 2 ? "← Volver al paso anterior" : "← Volver al catálogo"}
          </button>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-ink">
            Finalizar Compra
          </h1>

          {/* Step indicator */}
          <div className="flex items-center gap-4 mt-4">
            {[
              { n: 1, label: "Datos de Envío" },
              { n: 2, label: "Resumen y Pago" },
            ].map(({ n, label }, i) => (
              <div key={n} className="flex items-center gap-2">
                {i > 0 && <div className="w-8 h-px bg-dust" />}
                <div
                  className={`flex items-center gap-2 ${
                    step === n ? "text-ink" : "text-mist"
                  }`}
                >
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      step > n
                        ? "bg-teal text-white"
                        : step === n
                        ? "bg-ink text-white"
                        : "bg-dust text-mist"
                    }`}
                  >
                    {step > n ? "✓" : n}
                  </span>
                  <span className="font-body text-sm font-semibold">{label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════
            PASO 1 — Datos del cliente + región
        ════════════════════════════════════════════════════════════════ */}
        {step === 1 && (
          <div className="bg-white rounded-3xl border border-dust p-6 sm:p-8 shadow-card animate-fade-up">
            <h2 className="font-display font-bold text-xl text-ink mb-6">
              Datos del Cliente
            </h2>

            <div className="flex flex-col gap-5">

              {/* Nombre */}
              <div>
                <label htmlFor="checkout-nombre" className="font-body text-sm font-semibold text-ink mb-1.5 block">
                  Nombre completo
                </label>
                <input
                  id="checkout-nombre"
                  type="text"
                  placeholder="Ingresa tu nombre"
                  value={form.nombre}
                  onChange={(e) => handleChange("nombre", e.target.value)}
                  className={inputClasses("nombre")}
                />
                {errors.nombre && (
                  <p className="text-rose-berry text-xs mt-1 font-semibold">{errors.nombre}</p>
                )}
              </div>

              {/* RUT */}
              <div>
                <label htmlFor="checkout-rut" className="font-body text-sm font-semibold text-ink mb-1.5 block">
                  RUT
                </label>
                <input
                  id="checkout-rut"
                  type="text"
                  placeholder="12.345.678-9"
                  value={form.rut}
                  onChange={(e) => handleChange("rut", e.target.value)}
                  className={inputClasses("rut")}
                />
                {errors.rut && (
                  <p className="text-rose-berry text-xs mt-1 font-semibold">{errors.rut}</p>
                )}
              </div>

              {/* Dirección */}
              <div>
                <label htmlFor="checkout-direccion" className="font-body text-sm font-semibold text-ink mb-1.5 block">
                  Dirección
                </label>
                <input
                  id="checkout-direccion"
                  type="text"
                  placeholder="Calle, número, depto."
                  value={form.direccion}
                  onChange={(e) => handleChange("direccion", e.target.value)}
                  className={inputClasses("direccion")}
                />
                {errors.direccion && (
                  <p className="text-rose-berry text-xs mt-1 font-semibold">{errors.direccion}</p>
                )}
              </div>

              {/* Región — dropdown dinámico */}
              <div>
                <label htmlFor="checkout-region" className="font-body text-sm font-semibold text-ink mb-1.5 block">
                  Región
                </label>
                <select
                  id="checkout-region"
                  value={form.region}
                  onChange={(e) => handleChange("region", e.target.value)}
                  className={`${inputClasses("region")} cursor-pointer`}
                >
                  <option value="">Selecciona tu región</option>
                  {SHIPPING_RATES.map((r) => (
                    <option key={r.code} value={r.code}>
                      {r.region}
                    </option>
                  ))}
                </select>
                {errors.region && (
                  <p className="text-rose-berry text-xs mt-1 font-semibold">{errors.region}</p>
                )}

                {/* Preview del costo de envío al seleccionar región */}
                {form.region && shippingRate && (
                  <div
                    className={`mt-2 rounded-xl px-4 py-3 text-sm font-body flex items-center justify-between gap-2 animate-fade-in ${
                      isFree
                        ? "bg-teal-pale border border-teal/30 text-teal-deep"
                        : "bg-sand border border-dust text-mist"
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <span>{isFree ? "🎉" : "🚚"}</span>
                      <span>
                        {isFree
                          ? "¡Envío gratis para esta región!"
                          : `Envío estimado: $${shippingCost.toLocaleString("es-CL")}`}
                      </span>
                    </span>
                    <span className="text-xs font-semibold opacity-70">{shippingRate.days}</span>
                  </div>
                )}

                {/* Info: umbral de envío gratis */}
                {form.region && shippingRate && !isFree && shippingRate.freeAbove && (
                  <p className="text-xs text-mist mt-1.5 font-body">
                    💡 Envío gratis al comprar $
                    {shippingRate.freeAbove.toLocaleString("es-CL")} o más en esta región.
                  </p>
                )}
              </div>

              {/* Comuna */}
              <div>
                <label htmlFor="checkout-comuna" className="font-body text-sm font-semibold text-ink mb-1.5 block">
                  Ciudad / Comuna
                </label>
                <input
                  id="checkout-comuna"
                  type="text"
                  placeholder="Ingresa tu comuna"
                  value={form.comuna}
                  onChange={(e) => handleChange("comuna", e.target.value)}
                  className={inputClasses("comuna")}
                />
                {errors.comuna && (
                  <p className="text-rose-berry text-xs mt-1 font-semibold">{errors.comuna}</p>
                )}
              </div>

              {/* Next button */}
              <button
                onClick={handleNext}
                id="checkout-next"
                className="w-full bg-ink hover:bg-ink/90 text-white font-bold rounded-full py-4 transition-all shadow-md mt-2"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════
            PASO 2 — Resumen y Pago
        ════════════════════════════════════════════════════════════════ */}
        {step === 2 && (
          <div className="flex flex-col gap-6 animate-fade-up">

            {/* Resumen del pedido */}
            <div className="bg-white rounded-3xl border border-dust p-6 sm:p-8 shadow-card">
              <h2 className="font-display font-bold text-xl text-ink mb-6">
                Resumen del Pedido
              </h2>

              {/* Items */}
              <div className="flex flex-col gap-4 mb-6">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 pb-4 border-b border-dust/50 last:border-0 last:pb-0"
                  >
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-sand flex-shrink-0 border border-dust/30">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-body font-semibold text-sm text-ink line-clamp-2">
                        {item.name}
                      </p>
                      <p className="font-body text-xs text-mist mt-0.5">
                        Cantidad: {item.qty}
                      </p>
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
                    Envío{" "}
                    <span className="text-xs font-normal">
                      ({shippingRate?.zone ?? "—"})
                    </span>
                  </span>
                  {isFree ? (
                    <span className="font-body font-semibold text-sm text-teal-dark">
                      ¡GRATIS!
                    </span>
                  ) : (
                    <span className="font-body font-semibold text-sm text-ink">
                      ${shippingCost.toLocaleString("es-CL")}
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-dust mt-1">
                  <span className="font-body font-bold text-base text-ink">Total a pagar</span>
                  <span className="font-display font-black text-2xl text-ink">
                    ${grandTotal.toLocaleString("es-CL")}
                  </span>
                </div>
              </div>
            </div>

            {/* Información de envío */}
            <div className="bg-white rounded-3xl border border-dust p-6 sm:p-8 shadow-card">
              <h3 className="font-display font-bold text-lg text-ink mb-4">
                Información de Envío
              </h3>
              {shippingRate ? (
                <div className="flex flex-col gap-3">
                  {/* Región y zona */}
                  <div className="flex items-start gap-3">
                    <span className="text-xl mt-0.5">📍</span>
                    <div>
                      <p className="font-body font-semibold text-sm text-ink">
                        {shippingRate.region}
                      </p>
                      <p className="font-body text-xs text-mist mt-0.5">
                        Zona {shippingRate.zone}
                      </p>
                    </div>
                  </div>

                  {/* Tiempo estimado */}
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🚚</span>
                    <div>
                      <p className="font-body text-sm text-ink">
                        Entrega estimada:{" "}
                        <span className="font-semibold">{shippingRate.days}</span>
                      </p>
                    </div>
                  </div>

                  {/* Costo */}
                  <div
                    className={`mt-1 rounded-xl px-4 py-3 flex items-center justify-between ${
                      isFree
                        ? "bg-teal-pale border border-teal/30"
                        : "bg-lace border border-dust"
                    }`}
                  >
                    <span className="font-body text-sm font-semibold text-ink">
                      {isFree ? "🎉 ¡Envío gratis aplicado!" : "Costo de envío"}
                    </span>
                    <span
                      className={`font-display font-black text-lg ${
                        isFree ? "text-teal-dark" : "text-ink"
                      }`}
                    >
                      {isFree ? "GRATIS" : `$${shippingCost.toLocaleString("es-CL")}`}
                    </span>
                  </div>

                  <p className="font-body text-xs text-mist leading-relaxed mt-1">
                    Los detalles del despacho serán coordinados una vez confirmada tu compra.
                  </p>
                </div>
              ) : (
                <p className="font-body text-sm text-mist leading-relaxed">
                  No se pudo calcular el envío. Por favor vuelve y selecciona tu región.
                </p>
              )}
            </div>

            {/* Datos del cliente — resumen */}
            <div className="bg-white rounded-3xl border border-dust p-6 sm:p-8 shadow-card">
              <h3 className="font-display font-bold text-lg text-ink mb-4">
                Datos del Cliente
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { label: "Nombre", value: form.nombre },
                  { label: "RUT", value: form.rut },
                  { label: "Dirección", value: form.direccion },
                  { label: "Región", value: shippingRate?.region ?? form.region },
                  { label: "Comuna", value: form.comuna },
                ].map((field) => (
                  <div key={field.label}>
                    <p className="font-body text-xs text-mist uppercase tracking-wider">
                      {field.label}
                    </p>
                    <p className="font-body font-semibold text-sm text-ink mt-0.5">
                      {field.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Botón de pago */}
            <button
              onClick={handlePayment}
              id="pay-webpay"
              className="w-full bg-teal hover:bg-teal-dark text-white font-bold rounded-full py-4 transition-all shadow-teal text-base"
            >
              Pagar ${grandTotal.toLocaleString("es-CL")} con Webpay
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
