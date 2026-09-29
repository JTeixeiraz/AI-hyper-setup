import { useLingua } from "../i18n";

export function Lingua() {
  const { lingua, trocar } = useLingua();
  const outra = lingua === "pt" ? "en" : "pt";

  return (
    <button className="lingua" onClick={() => trocar(outra)}>
      {outra.toUpperCase()}
    </button>
  );
}
