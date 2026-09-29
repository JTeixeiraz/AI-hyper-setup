import { useEffect, useRef, type ReactNode } from "react";

// A revelacao so translada — a opacidade nunca e tocada, nem aqui nem no CSS.
// Um reveal que esconde conteudo entrega a secao em branco sempre que a
// transicao nao dispara, e o custo disso e alto demais para um efeito.
export function Revela({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (typeof IntersectionObserver === "undefined") return;

    // So desloca o que ainda esta abaixo da dobra; o que ja esta a vista
    // nao deve pular quando o script roda.
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    el.dataset.visivel = "nao";
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.dataset.visivel = "sim";
          obs.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="revela" ref={ref} data-visivel="sim">
      {children}
    </div>
  );
}
