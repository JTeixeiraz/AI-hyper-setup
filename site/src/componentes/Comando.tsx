import { useState } from "react";

const COMANDO =
  "curl -fsSL https://raw.githubusercontent.com/JTeixeiraz/AI-hyper-setup/main/instalar.sh | bash";

export function Comando() {
  const [copiado, setCopiado] = useState(false);

  async function copiar() {
    try {
      await navigator.clipboard.writeText(COMANDO);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      // Clipboard bloqueado (http, permissao negada): o texto continua
      // selecionavel, entao nao ha o que consertar aqui.
    }
  }

  return (
    <div className="comando">
      <code>{COMANDO}</code>
      <button onClick={copiar} aria-label="copiar comando">
        {copiado ? "copiado" : "copiar"}
      </button>
    </div>
  );
}
