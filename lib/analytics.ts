import { sendGAEvent } from "@next/third-parties/google";

// Envoltorio seguro: si GA4 no está configurado (falta NEXT_PUBLIC_GA_ID),
// no hace nada — el sitio funciona igual con o sin analytics.
export function trackEvent(name: string, params: Record<string, string> = {}) {
  if (!process.env.NEXT_PUBLIC_GA_ID) return;
  sendGAEvent("event", name, params);
}
