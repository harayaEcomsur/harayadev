"use client";

import { trackEvent } from "@/lib/analytics";

import { useChat } from "ai/react";
import { useEffect, useRef } from "react";
import { DemoChatView } from "./DemoChatView";

// Versión viva de la demo: se monta recién con la primera interacción
// (DemoChat la carga dinámicamente). Si la activación fue un click en una
// sugerencia, initialPrompt la envía apenas monta.
export function DemoChatLive({ initialPrompt, autoFocus }: { initialPrompt?: string; autoFocus?: boolean }) {
  const { messages, input, handleInputChange, handleSubmit, append, isLoading, error } = useChat({
    api: "/api/chat",
  });
  const chatRef = useRef<HTMLDivElement>(null);
  const sentInitial = useRef(false);

  useEffect(() => {
    if (initialPrompt && !sentInitial.current) {
      sentInitial.current = true;
      append({ role: "user", content: initialPrompt });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const el = chatRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, isLoading]);

  return (
    <DemoChatView
      messages={messages}
      input={input}
      isLoading={isLoading}
      hasError={Boolean(error)}
      onSuggestion={(texto) => append({ role: "user", content: texto })}
      onInputChange={handleInputChange}
      onSubmit={(e) => {
        if (input.trim()) trackEvent("chat_usado", { origen: "home" });
        handleSubmit(e);
      }}
      inputAutoFocus={autoFocus}
      chatRef={chatRef}
    />
  );
}
