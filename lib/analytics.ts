import { sendGAEvent } from "@next/third-parties/google";

// Nuestros nombres de evento internos -> evento estándar de Meta (mejor
// optimización de campañas que un evento custom). Lo que no está acá se manda
// como trackCustom con el nombre tal cual.
const META_STANDARD_EVENTS: Record<string, string> = {
  demo_solicitada: "Lead",
  contrato_generado: "InitiateCheckout",
  whatsapp_click: "Contact",
};

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

// Envoltorio seguro: si GA4 o el Pixel de Meta no están configurados (faltan
// NEXT_PUBLIC_GA_ID / NEXT_PUBLIC_META_PIXEL_ID), cada uno se omite en
// silencio — el sitio funciona igual con, sin, o con solo uno de los dos.
export function trackEvent(name: string, params: Record<string, string> = {}) {
  if (process.env.NEXT_PUBLIC_GA_ID) sendGAEvent("event", name, params);

  if (process.env.NEXT_PUBLIC_META_PIXEL_ID && typeof window !== "undefined" && window.fbq) {
    const standard = META_STANDARD_EVENTS[name];
    if (standard) window.fbq("track", standard, params);
    else window.fbq("trackCustom", name, params);
  }
}
