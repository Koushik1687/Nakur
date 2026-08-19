interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

/** Stylised lotus — the recurring motif of the Bengal School / alpana art. */
export function Lotus({ size = 120, color = "currentColor", className }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden="true"
    >
      <g fill={color}>
        <path d="M50 16 C57 38 57 60 50 82 C43 60 43 38 50 16 Z" />
        <path d="M50 30 C39 35 27 46 25 62 C40 57 49 48 50 30 Z" />
        <path d="M50 36 C33 45 21 60 23 78 C41 67 49 53 50 36 Z" />
        <path d="M50 30 C61 35 73 46 75 62 C60 57 51 48 50 30 Z" />
        <path d="M50 36 C67 45 79 60 77 78 C59 67 51 53 50 36 Z" />
        <path
          d="M28 82 C40 77 60 77 72 82 C60 89 40 89 28 82 Z"
          opacity="0.55"
        />
      </g>
    </svg>
  );
}

/** Hand-drawn alpana divider: a central lotus with scrolling leaf lines. */
export function FolkDivider({ color = "currentColor" }: { color?: string }) {
  return (
    <div className="folk-divider" aria-hidden="true" style={{ color }}>
      <span className="folk-line" />
      <Lotus size={46} color={color} />
      <span className="folk-line" />
    </div>
  );
}
