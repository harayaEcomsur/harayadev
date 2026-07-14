import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { clientConfig } from "@/config/client.config";
import { Header } from "@/components/layout/Header";
import { AdminAgenda } from "@/components/agenda/AdminAgenda";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `Panel de agenda — ${clientConfig.meta.businessName}`,
  robots: { index: false, follow: false },
};

// Panel del dueño, protegido por clave (?clave=… o el link directo que le
// entregamos al negocio). En producción esto evoluciona a login con usuario.
export default function AgendaAdminPage({ searchParams }: { searchParams: { clave?: string } }) {
  if (!clientConfig.modules.agenda) notFound();
  const adminKey = process.env.AGENDA_ADMIN_KEY;
  const authorized = adminKey && searchParams.clave === adminKey;

  return (
    <>
      <Header config={clientConfig} />
      <main className="py-14 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Panel del negocio</p>
          <h1 className="mt-3 font-heading text-3xl font-bold text-foreground">Administrar agenda</h1>
          {!authorized ? (
            <div className="mt-8 rounded-xl border border-foreground/15 p-6">
              <p className="text-foreground/70">
                La <strong>clave</strong> protege tu panel de reservas (confirmar, cancelar, bloquear horarios) — no
                es un módulo de pago. Los avisos por WhatsApp con wa.me son <strong>gratuitos</strong> y no dependen de
                esta clave: llegan al correo/WhatsApp que configures aquí dentro.
              </p>
              <p className="mt-3 text-foreground/70">
                Ingresa con tu link de administración{" "}
                <code className="rounded bg-foreground/10 px-1.5 py-0.5 text-sm">/agenda/admin?clave=…</code>.
              </p>
            </div>
          ) : (
            <div className="mt-8">
              <AdminAgenda
                adminKey={adminKey!}
                notifyEmail={process.env.BOOKINGS_NOTIFY_EMAIL ?? null}
                businessName={clientConfig.meta.businessName}
              />
            </div>
          )}
        </div>
      </main>
    </>
  );
}
