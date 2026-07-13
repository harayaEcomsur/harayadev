"use client";

import { useCallback, useEffect, useState } from "react";
import type { Booking } from "@/lib/booking-store";

const STATUS_STYLE: Record<Booking["status"], string> = {
  pendiente: "bg-amber-500/15 text-amber-600 border-amber-500/40",
  confirmada: "bg-emerald-500/15 text-emerald-600 border-emerald-500/40",
  cancelada: "bg-foreground/10 text-foreground/50 border-foreground/20",
};

// Link wa.me con el mensaje listo para el cliente final: coordinar el abono si
// está pendiente, o avisar la confirmación. Gratis — abre el WhatsApp del dueño,
// no usa la API de Meta.
function waHref(b: Booking, businessName: string): string {
  const fecha = new Date(b.date + "T12:00:00").toLocaleDateString("es-CL", { weekday: "long", day: "numeric", month: "long" });
  const msg =
    b.status === "confirmada"
      ? `Hola ${b.name}! Tu hora en ${businessName} quedó confirmada: ${b.service}, ${fecha} a las ${b.time} hrs. ¡Te esperamos! 😊`
      : `Hola ${b.name}! Te escribimos de ${businessName}. Tu reserva ${b.id} (${b.service}, ${fecha} a las ${b.time} hrs) está pendiente de abono — te enviamos los datos para transferir y dejarla confirmada 😊`;
  return `https://wa.me/${b.phone.replace(/\D/g, "")}?text=${encodeURIComponent(msg)}`;
}

// Panel del dueño: revisar reservas, confirmarlas (tras recibir el abono),
// cancelarlas y bloquear días u horas en que no puede recibir agenda.
export function AdminAgenda({
  adminKey,
  notifyEmail,
  businessName,
}: {
  adminKey: string;
  notifyEmail: string | null;
  businessName: string;
}) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [blocked, setBlocked] = useState<string[]>([]);
  const [blockDate, setBlockDate] = useState("");
  const [blockTime, setBlockTime] = useState("");
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [waReady, setWaReady] = useState(false);
  const [testResult, setTestResult] = useState<string>("");

  const refresh = useCallback(async () => {
    const d = await fetch("/api/agenda", { headers: { "x-agenda-key": adminKey } }).then((r) => r.json());
    setBookings(d.bookings ?? []);
    setBlocked(d.blocked ?? []);
    if (d.notify) {
      setEmail(d.notify.email ?? "");
      setWhatsapp(d.notify.whatsapp ?? "");
      setWaReady(Boolean(d.notify.whatsappReady));
    }
    setLoading(false);
  }, [adminKey]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function patch(body: object) {
    await fetch("/api/agenda", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-agenda-key": adminKey },
      body: JSON.stringify(body),
    });
    refresh();
  }

  const pending = bookings.filter((b) => b.status === "pendiente").length;

  return (
    <div className="flex flex-col gap-10">
      {/* Notificaciones */}
      <div className="rounded-xl border border-foreground/15 bg-foreground/[0.03] p-5 text-sm text-foreground/70">
        <p className="font-semibold text-foreground">🔔 ¿Dónde te avisamos cada reserva nueva?</p>
        <div className="mt-3 flex flex-wrap items-end gap-3">
          <label className="flex min-w-[220px] flex-1 flex-col gap-1 text-xs font-semibold uppercase tracking-wider text-foreground/60">
            Tu correo
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={notifyEmail ?? "tucorreo@gmail.com"}
              className="rounded-lg border border-foreground/20 bg-background px-3 py-2.5 text-sm normal-case tracking-normal text-foreground"
            />
          </label>
          <label className="flex min-w-[180px] flex-col gap-1 text-xs font-semibold uppercase tracking-wider text-foreground/60">
            Tu WhatsApp {!waReady && <span className="normal-case opacity-60">(próximamente)</span>}
            <input
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="+56 9 …"
              disabled={!waReady}
              className="rounded-lg border border-foreground/20 bg-background px-3 py-2.5 text-sm tracking-normal text-foreground disabled:opacity-50"
            />
          </label>
          <button
            onClick={async () => {
              setTestResult("…");
              await patch({ action: "setNotify", email, whatsapp });
              const r = await fetch("/api/agenda", {
                method: "PATCH",
                headers: { "Content-Type": "application/json", "x-agenda-key": adminKey },
                body: JSON.stringify({ action: "testNotify" }),
              }).then((x) => x.json());
              setTestResult(
                r.emailSent || r.whatsappSent
                  ? `✅ Enviado${r.emailSent ? " al correo" : ""}${r.whatsappSent ? " y al WhatsApp" : ""} — revísalo`
                  : "No se pudo enviar — revisa el correo ingresado"
              );
            }}
            className="rounded-lg bg-primary px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:opacity-90"
          >
            Guardar y enviar prueba
          </button>
        </div>
        {testResult && <p className="mt-2 text-sm font-semibold text-foreground">{testResult}</p>}
        <p className="mt-3 opacity-80">
          {waReady
            ? "El aviso por WhatsApp llega desde el número de HarayaDev."
            : "El aviso por WhatsApp se habilita con el módulo \u201cAsistente IA en tu WhatsApp\u201d."}
        </p>
      </div>

      {/* Reservas */}
      <section>
        <div className="flex items-baseline justify-between">
          <h2 className="font-heading text-xl font-bold text-foreground">Reservas</h2>
          {pending > 0 && (
            <span className="rounded-full border border-amber-500/40 bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-600">
              {pending} pendiente{pending > 1 ? "s" : ""} de abono
            </span>
          )}
        </div>
        {loading ? (
          <p className="mt-4 text-sm text-foreground/60">Cargando…</p>
        ) : bookings.length === 0 ? (
          <p className="mt-4 text-sm text-foreground/60">Aún no hay reservas.</p>
        ) : (
          <div className="mt-4 flex flex-col gap-3">
            {bookings.map((b) => (
              <div key={b.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-foreground/15 p-4">
                <div className="min-w-[220px] flex-1">
                  <p className="text-sm font-bold text-foreground">
                    {b.service} <span className="font-normal text-foreground/50">· {b.id}</span>
                  </p>
                  <p className="text-sm text-foreground/70">
                    {new Date(b.date + "T12:00:00").toLocaleDateString("es-CL", { weekday: "long", day: "numeric", month: "short" })} · {b.time} hrs — {b.name} ({b.phone})
                  </p>
                </div>
                <span className={`rounded-full border px-3 py-1 text-xs font-bold uppercase ${STATUS_STYLE[b.status]}`}>
                  {b.status}
                </span>
                {b.status === "pendiente" && (
                  <button
                    onClick={() => patch({ action: "status", id: b.id, status: "confirmada" })}
                    className="rounded-lg bg-primary px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:opacity-90"
                  >
                    ✓ Abono recibido — confirmar
                  </button>
                )}
                {b.status !== "cancelada" && b.phone.replace(/\D/g, "").length >= 8 && (
                  <a
                    href={waHref(b, businessName)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-emerald-600 hover:bg-emerald-500/20"
                  >
                    💬 WhatsApp
                  </a>
                )}
                {b.status !== "cancelada" && (
                  <button
                    onClick={() => patch({ action: "status", id: b.id, status: "cancelada" })}
                    className="rounded-lg border border-foreground/20 px-4 py-2 text-xs font-bold uppercase tracking-wider text-foreground/60 hover:border-primary hover:text-primary"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Bloqueos */}
      <section>
        <h2 className="font-heading text-xl font-bold text-foreground">Bloquear agenda</h2>
        <p className="mt-1 text-sm text-foreground/60">
          ¿Un día libre, vacaciones o una hora que no puedes atender? Bloquéala y desaparece de la
          agenda pública al instante.
        </p>
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wider text-foreground/60">
            Día
            <input
              type="date"
              value={blockDate}
              onChange={(e) => setBlockDate(e.target.value)}
              className="rounded-lg border border-foreground/20 bg-background px-3 py-2.5 text-sm text-foreground"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wider text-foreground/60">
            Hora (vacío = día completo)
            <input
              type="time"
              value={blockTime}
              onChange={(e) => setBlockTime(e.target.value)}
              step={1800}
              className="rounded-lg border border-foreground/20 bg-background px-3 py-2.5 text-sm text-foreground"
            />
          </label>
          <button
            disabled={!blockDate}
            onClick={() => patch({ action: "toggleBlock", key: blockTime ? `${blockDate} ${blockTime}` : blockDate })}
            className="rounded-lg bg-foreground px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-background hover:opacity-90 disabled:opacity-40"
          >
            Bloquear / desbloquear
          </button>
        </div>
        {blocked.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {blocked.map((k) => (
              <button
                key={k}
                onClick={() => patch({ action: "toggleBlock", key: k })}
                title="Click para desbloquear"
                className="rounded-full border border-foreground/20 bg-foreground/5 px-3 py-1.5 text-xs font-semibold text-foreground/70 hover:border-primary hover:text-primary"
              >
                🚫 {k} ✕
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
