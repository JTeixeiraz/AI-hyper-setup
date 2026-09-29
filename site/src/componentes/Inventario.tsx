import manifesto from "../../../manifesto.json";
import { useLingua } from "../i18n";

export function Inventario() {
  const { t } = useLingua();
  // As contagens vem do manifesto, nao digitadas a mao: o site nao pode
  // envelhecer em relacao ao produto.
  const skills = manifesto.skills.filter((s) => s.origem !== "agente").length;

  return (
    <ul className="inventario">
      <li>
        <strong>{skills}</strong> {t.inventarioSkills}
      </li>
      <li>
        <strong>{manifesto.mcps.length}</strong> {t.inventarioMcps}
      </li>
      <li>{t.inventarioFerramentas}</li>
      <li>{t.inventarioObsidian}</li>
    </ul>
  );
}
