import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Mismo isotipo que app/icon.svg, rasterizado a PNG para apple-touch-icon.
// Sin esquinas redondeadas propias: iOS aplica su máscara sobre el cuadrado completo.
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" fill="#FF3D3D"/><path d="M102 216 L184 283 L102 350" fill="none" stroke="#fff" stroke-width="34" stroke-linecap="round" stroke-linejoin="round"/><rect x="214" y="330" width="110" height="26" rx="10" fill="#fff"/><rect x="354" y="210" width="55" height="146" rx="12" fill="#fff"/></svg>`;

export default function AppleIcon() {
  return new ImageResponse(
    (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={`data:image/svg+xml,${encodeURIComponent(svg)}`}
        alt=""
        width={180}
        height={180}
      />
    ),
    size
  );
}
