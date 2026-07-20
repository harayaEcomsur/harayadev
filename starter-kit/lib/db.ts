import postgres from "postgres";

// Capa de persistencia opcional. Con DATABASE_URL apuntando a Postgres (Neon en
// producción), reservas, pedidos, leads y el historial del asistente sobreviven
// a los reinicios y son los mismos para todos los isolates de Vercel. Sin
// DATABASE_URL, los stores siguen funcionando en memoria: las demos no
// necesitan base de datos y arrancan sin configurar nada.
//
// Con Neon usa el connection string POOLED (el que trae "-pooler"): en
// funciones serverless cada invocación abre su propia conexión.

let client: ReturnType<typeof postgres> | null = null;
let schemaReady: Promise<void> | null = null;

export function hasDb(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

export function db() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL no está definida");
  if (!client) {
    client = postgres(process.env.DATABASE_URL, {
      // Una conexión por isolate: en serverless no hay proceso largo que reutilizar.
      max: 1,
      idle_timeout: 20,
      connect_timeout: 10,
      // Neon exige TLS; en Postgres local (docker) no hay certificado.
      ssl: process.env.DATABASE_URL.includes("localhost") || process.env.DATABASE_URL.includes("127.0.0.1")
        ? false
        : "require",
      onnotice: () => {},
    });
  }
  return client;
}

// Crea las tablas si faltan. Idempotente y cacheada por isolate: el primer
// request que toque la base paga el costo, el resto no. Así el template no
// necesita un paso de migración manual al desplegar un cliente nuevo.
export function ensureSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = (async () => {
      const sql = db();
      await sql`
        CREATE TABLE IF NOT EXISTS bookings (
          id TEXT PRIMARY KEY,
          service TEXT NOT NULL,
          date TEXT NOT NULL,
          time TEXT NOT NULL,
          name TEXT NOT NULL,
          phone TEXT NOT NULL,
          status TEXT NOT NULL,
          payment JSONB,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `;
      await sql`CREATE INDEX IF NOT EXISTS bookings_date_idx ON bookings (date)`;
      // Dos personas no pueden tomar la misma hora: lo garantiza la base, no el
      // código de la aplicación (dos requests simultáneos pasarían la validación
      // previa y solo uno pasa este índice).
      await sql`
        CREATE UNIQUE INDEX IF NOT EXISTS bookings_slot_unico
        ON bookings (date, time) WHERE status <> 'cancelada'
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS blocked_slots (
          key TEXT PRIMARY KEY
        )
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS settings (
          key TEXT PRIMARY KEY,
          value JSONB NOT NULL
        )
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS orders (
          id TEXT PRIMARY KEY,
          items JSONB NOT NULL,
          total INTEGER NOT NULL,
          buyer JSONB NOT NULL,
          status TEXT NOT NULL,
          authorization_code TEXT,
          card_last4 TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS leads (
          id TEXT PRIMARY KEY,
          nombre TEXT NOT NULL,
          telefono TEXT NOT NULL,
          operacion TEXT NOT NULL,
          comunas JSONB NOT NULL,
          presupuesto TEXT,
          plazo TEXT,
          propiedad_interes TEXT,
          notas TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS chat_log (
          id BIGSERIAL PRIMARY KEY,
          canal TEXT NOT NULL,
          user_text TEXT NOT NULL,
          assistant_text TEXT NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `;
      await sql`CREATE INDEX IF NOT EXISTS chat_log_created_idx ON chat_log (created_at DESC)`;
      await sql`
        CREATE TABLE IF NOT EXISTS wa_threads (
          phone TEXT PRIMARY KEY,
          turns JSONB NOT NULL,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `;
    })().catch((error) => {
      // Si falla la creación, no cachear el fallo: el próximo request reintenta.
      schemaReady = null;
      throw error;
    });
  }
  return schemaReady;
}

// Envuelve una operación contra la base: si no hay DATABASE_URL, o si la base
// falla, se usa el camino en memoria. Nunca se cae un sitio de cliente por un
// problema de la base — se registra y se degrada.
export async function withDb<T>(operation: () => Promise<T>, fallback: () => T | Promise<T>): Promise<T> {
  if (!hasDb()) return fallback();
  try {
    await ensureSchema();
    return await operation();
  } catch (error) {
    console.error("[db] operación falló, usando memoria:", error);
    return fallback();
  }
}

// Envuelve un valor para una columna jsonb. Ojo: pasar un JSON.stringify con
// cast `::jsonb` NO es equivalente — guarda el texto como jsonb de tipo string
// y al leerlo vuelve un string en vez del objeto. postgres.js tipa `sql.json`
// con su propio JSONValue, que no acepta arrays de interfaces aunque sean JSON
// válido; el cast necesario vive acá y no repartido por los stores.
export function jsonb(value: unknown) {
  const sql = db();
  return sql.json(value as Parameters<typeof sql.json>[0]);
}
