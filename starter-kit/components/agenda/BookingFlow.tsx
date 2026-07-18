"use client";

import { useEffect, useMemo, useState } from "react";
import type { ClientConfig } from "@/config/schema";
import { formatCLP } from "@/lib/clp";

// Flujo público de reserva: servicio → día → hora → datos → pendiente de abono.
// Con depositAmount configurado, el abono se paga al tiro con Webpay y la
// reserva se confirma sola.
export function BookingFlow({
  services,
  daysAhead,
  depositNote,
  initialService,
  depositAmount,
}: {
  services: { title: string; price?: string }[];
  daysAhead: number;
  depositNote: string;
  initialService?: string;
  depositAmount?: number;
}) {
  const [service, setService] = useState(
    services.some((s) => s.title === initialService) ? (initialService as string) : services[0]?.title ?? ""
  );
  const [date, setDate] = useState<string>("");
  const [slots, setSlots] = useState<{ time: string; available: boolean }[] | null>(null);
  const [time, setTime] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "loading" | "sending" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [done, setDone] = useState<{ id: string; service: string; date: string; time: string } | null>(null);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState("");

  const days = useMemo(() => {
    const out: { iso: string; label: string; weekday: string }[] = [];
    for (let i = 0; i < daysAhead; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      out.push({
        iso: d.toISOString().slice(0, 10),
        label: d.toLocaleDateString("es-CL", { day: "numeric", month: "short" }),
        weekday: d.toLocaleDateString("es-CL", { weekday: "short" }),
      });
    }
    return out;
  }, [daysAhead]);

  useEffect(() => {
    if (!date) return;
    setSlots(null);
    setTime("");
    setStatus("loading");
    fetch(`/api/agenda?date=${date}`)
      .then((r) => r.json())
      .then((d) => {
        setSlots(d.slots ?? []);
        setStatus("idle");
      })
      .catch(() => setStatus("error"));
  }, [date]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    const data = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/agenda", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service,
          date,
          time,
          name: String(data.get("name") ?? ""),
          phone: String(data.get("phone") ?? ""),
        }),
      });
      const d = await res.json();
      if (!res.ok) {
        setErrorMsg(d.error ?? "No se pudo reservar.");
        setStatus("error");
        if (res.status === 409 && date) {
          // hora tomada entre medio: refrescar disponibilidad
          const r = await fetch(`/api/agenda?date=${date}`).then((x) => x.json());
          setSlots(r.slots ?? []);
        }
        return;
      }
      setDone(d.booking);
      setStatus("idle");
    } catch {
      setStatus("error");
      setErrorMsg("Error de conexión — intenta de nuevo.");
    }
  }

  async function payDeposit() {
    if (!done) return;
    setPayError("");
    setPaying(true);
    try {
      const res = await fetch("/api/agenda/abono", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: done.id }),
      });
      const d = await res.json().catch(() => null);
      if (!res.ok || !d?.url || !d?.token) {
        setPayError(d?.error ?? "No se pudo iniciar el pago — intenta de nuevo.");
        setPaying(false);
        return;
      }
      window.location.href = `${d.url}?token_ws=${encodeURIComponent(d.token)}`;
    } catch {
      setPayError("Error de conexión — intenta de nuevo.");
      setPaying(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">Reserva {done.id}</p>
        <h2 className="mt-2 font-heading text-2xl font-bold text-foreground">¡Tu hora quedó reservada! 🎉</h2>
        <p className="mt-3 text-foreground/80">
          <strong>{done.service}</strong> — {new Date(done.date + "T12:00:00").toLocaleDateString("es-CL", { weekday: "long", day: "numeric", month: "long" })} a las <strong>{done.time}</strong>.
        </p>
        <div className="mt-4 rounded-xl border border-foreground/15 bg-background p-4">
          <p className="text-sm font-semibold text-foreground">⏳ Pendiente de abono</p>
          <p className="mt-1 text-sm text-foreground/70">{depositNote}</p>
          {depositAmount ? (
            <>
              <button
                type="button"
                onClick={payDeposit}
                disabled={paying}
                className="mt-3 rounded-xl bg-primary px-6 py-3 text-sm font-bold uppercase tracking-wider text-white hover:opacity-90 disabled:opacity-60"
              >
                {paying ? "Conectando con Webpay…" : `Pagar abono de ${formatCLP(depositAmount)} con Webpay`}
              </button>
              <p className="mt-2 text-xs text-foreground/60">
                Pago con tarjeta de débito o crédito. Al aprobarse, tu hora queda confirmada al instante.
              </p>
              {payError && <p className="mt-2 text-sm font-semibold text-primary">{payError}</p>}
            </>
          ) : null}
        </div>
        <p className="mt-4 text-sm text-foreground/60">
          Te contactaremos al número que dejaste para confirmar. ¡Nos vemos!
        </p>
      </div>
    );
  }

  const inputCls =
    "w-full rounded-lg border border-foreground/20 bg-background px-4 py-3 text-[15px] text-foreground outline-none focus:border-primary";

  return (
    <form onSubmit={submit} className="flex flex-col gap-8">
      {/* 1. Servicio */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">1 · Elige tu servicio</p>
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <button
              key={s.title}
              type="button"
              onClick={() => setService(s.title)}
              className={`rounded-xl border px-4 py-3 text-left text-sm font-semibold transition-colors ${
                service === s.title
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-foreground/15 text-foreground/70 hover:text-foreground"
              }`}
            >
              {s.title}
              {s.price && <span className="mt-0.5 block text-xs font-normal opacity-70">{s.price}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Día */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">2 · Elige el día</p>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
          {days.map((d) => (
            <button
              key={d.iso}
              type="button"
              onClick={() => setDate(d.iso)}
              className={`min-w-[72px] rounded-xl border px-3 py-2.5 text-center transition-colors ${
                date === d.iso
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-foreground/15 text-foreground/70 hover:text-foreground"
              }`}
            >
              <span className="block text-[11px] uppercase">{d.weekday}</span>
              <span className="block text-sm font-bold">{d.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Hora */}
      {date && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">3 · Elige la hora</p>
          {status === "loading" && <p className="mt-3 text-sm text-foreground/60">Buscando horas disponibles…</p>}
          {slots && slots.length === 0 && (
            <p className="mt-3 text-sm text-foreground/60">Ese día no hay atención — prueba con otro.</p>
          )}
          {slots && slots.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {slots.map((s) => (
                <button
                  key={s.time}
                  type="button"
                  disabled={!s.available}
                  onClick={() => setTime(s.time)}
                  className={`rounded-lg border px-4 py-2.5 text-sm font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-30 disabled:line-through ${
                    time === s.time
                      ? "border-primary bg-primary text-white"
                      : "border-foreground/15 text-foreground/80 hover:border-primary"
                  }`}
                >
                  {s.time}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. Datos */}
      {time && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">4 · Tus datos</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <input name="name" required minLength={2} maxLength={120} placeholder="Tu nombre" className={inputCls} />
            <input name="phone" required minLength={6} maxLength={20} placeholder="Tu WhatsApp (+56 9 …)" className={inputCls} />
          </div>
          <p className="mt-3 text-sm text-foreground/60">{depositNote}</p>
          {errorMsg && <p className="mt-3 text-sm font-semibold text-primary">{errorMsg}</p>}
          <button
            type="submit"
            disabled={status === "sending"}
            className="mt-4 rounded-xl bg-primary px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-white hover:opacity-90 disabled:opacity-60"
          >
            {status === "sending" ? "Reservando…" : `Reservar ${service} · ${time} hrs`}
          </button>
        </div>
      )}
    </form>
  );
}

export type BookingConfig = NonNullable<ClientConfig["booking"]>;
