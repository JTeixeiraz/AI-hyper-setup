import { useState } from "react";
import { Copia, Certo, Terminal as IconeTerminal, Faisca } from "./Icones";

export const CURL =
  "curl -fsSL https://raw.githubusercontent.com/JTeixeiraz/AI-hyper-setup/main/instalar.sh | bash";
export const SKILL = "/hyper-setup-initialize";

type Props = {
  comando: string;
  /** terminal = shell do sistema; agente = dentro do Claude Code, Codex ou agy */
  onde: "terminal" | "agente";
  passo?: number;
  rotulo?: string;
  copiar: string;
  copiado: string;
};

export function Comando({ comando, onde, passo, rotulo, copiar, copiado }: Props) {
  const [feito, setFeito] = useState(false);

  async function aoCopiar() {
    try {
      await navigator.clipboard.writeText(comando);
      setFeito(true);
      setTimeout(() => setFeito(false), 2200);
    } catch {
      // Clipboard bloqueado (http, permissao negada): o texto continua
      // selecionavel, entao nao ha o que consertar aqui.
    }
  }

  return (
    <div className="passo-cmd" data-onde={onde}>
      {rotulo && (
        <div className="passo-cmd__rotulo">
          {passo && <span className="passo-cmd__n">{passo}</span>}
          {onde === "terminal" ? <IconeTerminal /> : <Faisca />}
          <span>{rotulo}</span>
        </div>
      )}
      <div className="comando">
        <div className="linha">
          <code>
            <span className="cifrao">{onde === "terminal" ? "$" : ">"}</span>
            {comando}
          </code>
        </div>
        <button className="copiar" onClick={aoCopiar}>
          {feito ? <Certo /> : <Copia />}
          {feito ? copiado : copiar}
        </button>
      </div>
    </div>
  );
}
