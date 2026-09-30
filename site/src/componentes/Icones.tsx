// SVG desenhado, nao imagem importada nem emoji: herda a cor do contexto e
// fica nitido em qualquer densidade. stroke-width 1.6 casa com o peso do texto.
const base = {
  width: 16,
  height: 16,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export const Escudo = (p: { size?: number }) => (
  <svg {...base} width={p.size ?? 16} height={p.size ?? 16}>
    <path d="M12 3l7 3v5c0 4.4-2.9 8.4-7 10-4.1-1.6-7-5.6-7-10V6l7-3z" />
  </svg>
);

export const Copia = () => (
  <svg {...base} width={14} height={14}>
    <rect x="9" y="9" width="11" height="11" rx="2" />
    <path d="M5 15V5a2 2 0 012-2h8" />
  </svg>
);

export const Certo = () => (
  <svg {...base} width={14} height={14}>
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

export const Marca = () => (
  <svg {...base} width={19} height={19} strokeWidth={1.7}>
    <path d="M4 7l8-4 8 4v10l-8 4-8-4V7z" />
    <path d="M12 3v18M4 7l8 4 8-4" />
  </svg>
);

export const Terminal = () => (
  <svg {...base} width={14} height={14}>
    <rect x="2.5" y="4" width="19" height="16" rx="2" />
    <path d="M7 9l3 3-3 3M13 15h4" />
  </svg>
);

export const Faisca = () => (
  <svg {...base} width={14} height={14}>
    <path d="M12 3l2.1 5.4L19.5 10l-5.4 2.1L12 17.5l-2.1-5.4L4.5 10l5.4-1.6L12 3z" />
  </svg>
);

export const Seta = () => (
  <svg {...base} width={16} height={16}>
    <path d="M12 5v14M6 13l6 6 6-6" />
  </svg>
);
