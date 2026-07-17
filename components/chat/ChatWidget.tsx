"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, X } from "lucide-react";

// El panel (con ai/react) se carga recién cuando alguien abre el chat; el
// launcher es lo único que se hidrata en cada página.
const ChatPanel = dynamic(() => import("./ChatPanel").then((m) => m.ChatPanel), { ssr: false });

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // La home ya tiene la demo de chat inline — el widget flotante ahí sería redundante.
  if (pathname === "/") return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 sm:right-6 print:hidden">
      {open && <ChatPanel onClose={() => setOpen(false)} />}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Cerrar chat" : "Abrir chat"}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
}
