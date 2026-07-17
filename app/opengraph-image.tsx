import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const runtime = "edge";
export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: 28,
          padding: "0 96px",
          background: "#060B14",
          backgroundImage: "radial-gradient(circle at 85% 15%, rgba(255,61,61,0.22), transparent 55%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 34, color: "#FF3D3D", letterSpacing: "0.14em" }}>
          {site.personName.toUpperCase()}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`data:image/svg+xml,${encodeURIComponent(
              '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" rx="107" fill="#FF3D3D"/><path d="M102 216 L184 283 L102 350" fill="none" stroke="#fff" stroke-width="34" stroke-linecap="round" stroke-linejoin="round"/><rect x="214" y="330" width="110" height="26" rx="10" fill="#fff"/><rect x="354" y="210" width="55" height="146" rx="12" fill="#fff"/></svg>'
            )}`}
            alt=""
            width={92}
            height={92}
          />
          <div style={{ display: "flex", fontSize: 84, fontWeight: 900, color: "#EDF0F4" }}>
            Haraya<span style={{ color: "#FF3D3D" }}>Dev</span>
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 40, color: "#98A3B3", maxWidth: 900, lineHeight: 1.3 }}>
          {site.tagline}
        </div>
        <div style={{ display: "flex", gap: 40, fontSize: 24, color: "#98A3B3", letterSpacing: "0.06em" }}>
          <span>✓ PRECIO CERRADO</span>
          <span>✓ DEMO ANTES DE PAGAR</span>
          <span>✓ IVA INCLUIDO</span>
        </div>
      </div>
    ),
    size
  );
}
