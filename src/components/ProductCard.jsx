import { useState } from "react"

export default function ProductCard({ product, onAddToCart }) {
  const [added, setAdded] = useState(false)
  const [imgErr, setImgErr] = useState(false)

  const handleAdd = () => {
    onAddToCart?.(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  const disc = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null

  const isPet = product.category === "pet"

  return (
    <article
      className={`group relative flex flex-col rounded-3xl overflow-hidden border transition-all duration-300 hover:-translate-y-2 ${
        isPet
          ? "bg-[#fffef7] border-[#f0dfa0] hover:shadow-gold"
          : "bg-white border-dust hover:shadow-rose"
      }`}
    >
      {/* Image area */}
      <div
        className={`relative aspect-square overflow-hidden ${
          isPet
            ? "bg-gradient-to-br from-gold-pale to-[#fff8dc]"
            : "bg-gradient-to-br from-teal-pale to-rose-blush"
        }`}
      >
        {!imgErr ? (
          <img
            src={product.image}
            alt={product.name}
            onError={() => setImgErr(true)}
            className="w-full h-full object-cover group-hover:scale-[1.07] transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-mist font-body text-sm font-semibold">
              Imagen no disponible
            </span>
          </div>
        )}

        {/* Badge — text only */}
        {product.tag && (
          <span
            className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide ${
              product.tag === "nuevo"
                ? "bg-teal text-white"
                : "bg-rose-berry text-white"
            }`}
          >
            {product.tag === "nuevo" ? "Nuevo" : disc ? `-${disc}%` : "Oferta"}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4 gap-2.5">
        {/* Name */}
        <h3 className="font-display font-bold text-[15px] text-ink leading-snug line-clamp-2">
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-auto">
          <span
            className={`font-body font-black text-lg ${
              isPet ? "text-teal-dark" : "text-rose-berry"
            }`}
          >
            ${product.price.toLocaleString("es-CL")}
          </span>
          {product.originalPrice && (
            <span className="font-body text-dust text-sm line-through">
              ${product.originalPrice.toLocaleString("es-CL")}
            </span>
          )}
        </div>

        {/* CTA — text only, "Agregar" */}
        <button
          onClick={handleAdd}
          id={`add-product-${product.id}`}
          className={`mt-1 w-full flex items-center justify-center rounded-full py-2.5 text-[13px] font-bold transition-all duration-200 active:scale-95 ${
            added
              ? "bg-teal text-white"
              : isPet
              ? "bg-gold-pale text-gold-deep hover:bg-gold hover:text-white border border-gold/40"
              : "bg-rose-blush text-rose-berry hover:bg-rose-petal border border-rose-petal"
          }`}
        >
          {added ? "Agregado" : "Agregar"}
        </button>
      </div>
    </article>
  )
}
