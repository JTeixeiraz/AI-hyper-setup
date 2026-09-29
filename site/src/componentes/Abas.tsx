import { useState } from "react";

// O nome do sistema e o comando nao passam pelo dicionario: "Linux" se escreve
// igual nos dois idiomas, e um comando traduzido deixa de colar no terminal.
const SISTEMAS = [
  { nome: "Linux", nota: "" },
  { nome: "macOS", nota: "" },
  { nome: "Windows", nota: "Git Bash ou WSL" },
] as const;

export function Abas() {
  const [ativa, setAtiva] = useState(0);

  return (
    <div className="abas">
      <div role="tablist">
        {SISTEMAS.map((s, i) => (
          <button
            key={s.nome}
            role="tab"
            aria-selected={i === ativa}
            className={i === ativa ? "aba ativa" : "aba"}
            onClick={() => setAtiva(i)}
          >
            {s.nome}
          </button>
        ))}
      </div>
      {SISTEMAS[ativa].nota && <p className="nota">{SISTEMAS[ativa].nota}</p>}
    </div>
  );
}
