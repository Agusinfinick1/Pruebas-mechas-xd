// src/App.jsx
import { useState } from "react"
import Navbar         from "./components/Navbar"
import Hero           from "./components/Hero"
import ProductCatalog from "./components/ProductCatalog"
import Footer         from "./components/Footer"
import CartOffcanvas  from "./components/CartOffcanvas"
import Checkout       from "./components/Checkout"
import AdminLogin     from "./components/AdminLogin"
import AdminPanel     from "./components/AdminPanel"
import { PRODUCTS }   from "./data/products"
import { supabase }   from "./lib/supabase"

// INTEGRACION T-12 (C. Perez): reemplazar con verificacion JWT real
const ADMIN_PASSWORD = "mechitas2026"

export default function App() {
  // ── Navegacion ───────────────────────────────────────────────────────────
  const [view, setView] = useState("shop") // "shop" | "checkout" | "admin"

  // ── Carrito ───────────────────────────────────────────────────────────────
  const [cart,       setCart]       = useState([])
  const [drawerOpen, setDrawerOpen] = useState(false)

  // ── Catalogo ──────────────────────────────────────────────────────────────
  const [searchQuery,      setSearchQuery]      = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  // ── Admin auth (sin persistencia — solo sesion activa) ────────────────────
  const [isAdminAuth, setIsAdminAuth] = useState(false)

  // ── Operaciones de carrito ────────────────────────────────────────────────
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

  const removeFromCart = (id) =>
    setCart((prev) => prev.filter((i) => i.id !== id))

  const updateQty = (id, newQty) => {
    if (newQty <= 0) { removeFromCart(id); return }
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, qty: newQty } : i)))
  }

  const cartCount = cart.reduce((s, i) => s + i.qty, 0)
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0)

  // ── Navegacion ────────────────────────────────────────────────────────────
  const handleNavigate = (target) => {
    setView(target)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleCheckout = () => {
    setDrawerOpen(false)
    setView("checkout")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // ── Crear pedido en Supabase ──────────────────────────────────────────────
  // Retorna el ID del pedido creado, o null si hubo error.
  // INTEGRACION T-08 (A. Zuniga): cuando Webpay este listo, confirmar el pago
  // antes de insertar el pedido, y guardar el token de transaccion en el registro.
  const handlePlaceOrder = async (orderData) => {
    const newId = `ORD-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`
    const newOrder = {
      id: newId,
      created_at: new Date().toISOString(),
      customer:       orderData.customer,
      items:          orderData.items,
      subtotal:       orderData.subtotal,
      shipping:       orderData.shipping,
      total:          orderData.total,
      status:         "pending_payment",
      status_history: [
        {
          status:    "pending_payment",
          timestamp: new Date().toISOString(),
          note:      "Pedido recibido via web",
        },
      ],
    }

    const { error } = await supabase.from("orders").insert([newOrder])

    if (error) {
      console.error("[App] Error al crear pedido en Supabase:", error)
      return null
    }

    setCart([]) // limpiar carrito
    return newId
  }

  // ── Admin login ───────────────────────────────────────────────────────────
  // INTEGRACION T-12 (C. Perez): reemplazar con llamada a POST /api/auth/login
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

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-sand font-body overflow-x-hidden">
      <Navbar
        cartCount={cartCount}
        onCartClick={() => setDrawerOpen(true)}
        onNavigate={handleNavigate}
        currentView={view}
      />

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

      {view === "checkout" && (
        <Checkout
          items={cart}
          total={cartTotal}
          onBack={() => handleNavigate("shop")}
          onPlaceOrder={handlePlaceOrder}
        />
      )}

      {view === "admin" && !isAdminAuth && (
        <AdminLogin
          onLogin={handleAdminLogin}
          onBack={() => handleNavigate("shop")}
        />
      )}

      {/* AdminPanel carga sus propios pedidos desde Supabase */}
      {view === "admin" && isAdminAuth && (
        <AdminPanel onLogout={handleAdminLogout} />
      )}

      {view !== "admin" && <Footer />}

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
