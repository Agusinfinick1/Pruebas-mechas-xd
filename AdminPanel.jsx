// src/components/AdminPanel.jsx
// Panel de administración — Gestión de pedidos y cambio de estado (T-11)
//
// INTEGRACIÓN API (T-10 — F. Cruz):
//   Este componente es el punto de extensión para el panel de órdenes.
//   Las props onUpdateStatus y orders se pueden conectar directamente
//   al endpoint REST del backend cuando esté disponible (T-04).
//
// INTEGRACIÓN JWT (T-12 — C. Pérez):
//   Agregar header Authorization con el token en onUpdateStatus cuando
//   se reemplace con llamadas fetch() al backend.
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useMemo } from "react"
import { ORDER_STATUSES, STATUS_DISPLAY_ORDER, getNextStatuses } from "../data/orderStatuses"

// ── Helpers internos ─────────────────────────────────────────────────────────

function fmt(date) {
  return new Date(date).toLocaleDateString("es-CL", {
    day: "2-digit", month: "2-digit", year: "numeric",
  })
}
function fmtHour(date) {
  return new Date(date).toLocaleTimeString("es-CL", {
    hour: "2-digit", minute: "2-digit",
  })
}
function fmtCLP(n) {
  return `$${Number(n).toLocaleString("es-CL")}`
}

// ── Badge de estado ───────────────────────────────────────────────────────────
function StatusBadge({ statusKey, size = "sm" }) {
  const st = ORDER_STATUSES[statusKey]
  if (!st) return null
  const pad = size === "sm" ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-sm"
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-body font-semibold border ${pad}`}
      style={{ backgroundColor: st.colors.bg, color: st.colors.text, borderColor: st.colors.border }}
    >
      {st.short}
    </span>
  )
}

// ── Línea de tiempo de historial ─────────────────────────────────────────────
function StatusTimeline({ history }) {
  return (
    <div className="flex flex-col gap-0">
      {[...history].reverse().map((entry, i) => {
        const st = ORDER_STATUSES[entry.status]
        const isLast = i === history.length - 1
        return (
          <div key={i} className="flex gap-3">
            {/* Dot + line */}
            <div className="flex flex-col items-center flex-shrink-0 pt-1">
              <div
                className="w-2.5 h-2.5 rounded-full border-2 flex-shrink-0"
                style={{ backgroundColor: st?.colors.bg ?? "#eee", borderColor: st?.colors.border ?? "#ccc" }}
              />
              {!isLast && <div className="w-px flex-1 mt-1 mb-1" style={{ backgroundColor: "#ddd0d3" }} />}
            </div>
            {/* Content */}
            <div className={`pb-4 ${isLast ? "" : ""}`}>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-body font-semibold text-sm text-ink">
                  {st?.label ?? entry.status}
                </span>
                <span className="font-body text-xs text-mist">
                  {fmt(entry.timestamp)} · {fmtHour(entry.timestamp)}
                </span>
              </div>
              {entry.note && (
                <p className="font-body text-xs text-mist mt-0.5 italic">"{entry.note}"</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Panel de detalle de pedido ───────────────────────────────────────────────
function OrderDetail({ order, onClose, onRequestChange }) {
  const nextStatuses = getNextStatuses(order.status)

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel lateral */}
      <div className="relative ml-auto w-full max-w-lg bg-white h-full overflow-y-auto shadow-2xl animate-slide-bow">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-dust px-6 py-4 flex items-center justify-between">
          <div>
            <p className="font-body text-xs text-mist uppercase tracking-wider">Pedido</p>
            <h3 className="font-display font-bold text-lg text-ink">{order.id}</h3>
          </div>
          <button
            onClick={onClose}
            className="font-body text-sm font-semibold text-mist hover:text-ink px-3 py-1.5 rounded-full hover:bg-sand transition-all"
          >
            Cerrar
          </button>
        </div>

        <div className="px-6 py-6 flex flex-col gap-6">
          {/* Estado actual */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-body text-xs text-mist uppercase tracking-wider mb-1">Estado actual</p>
              <StatusBadge statusKey={order.status} size="md" />
            </div>
            <p className="font-body text-xs text-mist">{fmt(order.createdAt)}</p>
          </div>

          {/* Cliente */}
          <div className="bg-sand rounded-2xl p-4">
            <p className="font-body text-xs text-mist uppercase tracking-wider mb-3">Cliente</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { l: "Nombre",    v: order.customer.nombre },
                { l: "RUT",       v: order.customer.rut },
                { l: "Dirección", v: order.customer.direccion },
                { l: "Región",    v: order.shipping.region },
                { l: "Comuna",    v: order.customer.comuna },
              ].map(({ l, v }) => (
                <div key={l} className={l === "Dirección" ? "col-span-2" : ""}>
                  <p className="font-body text-[10px] text-mist uppercase tracking-wider">{l}</p>
                  <p className="font-body font-semibold text-xs text-ink mt-0.5">{v}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Productos */}
          <div>
            <p className="font-body text-xs text-mist uppercase tracking-wider mb-3">Productos</p>
            <div className="flex flex-col gap-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-sand flex-shrink-0 border border-dust/30">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body font-semibold text-xs text-ink line-clamp-2">{item.name}</p>
                    <p className="font-body text-xs text-mist">x{item.qty}</p>
                  </div>
                  <p className="font-body font-bold text-xs text-ink flex-shrink-0">
                    {fmtCLP(item.price * item.qty)}
                  </p>
                </div>
              ))}
            </div>

            {/* Totales */}
            <div className="border-t border-dust mt-4 pt-3 flex flex-col gap-1.5">
              <div className="flex justify-between text-xs font-body">
                <span className="text-mist">Subtotal</span>
                <span className="text-ink font-semibold">{fmtCLP(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-xs font-body">
                <span className="text-mist">Envío ({order.shipping.region})</span>
                {order.shipping.isFree
                  ? <span className="text-teal-dark font-semibold">GRATIS</span>
                  : <span className="text-ink font-semibold">{fmtCLP(order.shipping.cost)}</span>
                }
              </div>
              <div className="flex justify-between text-sm font-body mt-1 pt-1 border-t border-dust">
                <span className="text-ink font-bold">Total</span>
                <span className="text-ink font-bold">{fmtCLP(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Cambiar estado */}
          {nextStatuses.length > 0 && (
            <div>
              <p className="font-body text-xs text-mist uppercase tracking-wider mb-3">Cambiar estado a</p>
              <div className="flex flex-col gap-2">
                {nextStatuses.map((st) => (
                  <button
                    key={st.key}
                    onClick={() => onRequestChange(order.id, st.key)}
                    className="flex items-center justify-between gap-3 p-3 rounded-xl border-2 transition-all hover:shadow-sm text-left"
                    style={{
                      borderColor: st.colors.border,
                      backgroundColor: st.colors.bg + "60",
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <div>
                        <p className="font-body font-bold text-sm" style={{ color: st.colors.text }}>
                          {st.label}
                        </p>
                        <p className="font-body text-xs text-mist">{st.description}</p>
                      </div>
                    </div>
                    <span className="text-mist text-xs font-bold flex-shrink-0">→</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {nextStatuses.length === 0 && (
            <div className="bg-sand rounded-xl p-3 text-center">
              <p className="font-body text-xs text-mist">Estado final — no hay más transiciones disponibles</p>
            </div>
          )}

          {/* Historial */}
          <div>
            <p className="font-body text-xs text-mist uppercase tracking-wider mb-3">Historial de estados</p>
            <StatusTimeline history={order.statusHistory} />
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Modal de confirmación de cambio de estado ─────────────────────────────────
function ConfirmModal({ change, orders, onConfirm, onCancel }) {
  const [note, setNote] = useState("")
  const order  = orders.find((o) => o.id === change.orderId)
  const fromSt = ORDER_STATUSES[order?.status]
  const toSt   = ORDER_STATUSES[change.newStatus]

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-3xl border border-dust shadow-lift p-6 sm:p-8 w-full max-w-md animate-scale-in">
        <h3 className="font-display font-bold text-lg text-ink mb-1">Confirmar cambio de estado</h3>
        <p className="font-body text-sm text-mist mb-5">Pedido {change.orderId}</p>

        {/* Transición visual */}
        <div className="flex items-center gap-3 mb-5">
          <StatusBadge statusKey={order?.status} size="md" />
          <span className="text-mist font-bold text-lg">→</span>
          <StatusBadge statusKey={change.newStatus} size="md" />
        </div>

        {/* Nota opcional */}
        <div className="mb-5">
          <label className="font-body text-sm font-semibold text-ink mb-1.5 block">
            Nota interna <span className="text-mist font-normal">(opcional)</span>
          </label>
          <input
            type="text"
            placeholder="ej: Starken guía #12345"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onConfirm(note)}
            className="w-full bg-white border border-dust rounded-xl px-4 py-3 text-sm font-body text-ink outline-none focus:border-teal focus:ring-2 focus:ring-teal/20 transition-all placeholder:text-mist"
          />
        </div>

        {/* Botones */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 border border-dust rounded-full py-3 font-body font-semibold text-sm text-mist hover:text-ink hover:border-ink transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={() => onConfirm(note)}
            className="flex-1 rounded-full py-3 font-body font-bold text-sm text-white transition-all"
            style={{ backgroundColor: toSt?.colors.border ?? "#5DBFB0" }}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Componente principal AdminPanel ───────────────────────────────────────────
export default function AdminPanel({ orders, onUpdateStatus, onLogout }) {
  const [search,       setSearch]       = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedId,   setSelectedId]   = useState(null)
  const [confirmChange,setConfirmChange]= useState(null) // { orderId, newStatus }

  // Calcular stats automáticamente desde los pedidos
  const stats = useMemo(() => {
    const counts = {}
    STATUS_DISPLAY_ORDER.forEach((k) => { counts[k] = 0 })
    orders.forEach((o) => { if (counts[o.status] !== undefined) counts[o.status]++ })
    return counts
  }, [orders])

  // Pedidos filtrados
  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchStatus = filterStatus === "all" || o.status === filterStatus
      const q = search.toLowerCase()
      const matchSearch =
        !q ||
        o.id.toLowerCase().includes(q) ||
        o.customer.nombre.toLowerCase().includes(q) ||
        o.customer.comuna.toLowerCase().includes(q)
      return matchStatus && matchSearch
    })
  }, [orders, search, filterStatus])

  // El pedido seleccionado siempre refleja el estado más reciente del array
  const selectedOrder = selectedId ? orders.find((o) => o.id === selectedId) ?? null : null

  // Solicitar cambio de estado (abre modal de confirmación)
  const handleRequestChange = (orderId, newStatus) => {
    setConfirmChange({ orderId, newStatus })
  }

  // Confirmar cambio de estado
  const handleConfirmChange = (note) => {
    onUpdateStatus(confirmChange.orderId, confirmChange.newStatus, note)
    setConfirmChange(null)
  }

  return (
    <div className="min-h-screen bg-sand font-body">

      {/* ── Cabecera del panel ─────────────────────────────────────────────── */}
      <div className="bg-ink text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img src="/image_11cb63.png" alt="Mechitas Mechonas" className="h-8 w-auto object-contain opacity-90" />
            <div className="h-6 w-px bg-white/20" />
            <div>
              <h1 className="font-display font-bold text-base text-white leading-tight">
                Panel de Administración
              </h1>
              <p className="font-body text-[11px] text-white/50 uppercase tracking-widest">Gestión de pedidos</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="font-body text-sm font-semibold text-white/60 hover:text-white px-4 py-2 rounded-full hover:bg-white/10 transition-all"
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8">

        {/* ── Stats row ───────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-8">
          {/* Total */}
          <button
            onClick={() => setFilterStatus("all")}
            className={`col-span-2 sm:col-span-1 rounded-2xl border p-3 text-left transition-all ${
              filterStatus === "all"
                ? "bg-ink text-white border-ink shadow-card"
                : "bg-white border-dust hover:border-ink/30"
            }`}
          >
            <p className={`font-body text-[10px] uppercase tracking-wider mb-1 ${filterStatus === "all" ? "text-white/60" : "text-mist"}`}>
              Total
            </p>
            <p className={`font-display font-black text-xl ${filterStatus === "all" ? "text-white" : "text-ink"}`}>
              {orders.length}
            </p>
          </button>

          {/* Por estado */}
          {STATUS_DISPLAY_ORDER.map((key) => {
            const st = ORDER_STATUSES[key]
            const count = stats[key] ?? 0
            const active = filterStatus === key
            return (
              <button
                key={key}
                onClick={() => setFilterStatus(active ? "all" : key)}
                className="rounded-2xl border p-3 text-left transition-all hover:shadow-sm"
                style={
                  active
                    ? { backgroundColor: st.colors.bg, borderColor: st.colors.border }
                    : { backgroundColor: "white", borderColor: "#ddd0d3" }
                }
              >
                <p
                  className="font-body text-[10px] uppercase tracking-wider mb-1"
                  style={{ color: active ? st.colors.text : "#557570" }}
                >
                  {st.short}
                </p>
                <p
                  className="font-display font-black text-xl"
                  style={{ color: active ? st.colors.text : "#1a2e2b" }}
                >
                  {count}
                </p>
                <p
                  className="font-body text-[10px] truncate"
                  style={{ color: active ? st.colors.text : "#557570" }}
                >
                  {count}
                </p>
              </button>
            )
          })}
        </div>

        {/* ── Barra de búsqueda ────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Buscar por N° de pedido, nombre o comuna…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-dust rounded-2xl px-4 py-3 text-sm font-body text-ink outline-none focus:border-teal focus:ring-2 focus:ring-teal/20 transition-all placeholder:text-mist"
            />
          </div>
          {(search || filterStatus !== "all") && (
            <button
              onClick={() => { setSearch(""); setFilterStatus("all") }}
              className="font-body text-sm font-semibold text-mist hover:text-ink px-4 py-2 rounded-2xl border border-dust hover:border-ink/30 bg-white transition-all flex-shrink-0"
            >
              Limpiar filtros
            </button>
          )}
        </div>

        {/* ── Lista de pedidos ─────────────────────────────────────────────── */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dust p-16 text-center">
            <p className="font-display font-bold text-xl text-ink mb-2">Sin resultados</p>
            <p className="font-body text-sm text-mist">
              No hay pedidos que coincidan con los filtros aplicados.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((order) => {
              const st = ORDER_STATUSES[order.status]
              const nextSts = getNextStatuses(order.status)
              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-dust shadow-card hover:shadow-md transition-all overflow-hidden"
                >
                  {/* Borde izquierdo de color del estado */}
                  <div className="flex">
                    <div
                      className="w-1 flex-shrink-0 rounded-l-2xl"
                      style={{ backgroundColor: st?.colors.border ?? "#ddd" }}
                    />

                    <div className="flex-1 p-4 sm:p-5">
                      {/* Fila principal */}
                      <div className="flex flex-wrap items-start gap-3 justify-between">
                        <div className="flex flex-col gap-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-display font-bold text-sm text-ink">{order.id}</span>
                            <StatusBadge statusKey={order.status} />
                          </div>
                          <p className="font-body font-semibold text-sm text-ink truncate">
                            {order.customer.nombre}
                          </p>
                          <p className="font-body text-xs text-mist">
                            {order.customer.region} · {order.customer.comuna} · {fmt(order.createdAt)}
                          </p>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <p className="font-display font-black text-xl text-ink">{fmtCLP(order.total)}</p>
                          <p className="font-body text-xs text-mist">
                            {order.items.reduce((s, i) => s + i.qty, 0)} producto
                            {order.items.reduce((s, i) => s + i.qty, 0) !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>

                      {/* Botones de acción */}
                      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-dust/60">
                        <button
                          onClick={() => setSelectedId(order.id)}
                          className="font-body font-semibold text-xs text-mist hover:text-ink px-3 py-1.5 rounded-full border border-dust hover:border-ink/30 transition-all"
                        >
                          Ver detalle
                        </button>

                        {/* Botones de cambio de estado rápido */}
                        {nextSts.map((nst) => (
                          <button
                            key={nst.key}
                            onClick={() => handleRequestChange(order.id, nst.key)}
                            className="font-body font-semibold text-xs px-3 py-1.5 rounded-full border-2 transition-all hover:shadow-sm"
                            style={{
                              borderColor: nst.colors.border,
                              color: nst.colors.text,
                              backgroundColor: nst.colors.bg,
                            }}
                          >
                            {nst.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Contador de resultados */}
        <p className="font-body text-xs text-mist text-center mt-6">
          Mostrando {filtered.length} de {orders.length} pedidos
        </p>
      </div>

      {/* ── Panel de detalle ───────────────────────────────────────────────── */}
      {selectedOrder && (
        <OrderDetail
          order={selectedOrder}
          onClose={() => setSelectedId(null)}
          onRequestChange={(orderId, newStatus) => {
            setSelectedId(null) // Cerrar detalle al confirmar
            handleRequestChange(orderId, newStatus)
          }}
        />
      )}

      {/* ── Modal de confirmación ──────────────────────────────────────────── */}
      {confirmChange && (
        <ConfirmModal
          change={confirmChange}
          orders={orders}
          onConfirm={handleConfirmChange}
          onCancel={() => setConfirmChange(null)}
        />
      )}
    </div>
  )
}
