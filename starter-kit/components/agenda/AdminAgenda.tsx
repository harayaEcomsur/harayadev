"use client";

import { useCallback, useEffect, useState } from "react";
import type { Booking } from "@/lib/booking-store";

const STATUS_STYLE: Record<Booking["status"], string> = {
  pendiente: "bg-amber-500/15 text-amber-600 border-amber-500/40",
  confirmada: "bg-emerald-500/15 text-emerald-600 border-emerald-500/40",
  cancelada: "bg-foreground/10 text-foreground/50 border-foreground/20",
};

// Panel del dueño: revisar reservas, confirmarlas (tras recibir el abono),
// cancelarlas y bloquear días u horas en que no puede recibir agenda.
export function AdminAgenda({ adminKey, notifyEmail }: { adminKey: string; notifyEmail: string | null }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [blocked, setBlocked] = useState<string[]>([]);
  const [blockDate, setBlockDate] = useState("");
  const [blockTime, setBlockTime] = useState("");
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const d = await fetch("/api/agenda", { headers: { "x-agenda-key": adminKey } }).then((r) => r.json());
    setBookings(d.bookings ?? []);
    setBlocked(d.blocked ?? []);
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
        <p className="font-semibold text-foreground">🔔 Notificaciones de reservas nuevas</p>
        <p className="mt-1">
          Email: {notifyEmail ? <strong className="text-foreground">{notifyEmail}</strong> : "no configurado"} — cada
          reserva llega al instante con los datos del cliente.
        </p>
        <p className="mt-1 opacity-80">
          WhatsApp: disponible al activar el módulo &quot;Asistente IA en tu WhatsApp&quot; (mismo número del negocio).
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
