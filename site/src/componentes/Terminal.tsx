import { useEffect, useRef, useState } from "react";

export type Linha = { txt: string; cor?: "cinza" | "acao" | "ok" | "forte"; pausa?: number };

type Props = {
  roteiro: Linha[];
  titulo?: string;
  altura?: number;
  /** ms parado no fim antes de recomecar; 0 nao repete */
  repousa?: number;
};

// Mostra o roteiro inteiro por padrao. So depois que o efeito confirma que ha
// movimento permitido e que o terminal entrou em cena e que o estado vira
// parcial: se a animacao nunca rodar, o leitor ve o resultado, nao uma caixa
// vazia esperando.
export function Terminal({ roteiro, titulo = "bash", altura, repousa = 3200 }: Props) {
  const [ate, setAte] = useState(roteiro.length);
  const caixa = useRef<HTMLDivElement>(null);
  const corpo = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = caixa.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (typeof IntersectionObserver === "undefined") return;

    let t: number;
    let i = 0;
    let vivo = true;

    const passo = () => {
      if (!vivo) return;
      i += 1;
      setAte(i);
      if (i < roteiro.length) {
        t = window.setTimeout(passo, 85 + (roteiro[i - 1].pausa ?? 0));
      } else if (repousa > 0) {
        // O ciclo e o argumento: quem chega no meio da animacao ve o comeco
        // de novo em poucos segundos, sem precisar recarregar.
        t = window.setTimeout(() => {
          if (!vivo) return;
          i = 0;
          setAte(0);
          t = window.setTimeout(passo, 420);
        }, repousa);
      }
    };

    // So anima enquanto visivel: um terminal repetindo fora de tela gasta
    // bateria e nao e visto por ninguem.
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !vivo) {
          vivo = true;
          i = 0;
          setAte(0);
          t = window.setTimeout(passo, 420);
        } else if (!e.isIntersecting && vivo) {
          vivo = false;
          clearTimeout(t);
          setAte(roteiro.length);
        }
      },
      { threshold: 0.2 },
    );

    vivo = false;
    obs.observe(el);
    return () => {
      vivo = false;
      clearTimeout(t);
      obs.disconnect();
    };
  }, [roteiro, repousa]);

  useEffect(() => {
    const el = corpo.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [ate]);

  const rodando = ate < roteiro.length;

  return (
    <div
      className="term"
      ref={caixa}
      style={altura ? ({ ["--alt" as string]: `${altura}px` } as object) : undefined}
      aria-label="saída do instalador"
      role="img"
    >
      <div className="term__topo">
        <span className="term__ponto" />
        <span className="term__ponto" />
        <span className="term__ponto" />
        <span className="term__nome">{titulo}</span>
      </div>
      <div className="term__corpo" ref={corpo}>
        {roteiro.slice(0, ate).map((l, i) => (
          <div key={i} className={l.cor ? `l l--${l.cor}` : "l"}>
            {l.txt || " "}
          </div>
        ))}
        {rodando && <span className="term__cursor" />}
      </div>
    </div>
  );
}
