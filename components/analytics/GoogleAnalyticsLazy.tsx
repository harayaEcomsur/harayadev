"use client";

import Script from "next/script";

// gtag.js se carga con lazyOnload (después de window.load) para no competir
// con la hidratación de React — era el mayor bloqueo del hilo principal en
// mobile. Los eventos disparados antes de que cargue quedan encolados en
// dataLayer y gtag.js los procesa al llegar, así que no se pierden mediciones.
export function GoogleAnalyticsLazy({ gaId }: { gaId: string }) {
  return (
    <>
      <Script id="ga-init" strategy="lazyOnload">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('js', new Date());
gtag('config', '${gaId}');`}
      </Script>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="lazyOnload" />
    </>
  );
}
