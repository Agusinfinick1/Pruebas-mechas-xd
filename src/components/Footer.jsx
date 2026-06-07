export default function Footer() {
  return (
    <footer id="nosotros" className="bg-ink text-white">
      {/* Curved top */}
      <div className="bg-sand h-10 rounded-b-[50%] w-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] gap-10">
          {/* Brand column */}
          <div className="flex flex-col gap-4">
            <img
              src="/image_11cb63.png"
              alt="Mechitas Mechonas"
              className="h-14 w-auto object-contain self-start"
            />
            <p className="font-body text-sm text-white/60 leading-relaxed max-w-xs">
              Accesorios artesanales para el pelo y mascotas. Cada pieza está
              hecha con dedicación y materiales de calidad en Chile.
            </p>
          </div>

          {/* Pelo column */}
          <div className="flex flex-col gap-3">
            <h4 className="font-display font-bold text-base text-white">
              Pelo
            </h4>
            <ul className="flex flex-col gap-2">
              {["Lazos", "Scrunchies", "Pinches", "Cintillos", "Coronas"].map(
                (item) => (
                  <li key={item}>
                    <a
                      href="#catalogo"
                      className="font-body text-sm text-white/50 hover:text-teal-light transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Mascotas column */}
          <div className="flex flex-col gap-3">
            <h4 className="font-display font-bold text-base text-white">
              Mascotas
            </h4>
            <ul className="flex flex-col gap-2">
              {[
                "Lazos para Perros",
                "Pañuelitos",
                "Coronitas Pet",
                "Sets Dúo",
                "Collares",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#catalogo"
                    className="font-body text-sm text-white/50 hover:text-teal-light transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social — text links only */}
          <div className="flex flex-col gap-3">
            <h4 className="font-display font-bold text-base text-white">
              Contacto
            </h4>
            <ul className="flex flex-col gap-2">
              <li>
                <a
                  href="https://www.instagram.com/mechitas_mechonas/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-sm text-white/50 hover:text-teal-light transition-colors"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://www.tiktok.com/@mechitas_mechonas?_r=1&_t=ZS-96tHl9LgPto"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-sm text-white/50 hover:text-teal-light transition-colors"
                >
                  TikTok
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="font-body text-sm text-white/50 hover:text-teal-light transition-colors"
                >
                  Envíos y despacho
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-body text-white/35">
          <p>
            {new Date().getFullYear()} Mechitas Mechonas. Todos los derechos
            reservados.
          </p>
          <p>Hecho con dedicación artesanal en Chile</p>
        </div>
      </div>
    </footer>
  )
}
