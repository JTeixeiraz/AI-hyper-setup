import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
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

// O lang diz ao leitor de tela em que idioma pronunciar, e e o que um buscador
// le ao indexar. Nao e detalhe de vitrine.
const marcarLang = (l: Lingua) => {
  document.documentElement.lang = l === "pt" ? "pt-BR" : "en";
};

export function ProvedorLingua({ children }: { children: ReactNode }) {
  const [lingua, setLingua] = useState<Lingua>(detectar);

  // Tambem na montagem, nao so na troca: o index.html crava pt-BR, entao um
  // visitante detectado como `en` ficava com lang="pt-BR" ate clicar no
  // seletor — leitor de tela pronunciando ingles com fonologia portuguesa.
  useEffect(() => { marcarLang(lingua); }, [lingua]);

  const trocar = (l: Lingua) => {
    setLingua(l);
    marcarLang(l);
  };

  return (
    <Ctx.Provider value={{ t: DICIONARIOS[lingua], lingua, trocar }}>
      {children}
    </Ctx.Provider>
  );
}

export const useLingua = () => useContext(Ctx);
