export default function CartOffcanvas({
  open,
  onClose,
  items,
  onRemove,
  onUpdateQty,
  total,
  onCheckout,
}) {
  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-50 bg-ink/60 backdrop-blur-sm transition-opacity duration-300 ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md z-50 bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-label="Carrito de compras"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-dust">
          <div className="flex items-center gap-3">
            <h2 className="font-display font-bold text-xl text-ink tracking-tight">
              Mi Carrito
            </h2>
            {items.length > 0 && (
              <span className="bg-ink text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {items.reduce((s, i) => s + i.qty, 0)}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-sm font-semibold text-mist hover:text-ink px-3 py-1.5 rounded-full hover:bg-sand transition-all"
          >
            Cerrar
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center py-16">
              <div className="w-20 h-20 bg-sand rounded-full flex items-center justify-center mb-2">
                <span className="text-ink/30 font-display font-bold text-2xl">0</span>
              </div>
              <p className="font-display font-bold text-ink text-xl">
                Tu carrito está vacío
              </p>
              <p className="text-mist text-sm">
                Explora nuestra colección y añade productos a tu carrito.
              </p>
              <button
                onClick={onClose}
                className="mt-4 bg-ink text-white rounded-full px-8 py-3 font-bold text-sm hover:bg-ink/90 transition-colors"
              >
                Ver catálogo
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 bg-white border border-dust/50 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-sand flex-shrink-0 border border-dust/30">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body font-semibold text-sm text-ink line-clamp-2 leading-snug">
                    {item.name}
                  </p>
                  <p className="font-body font-bold text-base text-ink mt-1">
                    ${(item.price * item.qty).toLocaleString("es-CL")}
                  </p>

                  {/* Qty controls */}
                  <div className="flex items-center gap-2 mt-1.5">
                    <button
                      onClick={() => onUpdateQty(item.id, item.qty - 1)}
                      className="w-7 h-7 rounded-full border border-dust text-ink/60 hover:border-ink hover:text-ink text-sm font-bold flex items-center justify-center transition-all"
                      aria-label="Disminuir cantidad"
                    >
                      -
                    </button>
                    <span className="font-body font-bold text-sm text-ink min-w-[20px] text-center">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => onUpdateQty(item.id, item.qty + 1)}
                      className="w-7 h-7 rounded-full border border-dust text-ink/60 hover:border-ink hover:text-ink text-sm font-bold flex items-center justify-center transition-all"
                      aria-label="Aumentar cantidad"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => onRemove(item.id)}
                  className="text-[12px] font-semibold text-mist hover:text-rose-berry px-2 py-1 rounded hover:bg-rose-blush transition-all flex-shrink-0"
                >
                  Eliminar
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-6 border-t border-dust bg-sand/30 flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <span className="font-body text-mist text-base">Subtotal</span>
                <span className="font-display font-black text-2xl text-ink">
                  ${total.toLocaleString("es-CL")}
                </span>
              </div>
              {/* Nota de envío */}
              <p className="font-body text-xs text-mist text-right">
                Costo de envio se calcula al finalizar
              </p>
            </div>

            <button
              onClick={onCheckout}
              id="checkout-button"
              className="w-full bg-ink hover:bg-ink/90 text-white font-bold rounded-full py-4 flex items-center justify-center transition-all shadow-md"
            >
              Ir a Pagar
            </button>
          </div>
        )}
      </div>
    </>
  )
}
