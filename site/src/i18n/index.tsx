import { createContext, useContext, useState, type ReactNode } from "react";
import { pt, type Dicionario } from "./pt";
import { en } from "./en";

type Lingua = "pt" | "en";
const DICIONARIOS: Record<Lingua, Dicionario> = { pt, en };

// navigator.languages respeita a ordem de preferencia configurada no sistema,
// diferente de navigator.language, que so da a primeira.
function detectar(): Lingua {
  for (const l of navigator.languages ?? []) {
    if (l.startsWith("pt")) return "pt";
    if (l.startsWith("en")) return "en";
  }
  return "en";
}

const Ctx = createContext<{
  t: Dicionario;
  lingua: Lingua;
  trocar: (l: Lingua) => void;
}>({ t: pt, lingua: "pt", trocar: () => {} });

export function ProvedorLingua({ children }: { children: ReactNode }) {
  const [lingua, setLingua] = useState<Lingua>(detectar);

  const trocar = (l: Lingua) => {
    setLingua(l);
    // O lang diz ao leitor de tela em que idioma pronunciar, e e o que um
    // buscador le ao indexar. Nao e detalhe de vitrine.
    document.documentElement.lang = l === "pt" ? "pt-BR" : "en";
  };

  return (
    <Ctx.Provider value={{ t: DICIONARIOS[lingua], lingua, trocar }}>
      {children}
    </Ctx.Provider>
  );
}

export const useLingua = () => useContext(Ctx);
