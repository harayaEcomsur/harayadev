"use client";

import { site } from "@/lib/site";

const SUGERENCIAS = ["¿Cuánto cuesta una web?", "¿Cómo es la demo gratis?", "¿En cuánto tiempo entregan?"];

export type DemoChatViewProps = {
  messages: { id: string; role: string; content: string }[];
  input: string;
  isLoading: boolean;
  hasError: boolean;
  onSuggestion: (texto: string) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onInputFocus?: () => void;
  inputAutoFocus?: boolean;
  chatRef?: React.Ref<HTMLDivElement>;
};

// Markup único de la sección demo: lo renderizan tanto la cáscara estática
// (DemoChat, sin ai/react) como la versión viva (DemoChatLive). Cualquier
// cambio visual se hace solo aquí.
export function DemoChatView({
  messages,
  input,
  isLoading,
  hasError,
  onSuggestion,
  onInputChange,
  onSubmit,
  onInputFocus,
  inputAutoFocus,
  chatRef,
}: DemoChatViewProps) {
  return (
    <section id="demo" className="relative overflow-hidden border-t border-line px-4 py-16 sm:py-[90px] sm:px-6 lg:px-8 scroll-mt-20">
      <div
        className="pointer-events-none absolute -left-[300px] -top-[200px] h-[800px] w-[800px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(255,61,61,0.1), transparent 62%)" }}
      />
      <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-16 lg:flex-row lg:gap-[72px]">
        <div className="flex flex-1 flex-col gap-[22px]">
          <span className="font-mono text-sm tracking-[0.14em] text-primary">PRUÉBALO AQUÍ MISMO</span>
          <h2 className="m-0 text-3xl font-black leading-[1.05] tracking-tight sm:text-[44px]">
            Así atiende el asistente IA a tus clientes
          </h2>
          <p className="m-0 max-w-[460px] text-lg leading-[1.6] text-soft">
            Este mismo asistente va dentro de tu web: responde preguntas, agenda horas y toma pedidos,
            las 24 horas. Escríbele algo o toca una pregunta de ejemplo.
          </p>
          <div className="flex flex-wrap gap-2.5">
            {SUGERENCIAS.map((texto) => (
              <button
                key={texto}
                onClick={() => onSuggestion(texto)}
                disabled={isLoading}
                className="cursor-pointer rounded-full border border-line bg-card px-4 py-2.5 font-mono text-[13px] text-soft transition-colors hover:border-primary hover:text-foreground disabled:opacity-60"
              >
                {texto}
              </button>
            ))}
          </div>
        </div>
        <div className="flex w-full max-w-[420px] shrink-0 flex-col overflow-hidden rounded-[18px] border border-line bg-card shadow-[0_40px_90px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-3 border-b border-line px-5 py-4">
            <span className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-primary font-mono text-[13px] font-bold text-white">
              IA
            </span>
            <span className="flex flex-col">
              <span className="text-[15px] font-bold">Asistente {site.name.toLowerCase()}</span>
              <span className="text-xs text-[#1DAB61]">● en línea</span>
            </span>
          </div>
          <div ref={chatRef} className="flex h-[320px] flex-col gap-3 overflow-y-auto p-5">
            {messages.length === 0 && !hasError && (
              <div className="self-start rounded-xl rounded-bl-[4px] bg-[#10192A] px-3.5 py-[11px] text-sm leading-[1.5] text-foreground">
                Hola 👋 Soy el asistente de {site.name.toLowerCase()}. Pregúntame por precios, plazos o
                cómo funciona la demo gratis.
              </div>
            )}
            {messages.map((m) => (
              <div
                key={m.id}
                className={`max-w-[85%] px-3.5 py-[11px] text-sm leading-[1.5] ${
                  m.role === "user"
                    ? "self-end rounded-xl rounded-br-[4px] bg-primary text-white"
                    : "self-start rounded-xl rounded-bl-[4px] bg-[#10192A] text-foreground"
                }`}
              >
                {m.content}
              </div>
            ))}
            {isLoading && (
              <div className="self-start rounded-xl rounded-bl-[4px] bg-[#10192A] px-3.5 py-[11px] text-sm text-soft">
                escribiendo…
              </div>
            )}
            {hasError && (
              <div className="self-start rounded-xl rounded-bl-[4px] bg-[#10192A] px-3.5 py-[11px] text-sm text-soft">
                El asistente no está disponible en este momento. Escríbeme directo al {site.email}.
              </div>
            )}
          </div>
          <form onSubmit={onSubmit} className="flex gap-2.5 border-t border-line p-4">
            <input
              value={input}
              onChange={onInputChange}
              onFocus={onInputFocus}
              autoFocus={inputAutoFocus}
              placeholder="Escribe tu pregunta…"
              aria-label="Pregunta para el asistente"
              className="flex-1 rounded-full border border-line bg-background px-[18px] py-3 text-sm text-foreground outline-none focus:border-primary"
            />
            <button
              type="submit"
              aria-label="Enviar"
              className="h-11 w-11 cursor-pointer rounded-full bg-primary text-[17px] text-white transition-colors hover:bg-primary-hover"
            >
              →
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
