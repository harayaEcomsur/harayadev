"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { DemoChatView } from "./DemoChatView";

const DemoChatLive = dynamic(() => import("./DemoChatLive").then((m) => m.DemoChatLive), {
  ssr: false,
  // Mientras baja el chunk se sigue mostrando la vista estática — sin salto visual.
  loading: () => (
    <DemoChatView
      messages={[]}
      input=""
      isLoading={false}
      hasError={false}
      onSuggestion={() => {}}
      onInputChange={() => {}}
      onSubmit={(e) => e.preventDefault()}
    />
  ),
});

// Cáscara estática de la sección demo: idéntica a la versión viva pero sin
// ai/react en el JS inicial. La primera interacción (sugerencia o foco en el
// input) monta DemoChatLive, que ya trae el chat real.
export function DemoChat() {
  const [pending, setPending] = useState<{ prompt?: string; focus?: boolean } | null>(null);

  if (pending) {
    return <DemoChatLive initialPrompt={pending.prompt} autoFocus={pending.focus} />;
  }

  return (
    <DemoChatView
      messages={[]}
      input=""
      isLoading={false}
      hasError={false}
      onSuggestion={(texto) => setPending({ prompt: texto })}
      onInputFocus={() => setPending({ focus: true })}
      onInputChange={() => setPending({ focus: true })}
      onSubmit={(e) => {
        e.preventDefault();
        setPending({ focus: true });
      }}
    />
  );
}
