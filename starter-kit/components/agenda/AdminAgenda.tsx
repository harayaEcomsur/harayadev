"use client";

import { useCallback, useEffect, useState } from "react";
import type { Booking } from "@/lib/booking-store";
import { buildBookingClientWaLink } from "@/lib/whatsapp";
import { buildGoogleCalendarUrl } from "@/lib/calendar";

const STATUS_STYLE: Record<Booking["status"], string> = {
  pendiente: "bg-amber-500/15 text-amber-600 border-amber-500/40",
  confirmada: "bg-emerald-500/15 text-emerald-600 border-emerald-500/40",
  cancelada: "bg-foreground/10 text-foreground/50 border-foreground/20",
};

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
  const [waMode, setWaMode] = useState<"wame" | "api">("wame");
  const [testResult, setTestResult] = useState<string>("");
  const [calCopied, setCalCopied] = useState(false);
  // Absoluta recién en el cliente para no diferir del HTML del servidor (hidratación).
  const [calendarUrl, setCalendarUrl] = useState(`/api/agenda/calendario?clave=${adminKey}`);
  useEffect(() => {
    setCalendarUrl(`${window.location.origin}/api/agenda/calendario?clave=${adminKey}`);
  }, [adminKey]);

  const refresh = useCallback(async () => {
    const d = await fetch("/api/agenda", { headers: { "x-agenda-key": adminKey } }).then((r) => r.json());
    setBookings(d.bookings ?? []);
    setBlocked(d.blocked ?? []);
    if (d.notify) {
      setEmail(d.notify.email ?? "");
      setWhatsapp(d.notify.whatsapp ?? "");
      setWaMode(d.notify.whatsappMode === "api" ? "api" : "wame");
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
  const demoBooking = bookings.find((b) => b.status === "pendiente" && b.phone.replace(/\D/g, "").length >= 8);
  const waDigits = whatsapp.replace(/\D/g, "");

  return (
    <div className="flex flex-col gap-10">
      {/* Notificaciones */}
      <div className="rounded-xl border border-foreground/15 bg-foreground/[0.03] p-5 text-sm text-foreground/70">
        <p className="font-semibold text-foreground">🔔 Avisos de reserva nueva (gratis con wa.me)</p>
        <p className="mt-2 leading-relaxed">
          Cuando alguien agenda, te llega un <strong>correo</strong> con un enlace wa.me que abre WhatsApp con el
          resumen listo. No usa API de Meta ni módulos de pago — solo necesitas tu número abajo.
        </p>
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
            Tu WhatsApp ({businessName})
            <input
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="+56 9 …"
              className="rounded-lg border border-foreground/20 bg-background px-3 py-2.5 text-sm tracking-normal text-foreground"
            />
          </label>
          <button
            onClick={async () => {
              setTestResult("…");
              await patch({ action: "setNotify", email, whatsapp });
              setTestResult("✅ Configuración guardada");
            }}
            className="rounded-lg border border-foreground/20 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-foreground hover:border-primary hover:text-primary"
          >
            Guardar
          </button>
          <button
            onClick={async () => {
              setTestResult("…");
              await patch({ action: "setNotify", email, whatsapp });
              const r = await fetch("/api/agenda", {
                method: "PATCH",
                headers: { "Content-Type": "application/json", "x-agenda-key": adminKey },
                body: JSON.stringify({ action: "testNotify" }),
              }).then((x) => x.json());
              if (r.waMeUrl) window.open(r.waMeUrl, "_blank", "noopener,noreferrer");
              setTestResult(
                r.emailSent && r.waMeUrl
                  ? "✅ Correo enviado y WhatsApp abierto con el aviso de prueba"
                  : r.emailSent
                    ? "✅ Correo de prueba enviado — revísalo (incluye enlace wa.me)"
                    : r.waMeUrl
                      ? "✅ WhatsApp abierto con el aviso de prueba"
                      : "Ingresa correo o WhatsApp válido para probar"
              );
            }}
            className="rounded-lg bg-primary px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:opacity-90"
          >
            Probar aviso
          </button>
        </div>
        {testResult && <p className="mt-2 text-sm font-semibold text-foreground">{testResult}</p>}
        <p className="mt-3 opacity-80">
          {waMode === "api"
            ? "Además, con el módulo de WhatsApp activo, el aviso puede llegar automático sin abrir enlaces."
            : "El aviso por WhatsApp es vía wa.me (un toque desde el correo o el botón de prueba). El push automático sin tocar nada requiere el módulo de pago con API de Meta."}
        </p>
      </div>

      {/* wa.me — contacto manual a clientas */}
      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-5 text-sm text-foreground/70">
        <p className="font-semibold text-foreground">💬 Responder a cada clienta (wa.me)</p>
        <p className="mt-2 leading-relaxed">
          En cada reserva, el botón <strong>WhatsApp</strong> abre tu app con el mensaje listo para coordinar el abono
          o confirmar la hora — gratis, sin API.
        </p>
        {demoBooking ? (
          <a
            href={buildBookingClientWaLink(demoBooking, businessName)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-emerald-600 hover:bg-emerald-500/20"
          >
            Probar mensaje a clienta (demo)
          </a>
        ) : (
          <p className="mt-3 text-foreground/60">Cuando llegue la primera reserva, el botón aparecerá ahí mismo.</p>
        )}
        {waDigits.length > 0 && waDigits.length < 8 && (
          <p className="mt-3 text-xs text-amber-600">Ingresa un WhatsApp válido arriba (ej. +56 9 1234 5678).</p>
        )}
      </div>

      {/* Sincronización con calendario (Google / Outlook / Apple) */}
      <div className="rounded-xl border border-sky-500/30 bg-sky-500/5 p-5 text-sm text-foreground/70">
        <p className="font-semibold text-foreground">📅 Tus reservas, en tu calendario de siempre</p>
        <p className="mt-2 leading-relaxed">
          Suscríbete una sola vez y tus reservas aparecen y se actualizan solas en Google Calendar,
          Outlook o el calendario del iPhone. Además, cada correo de aviso trae un botón
          {" “"}Agregar a Google Calendar{"”"} para anotar esa hora al instante.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <code className="max-w-full overflow-x-auto rounded-lg border border-foreground/15 bg-background px-3 py-2.5 text-xs text-foreground">
            {calendarUrl}
          </code>
          <button
            onClick={() => {
              navigator.clipboard?.writeText(calendarUrl);
              setCalCopied(true);
              setTimeout(() => setCalCopied(false), 2500);
            }}
            className="rounded-lg border border-sky-500/40 bg-sky-500/10 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-sky-600 hover:bg-sky-500/20"
          >
            {calCopied ? "✓ Copiado" : "Copiar enlace"}
          </button>
        </div>
        <p className="mt-3 text-xs opacity-80">
          En Google Calendar: Otros calendarios → + → Desde URL → pega el enlace. Google lo refresca
          automáticamente cada algunas horas.
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
                    href={buildBookingClientWaLink(b, businessName)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-emerald-600 hover:bg-emerald-500/20"
                  >
                    💬 WhatsApp
                  </a>
                )}
                {b.status !== "cancelada" && (
                  <a
                    href={buildGoogleCalendarUrl(b)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-sky-500/40 bg-sky-500/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-sky-600 hover:bg-sky-500/20"
                  >
                    📅 Calendario
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
