import { useState } from "react"
import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import ProductCatalog from "./components/ProductCatalog"
import Footer from "./components/Footer"
import CartOffcanvas from "./components/CartOffcanvas"
import Checkout from "./components/Checkout"
import { PRODUCTS } from "./data/products"

export default function App() {
  // View state: "shop" or "checkout"
  const [view, setView] = useState("shop")

  // Cart state
  const [cart, setCart] = useState([])
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Search & filter state
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  // Cart operations
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
    if (newQty <= 0) {
      removeFromCart(id)
      return
    }
    setCart((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty: newQty } : i))
    )
  }

  const cartCount = cart.reduce((s, i) => s + i.qty, 0)
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0)

  // Navigation
  const handleNavigate = (target) => {
    setView(target)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleCheckout = () => {
    setDrawerOpen(false)
    setView("checkout")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

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
        />
      )}

      <Footer />

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
