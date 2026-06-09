// src/lib/supabase.js
// Cliente de Supabase — singleton usado en toda la app
//
// Requiere en .env:
//   VITE_SUPABASE_URL=https://gdbvvezpvwvsplaqcoot.supabase.co
//   VITE_SUPABASE_ANON_KEY=tu_clave_publica
//
// ─── SQL para crear la tabla en Supabase ────────────────────────────────────
//
//  create table public.orders (
//    id             text        primary key,
//    created_at     timestamptz default now() not null,
//    customer       jsonb       not null,
//    items          jsonb       not null,
//    subtotal       integer     not null,
//    shipping       jsonb       not null,
//    total          integer     not null,
//    status         text        not null default 'pending_payment',
//    status_history jsonb       not null default '[]'
//  );
//
//  alter table public.orders enable row level security;
//
//  -- Permite a cualquiera insertar (clientes hacen pedidos)
//  create policy "insert_open" on public.orders
//    for insert with check (true);
//
//  -- Permite a cualquiera leer (panel admin usa la misma clave anon)
//  create policy "select_open" on public.orders
//    for select using (true);
//
//  -- Permite a cualquiera actualizar (admin cambia estados)
//  create policy "update_open" on public.orders
//    for update using (true);
//
// ────────────────────────────────────────────────────────────────────────────

import { createClient } from "@supabase/supabase-js"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "[Supabase] Faltan las variables de entorno VITE_SUPABASE_URL y/o VITE_SUPABASE_ANON_KEY. " +
    "Crea un archivo .env en la raiz del proyecto con esas claves."
  )
}

export const supabase = createClient(supabaseUrl ?? "", supabaseKey ?? "")
