import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { timingSafeEqual } from "node:crypto";
import { getEmbedTenant } from "@/config/embed-tenants";
import { listBookings } from "@/lib/embed-agenda";
import { listOrders } from "@/lib/embed-store";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "Panel del negocio — HarayaDev",
  robots: { index: false, follow: false },
};

// Clave de admin POR TENANT, desde env var namespaced EMBED_ADMIN_KEY_<ID>
// (secreto solo en el entorno; sin ella el panel es inaccesible = default seguro).
function adminKeyFor(tenantId: string): string | undefined {
  const norm = tenantId.toUpperCase().replace(/[^A-Z0-9]+/g, "_");
  return process.env[`EMBED_ADMIN_KEY_${norm}`];
}

function keyMatches(provided: string | undefined, expected: string | undefined): boolean {
  if (!expected || !provided) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

const clp = (n: number) => "$" + n.toLocaleString("es-CL");
function fecha(d: string): string {
  return new Intl.DateTimeFormat("es-CL", { weekday: "short", day: "numeric", month: "short" }).format(
    new Date(d + "T12:00:00")
  );
}

const STATUS_STYLE: Record<string, string> = {
  pendiente: "bg-amber-100 text-amber-800",
  confirmada: "bg-emerald-100 text-emerald-800",
  pagado: "bg-emerald-100 text-emerald-800",
  cancelada: "bg-red-100 text-red-700",
  rechazado: "bg-red-100 text-red-700",
};
function Badge({ status }: { status: string }) {
  return (
    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_STYLE[status] ?? "bg-slate-100 text-slate-700"}`}>
      {status}
    </span>
  );
}

export default async function EmbedPanelPage({
  searchParams,
}: {
  searchParams: { t?: string; clave?: string };
}) {
  const tenant = getEmbedTenant(searchParams.t);
  if (!tenant) notFound();

  const authorized = keyMatches(searchParams.clave, adminKeyFor(tenant.id));

  if (!authorized) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-16 font-sans">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-red-500">Panel del negocio</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">{tenant.businessName}</h1>
        <div className="mt-8 rounded-xl border border-slate-200 p-6 text-slate-600">
          <p>
            Este panel muestra tus reservas y pedidos. Entra con tu <strong>link de administración</strong>{" "}
            <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm">/embed/panel?t={tenant.id}&amp;clave=…</code>.
          </p>
          <p className="mt-3 text-sm">Si no lo tienes, pídelo a HarayaDev.</p>
        </div>
      </main>
    );
  }

  const [bookings, orders] = await Promise.all([listBookings(tenant), listOrders(tenant.id)]);

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 font-sans">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-red-500">Panel del negocio</p>
      <h1 className="mt-3 text-3xl font-bold text-slate-900">{tenant.businessName}</h1>
      <p className="mt-1 text-sm text-slate-500">Reservas y pedidos de tu asistente. Se actualiza al recargar.</p>

      {tenant.agenda && (
        <section className="mt-10">
          <h2 className="text-lg font-semibold text-slate-800">Reservas ({bookings.length})</h2>
          {bookings.length === 0 ? (
            <p className="mt-3 text-slate-500">Aún no hay reservas.</p>
          ) : (
            <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-4 py-2 font-medium">Fecha</th>
                    <th className="px-4 py-2 font-medium">Hora</th>
                    <th className="px-4 py-2 font-medium">Servicio</th>
                    <th className="px-4 py-2 font-medium">Cliente</th>
                    <th className="px-4 py-2 font-medium">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bookings.map((b) => (
                    <tr key={b.id}>
                      <td className="px-4 py-2 text-slate-700">{fecha(b.date)}</td>
                      <td className="px-4 py-2 text-slate-700">{b.time}</td>
                      <td className="px-4 py-2 text-slate-700">{b.service}</td>
                      <td className="px-4 py-2 text-slate-700">
                        {b.name}
                        <span className="block text-xs text-slate-400">{b.phone}</span>
                      </td>
                      <td className="px-4 py-2"><Badge status={b.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {tenant.store && (
        <section className="mt-10">
          <h2 className="text-lg font-semibold text-slate-800">Pedidos ({orders.length})</h2>
          {orders.length === 0 ? (
            <p className="mt-3 text-slate-500">Aún no hay pedidos.</p>
          ) : (
            <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-4 py-2 font-medium">Pedido</th>
                    <th className="px-4 py-2 font-medium">Productos</th>
                    <th className="px-4 py-2 font-medium">Total</th>
                    <th className="px-4 py-2 font-medium">Cliente</th>
                    <th className="px-4 py-2 font-medium">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((o) => (
                    <tr key={o.id}>
                      <td className="px-4 py-2 font-mono text-xs text-slate-500">{o.id}</td>
                      <td className="px-4 py-2 text-slate-700">
                        {o.items.map((i) => `${i.qty}× ${i.name}`).join(", ")}
                      </td>
                      <td className="px-4 py-2 text-slate-700">{clp(o.total)}</td>
                      <td className="px-4 py-2 text-slate-700">
                        {o.buyer.name}
                        <span className="block text-xs text-slate-400">{o.buyer.phone}</span>
                      </td>
                      <td className="px-4 py-2"><Badge status={o.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </main>
  );
}
