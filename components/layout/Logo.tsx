import Link from "next/link";

// Chip del isotipo: cuadrado rojo con esquinas ~21% y glifo mono blanco (">", "_"
// y barra de cursor), según el handoff de marca (design_handoff_logo_harayadev).
export function LogoChip({ size = 34 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      role="img"
      aria-hidden="true"
      focusable="false"
    >
      <rect width="512" height="512" rx="107" fill="#FF3D3D" />
      <path
        d="M102 216 L184 283 L102 350"
        fill="none"
        stroke="#fff"
        strokeWidth="34"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="214" y="330" width="110" height="26" rx="10" fill="#fff" />
      <rect x="354" y="210" width="55" height="146" rx="12" fill="#fff" />
    </svg>
  );
}

// Imagotipo: chip + wordmark, separables (nav, footer, documentos).
export function Logo({
  chipSize = 34,
  textClassName = "text-2xl",
  onClick,
}: {
  chipSize?: number;
  textClassName?: string;
  onClick?: () => void;
}) {
  return (
    <Link href="/" className="flex items-center gap-2.5" onClick={onClick}>
      <LogoChip size={chipSize} />
      <span className={`font-black tracking-tight text-foreground ${textClassName}`}>
        Haraya<span className="text-primary">Dev</span>
      </span>
    </Link>
  );
}
