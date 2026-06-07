import ProductCard from "./ProductCard"

export default function ProductCatalog({
  products,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  onAddToCart,
}) {
  const categories = [
    { key: "all", label: "Todos" },
    { key: "pelo", label: "Niñas / Mujeres" },
    { key: "pet", label: "Mascotas" },
  ]

  // Filter products
  const filtered = products.filter((p) => {
    const matchCat =
      selectedCategory === "all" || p.category === selectedCategory
    const matchSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <section id="catalogo" className="bg-sand py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        {/* Section header */}
        <div className="flex flex-col gap-2 mb-8">
          <p className="font-body text-xs font-bold uppercase tracking-[.15em] text-teal-dark">
            Nuestra colección
          </p>
          <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-ink leading-tight">
            Catálogo de Productos
          </h2>
          <p className="font-body text-mist text-sm max-w-lg">
            Explora nuestra selección de accesorios artesanales para el cabello y
            mascotas. Filtra por categoría o busca directamente.
          </p>
        </div>

        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          {/* Category filter — text buttons */}
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`font-body font-semibold text-[13px] rounded-full px-5 py-2.5 border transition-all duration-200 ${
                  selectedCategory === cat.key
                    ? "bg-ink text-white border-ink"
                    : "bg-white text-ink/70 border-dust hover:border-ink hover:text-ink"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="flex-1 sm:max-w-sm">
            <input
              type="text"
              id="search-input"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-dust rounded-full px-5 py-2.5 text-sm font-body text-ink outline-none focus:border-teal focus:ring-2 focus:ring-teal/20 transition-all placeholder:text-mist"
            />
          </div>
        </div>

        {/* Product grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {filtered.map((product, i) => (
              <div
                key={product.id}
                className="animate-fade-up"
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <ProductCard product={product} onAddToCart={onAddToCart} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="font-display font-bold text-xl text-ink mb-2">
              Sin resultados
            </p>
            <p className="font-body text-mist text-sm">
              No encontramos productos que coincidan con tu búsqueda. Intenta
              con otro término o categoría.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
