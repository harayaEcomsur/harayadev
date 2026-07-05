"use client";

import { useChat } from "ai/react";
import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { site } from "@/lib/site";

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({ api: "/api/chat" });

  return (
    <div className="fixed bottom-4 right-4 z-50 sm:right-6">
      {open && (
        <div className="mb-3 flex h-[28rem] w-[20rem] flex-col overflow-hidden rounded-2xl border border-black/10 bg-background shadow-2xl sm:w-[22rem]">
          <div className="flex items-center justify-between bg-primary px-4 py-3 text-white">
            <span className="font-heading text-sm font-semibold">{site.name}</span>
            <button onClick={() => setOpen(false)} aria-label="Cerrar chat">
              <X size={18} />
            </button>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto px-3 py-3 text-sm">
            {messages.length === 0 && !error && (
              <p className="text-foreground/60">
                ¡Hola! Soy el asistente de {site.name}. Pregúntame sobre servicios, proyectos o cómo trabajar
                conmigo.
              </p>
            )}
            {messages.map((m) => (
              <div
                key={m.id}
                className={`max-w-[85%] rounded-xl px-3 py-2 ${
                  m.role === "user" ? "ml-auto bg-primary text-white" : "bg-black/5"
                }`}
              >
                {m.content}
              </div>
            ))}
            {isLoading && <p className="text-xs text-foreground/50">Escribiendo…</p>}
            {error && (
              <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
                El chat no está disponible en este momento. Escríbeme directamente por{" "}
                <a href="/contacto" className="underline">
                  Contacto
                </a>
                .
              </p>
            )}
          </div>
          <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-black/10 p-2">
            <input
              value={input}
              onChange={handleInputChange}
              placeholder="Escribe tu mensaje…"
              aria-label="Mensaje"
              className="flex-1 rounded-full border border-black/10 px-3 py-2 text-sm outline-none focus:border-primary"
            />
            <button type="submit" aria-label="Enviar" className="rounded-full bg-primary p-2 text-white">
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Cerrar chat" : "Abrir chat"}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-transform hover:scale-105"
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
}
