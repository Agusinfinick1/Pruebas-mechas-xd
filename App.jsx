import { useState } from "react"
import Navbar       from "./components/Navbar"
import Hero         from "./components/Hero"
import ProductCatalog from "./components/ProductCatalog"
import Footer       from "./components/Footer"
import CartOffcanvas from "./components/CartOffcanvas"
import Checkout     from "./components/Checkout"
import AdminLogin   from "./components/AdminLogin"
import AdminPanel   from "./components/AdminPanel"
import { PRODUCTS } from "./data/products"
import { MOCK_ORDERS } from "./data/orders"

// TODO (T-12 — C. Pérez): Reemplazar con verificación JWT real
const ADMIN_PASSWORD = "mechitas2026"

export default function App() {
  // ── Navegación ───────────────────────────────────────────────────────────
  const [view, setView] = useState("shop") // "shop" | "checkout" | "admin"

  // ── Carrito ──────────────────────────────────────────────────────────────
  const [cart,       setCart]       = useState([])
  const [drawerOpen, setDrawerOpen] = useState(false)

  // ── Búsqueda y filtros de catálogo ───────────────────────────────────────
  const [searchQuery,       setSearchQuery]       = useState("")
  const [selectedCategory,  setSelectedCategory]  = useState("all")

  // ── Admin — auth y pedidos ───────────────────────────────────────────────
  // TODO (T-04 / C. Pérez): orders debería venir del backend via useEffect + fetch
  const [orders,      setOrders]      = useState(MOCK_ORDERS)
  const [isAdminAuth, setIsAdminAuth] = useState(false)

  // ── Operaciones de carrito ───────────────────────────────────────────────
  const addToCart = (product) => {
    setCart((prev) => {
      const ex = prev.find((i) => i.id === product.id)
      if (ex)
        return prev.map((i) =>
          i.id === product.id ? { ...i, qty: i.qty + 1 } : i
        )
      return [...prev, { ...product, qty: 1 }]
    })
    setDrawerOpen(true)
  }

  const removeFromCart = (id) => setCart((prev) => prev.filter((i) => i.id !== id))

  const updateQty = (id, newQty) => {
    if (newQty <= 0) { removeFromCart(id); return }
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, qty: newQty } : i)))
  }

  const cartCount = cart.reduce((s, i) => s + i.qty, 0)
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0)

  // ── Navegación ───────────────────────────────────────────────────────────
  const handleNavigate = (target) => {
    setView(target)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleCheckout = () => {
    setDrawerOpen(false)
    setView("checkout")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // ── Operaciones de pedidos ───────────────────────────────────────────────
  /**
   * Crea un pedido nuevo a partir de los datos del checkout.
   * Retorna el ID del pedido creado.
   * TODO (T-04 / C. Pérez): Reemplazar con POST /api/orders al backend.
   */
  const handlePlaceOrder = (orderData) => {
    const newId = `ORD-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`
    const newOrder = {
      id: newId,
      createdAt: new Date(),
      ...orderData,
      status: "pending_payment",
      statusHistory: [
        {
          status:    "pending_payment",
          timestamp: new Date(),
          note:      "Pedido recibido vía web",
        },
      ],
    }
    setOrders((prev) => [newOrder, ...prev])
    setCart([]) // limpiar carrito después de confirmar pedido
    return newId
  }

  /**
   * Cambia el estado de un pedido y registra el cambio en su historial.
   * TODO (T-04 / C. Pérez): Reemplazar con PATCH /api/orders/:id/status al backend.
   */
  const handleUpdateStatus = (orderId, newStatus, note = "") => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order
        return {
          ...order,
          status: newStatus,
          statusHistory: [
            ...order.statusHistory,
            { status: newStatus, timestamp: new Date(), note },
          ],
        }
      })
    )
  }

  // ── Admin — login ────────────────────────────────────────────────────────
  /**
   * Verifica credenciales de administrador.
   * TODO (T-12 / C. Pérez): Reemplazar con llamada real a POST /api/auth/login
   * que retorne un JWT. Guardar token en React state (NO localStorage).
   */
  const handleAdminLogin = (password) => {
    if (password === ADMIN_PASSWORD) {
      setIsAdminAuth(true)
      return true
    }
    return false
  }

  const handleAdminLogout = () => {
    setIsAdminAuth(false)
    handleNavigate("shop")
  }

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-sand font-body overflow-x-hidden">
      <Navbar
        cartCount={cartCount}
        onCartClick={() => setDrawerOpen(true)}
        onNavigate={handleNavigate}
        currentView={view}
      />

      {/* Vista: Tienda */}
      {view === "shop" && (
        <>
          <Hero onNavigate={handleNavigate} />
          <ProductCatalog
            products={PRODUCTS}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            onAddToCart={addToCart}
          />
        </>
      )}

      {/* Vista: Checkout */}
      {view === "checkout" && (
        <Checkout
          items={cart}
          total={cartTotal}
          onBack={() => handleNavigate("shop")}
          onPlaceOrder={handlePlaceOrder}
        />
      )}

      {/* Vista: Admin — Login */}
      {view === "admin" && !isAdminAuth && (
        <AdminLogin
          onLogin={handleAdminLogin}
          onBack={() => handleNavigate("shop")}
        />
      )}

      {/* Vista: Admin — Panel */}
      {view === "admin" && isAdminAuth && (
        <AdminPanel
          orders={orders}
          onUpdateStatus={handleUpdateStatus}
          onLogout={handleAdminLogout}
        />
      )}

      {/* Footer: oculto en el panel admin para no generar scroll innecesario */}
      {view !== "admin" && <Footer />}

      {/* Carrito offcanvas — siempre disponible */}
      <CartOffcanvas
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        items={cart}
        onRemove={removeFromCart}
        onUpdateQty={updateQty}
        total={cartTotal}
        onCheckout={handleCheckout}
      />
    </div>
  )
}
