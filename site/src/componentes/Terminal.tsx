import { useEffect, useRef, useState } from "react";

type Linha = { txt: string; cor?: "cinza" | "acao" | "ok" | "forte"; pausa?: number };

// O que o instalador de verdade imprime, na ordem em que imprime. Uma
// simulacao que mostrasse outra coisa seria propaganda, nao demonstracao.
const ROTEIRO: Linha[] = [
  { txt: "$ curl -fsSL ...hyper-setup/instalar.sh | bash", cor: "forte", pausa: 620 },
  { txt: "AI Hyper Setup", cor: "forte", pausa: 200 },
  { txt: "sistema: linux x64", cor: "cinza", pausa: 160 },
  { txt: "agente: claude", cor: "cinza", pausa: 420 },
  { txt: "instalando o RTK...", cor: "cinza", pausa: 560 },
  { txt: "instalando o Obsidian...", cor: "cinza", pausa: 640 },
  { txt: "", pausa: 120 },
  { txt: "Terreno preparado.", cor: "ok", pausa: 300 },
  { txt: "Agora abra o claude e rode:", cor: "cinza", pausa: 200 },
  { txt: "    /hyper-setup-initialize", cor: "acao", pausa: 900 },
  { txt: "", pausa: 200 },
  { txt: "> /hyper-setup-initialize", cor: "forte", pausa: 700 },
  { txt: "inventariando 126 skills...", cor: "cinza", pausa: 900 },
  { txt: "", pausa: 160 },
  { txt: "INSTALADO AGORA (94)", cor: "ok", pausa: 180 },
  { txt: "  skills       seo (33) · resume (22) · social (17)", pausa: 120 },
  { txt: "  mcps         ruflo · ruv-swarm", pausa: 120 },
  { txt: "  ferramentas  rtk 0.50.0 · Obsidian 1.13.7", pausa: 420 },
  { txt: "", pausa: 160 },
  { txt: "JÁ ESTAVA INSTALADO (12)", cor: "acao", pausa: 180 },
  { txt: "  skills       graphify · brag · brag-slim", pausa: 120 },
  { txt: "  ferramentas  Obsidian 1.12.0", pausa: 0 },
];

export function Terminal() {
  const [ate, setAte] = useState(ROTEIRO.length);
  const corpo = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Só a partir daqui o estado vira parcial. O padrão é o roteiro inteiro
    // visível: se o efeito não rodar, o leitor vê o resultado, não uma caixa
    // vazia esperando uma animação que nunca vem.
    setAte(0);
    let i = 0;
    let t: number;
    const passo = () => {
      i += 1;
      setAte(i);
      if (i < ROTEIRO.length) t = window.setTimeout(passo, 90 + (ROTEIRO[i - 1].pausa ?? 0));
    };
    t = window.setTimeout(passo, 500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const el = corpo.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [ate]);

  const rodando = ate < ROTEIRO.length;

  return (
    <div className="term" aria-label="saída do instalador" role="img">
      <div className="term__topo">
        <span className="term__ponto" />
        <span className="term__ponto" />
        <span className="term__ponto" />
        <span className="term__nome">bash</span>
      </div>
      <div className="term__corpo" ref={corpo}>
        {ROTEIRO.slice(0, ate).map((l, i) => (
          <div key={i} className={l.cor ? `l l--${l.cor}` : "l"}>
            {l.txt || " "}
          </div>
        ))}
        {rodando && <span className="term__cursor" />}
      </div>
    </div>
  );
}
