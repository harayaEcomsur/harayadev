"use client";

import { useEffect } from "react";
import { sendGAEvent } from "@next/third-parties/google";

// Un solo listener delegado cubre todos los links a WhatsApp del sitio (header,
// CTAs, servicios, contrato) sin tocar cada componente. El click a WhatsApp es
// el proxy de "pidió su demo" — el evento clave del funnel.
export function WhatsAppClickTracker() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const link = (e.target as HTMLElement).closest?.('a[href*="wa.me"], a[href*="whatsapp.com"]');
      if (!link) return;
      sendGAEvent("event", "whatsapp_click", {
        page: window.location.pathname,
      });
    }
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
