export default function Hero() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-gradient-to-br from-teal-pale via-sand to-rose-blush min-h-[480px] sm:min-h-[560px] flex items-center"
    >
      {/* Dot pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle,rgba(93,191,176,.10) 1.5px,transparent 1.5px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Subtle floating shapes */}
      <div className="absolute w-80 h-80 bg-teal-light rounded-full opacity-15 -top-20 -right-20 animate-float pointer-events-none" />
      <div className="absolute w-56 h-56 bg-rose-blush rounded-full opacity-20 -bottom-12 left-8 animate-float pointer-events-none" style={{ animationDelay: "1s" }} />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-10 py-20 lg:py-28 w-full text-center">
        <div className="flex flex-col items-center gap-6 animate-fade-up">
          {/* Badge */}
          <div className="inline-flex w-fit items-center bg-teal text-white rounded-full px-5 py-2 text-xs font-bold tracking-widest uppercase shadow-teal">
            Artesanal — Hecho en Chile
          </div>

          {/* Main slogan — bold, large, inclusive */}
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-ink leading-[1.10] tracking-tight">
            Lazos, scrunchies y{" "}
            <span className="text-teal">accesorios</span> artesanales
            <br className="hidden sm:block" />{" "}
            para seres{" "}
            <span className="relative inline-block">
              <span className="text-rose-berry">increíbles</span>
              <svg
                className="absolute -bottom-1 left-0 w-full"
                height="6"
                viewBox="0 0 200 6"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M0 5 Q50 0 100 5 Q150 10 200 5"
                  stroke="#f29eab"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          <p className="font-body text-mist text-base sm:text-lg leading-relaxed max-w-xl">
            Accesorios hechos a mano con materiales premium para niñas,
            mujeres y mascotas. Cada pieza refleja dedicación, calidad
            y un estilo único.
          </p>

          {/* CTAs — text only */}
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <a
              href="#catalogo"
              onClick={(e) => {
                e.preventDefault()
                const el = document.getElementById("catalogo")
                if (el) el.scrollIntoView({ behavior: "smooth" })
              }}
              className="inline-flex items-center bg-teal hover:bg-teal-dark text-white font-bold text-sm rounded-full px-7 py-3.5 shadow-teal hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            >
              Ver Catálogo
            </a>
            <a
              href="#catalogo"
              onClick={(e) => {
                e.preventDefault()
                const el = document.getElementById("catalogo")
                if (el) el.scrollIntoView({ behavior: "smooth" })
              }}
              className="inline-flex items-center bg-white hover:bg-rose-blush text-rose-berry font-bold text-sm rounded-full px-7 py-3.5 border-2 border-rose-petal hover:border-rose transition-all duration-200"
            >
              Accesorios para Mascotas
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
