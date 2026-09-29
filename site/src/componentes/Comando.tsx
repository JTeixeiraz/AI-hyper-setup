import { useState } from "react";
import { Copia, Certo } from "./Icones";
import { useLingua } from "../i18n";

const COMANDO =
  "curl -fsSL https://raw.githubusercontent.com/JTeixeiraz/AI-hyper-setup/main/instalar.sh | bash";

export function Comando() {
  const { t } = useLingua();
  const [copiado, setCopiado] = useState(false);

  async function copiar() {
    try {
      await navigator.clipboard.writeText(COMANDO);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2200);
    } catch {
      // Clipboard bloqueado (http, permissao negada): o texto continua
      // selecionavel, entao nao ha o que consertar aqui.
    }
  }

  return (
    <div className="comando">
      <div className="linha">
        <code>
          <span className="cifrao">$</span>
          {COMANDO}
        </code>
      </div>
      <button className="copiar" onClick={copiar}>
        {copiado ? <Certo /> : <Copia />}
        {copiado ? t.copiado : t.copiar}
      </button>
    </div>
  );
}
