// src/components/AdminLogin.jsx
// Pantalla de acceso al panel de administracion.
//
// INTEGRACION JWT (T-12 — C. Perez):
//   Reemplaza la funcion checkPassword() dentro de handleSubmit con una
//   llamada a POST /api/auth/login que retorne un JWT.
//   Guarda el token en memoria React (NO localStorage).

import { useState } from "react"

const ADMIN_PASSWORD = "mechitas2026"

export default function AdminLogin({ onLogin, onBack }) {
  const [password, setPassword] = useState("")
  const [error,    setError]    = useState("")
  const [loading,  setLoading]  = useState(false)

  const handleSubmit = async () => {
    if (!password.trim()) {
      setError("Ingresa la contrasena")
      return
    }
    setLoading(true)
    setError("")

    // Simula latencia — eliminar cuando se integre JWT
    await new Promise((r) => setTimeout(r, 400))

    // TODO (T-12 / C. Perez): reemplazar con fetch POST /api/auth/login
    const ok = onLogin(password)
    if (!ok) {
      setError("Contrasena incorrecta")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-sand flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <img
            src="/image_11cb63.png"
            alt="Mechitas Mechonas"
            className="h-14 w-auto object-contain mx-auto mb-4"
          />
          <p className="font-body text-xs text-mist tracking-[0.18em] uppercase">
            Acceso Administracion
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-dust shadow-card p-8">
          <h1 className="font-display font-bold text-xl text-ink text-center mb-6">
            Panel Interno
          </h1>

          <div className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="admin-password"
                className="font-body text-sm font-semibold text-ink mb-1.5 block"
              >
                Contrasena
              </label>
              <input
                id="admin-password"
                type="password"
                placeholder="Contrasena de administrador"
                value={password}
                autoComplete="current-password"
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (error) setError("")
                }}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                className={`w-full bg-white border ${
                  error ? "border-rose-berry" : "border-dust"
                } rounded-xl px-4 py-3 text-sm font-body text-ink outline-none focus:border-teal focus:ring-2 focus:ring-teal/20 transition-all placeholder:text-mist`}
              />
              {error && (
                <p className="text-rose-berry text-xs mt-1.5 font-semibold">{error}</p>
              )}
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-ink hover:bg-ink/90 disabled:opacity-60 text-white font-bold rounded-full py-3.5 transition-all shadow-md text-sm"
            >
              {loading ? "Verificando..." : "Ingresar"}
            </button>

            <button
              onClick={onBack}
              className="text-center font-body text-sm text-mist hover:text-ink transition-colors"
            >
              Volver a la tienda
            </button>
          </div>
        </div>

        <p className="text-center font-body text-xs text-mist/50 mt-6">
          Acceso restringido — Solo personal autorizado
        </p>
      </div>
    </div>
  )
}
