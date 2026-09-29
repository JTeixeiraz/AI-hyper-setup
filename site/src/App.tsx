import { useLingua } from "./i18n";
import { Comando } from "./componentes/Comando";
import { Abas } from "./componentes/Abas";
import { Inventario } from "./componentes/Inventario";
import { Lingua } from "./componentes/Lingua";

const UPSTREAMS = [
  ["AgriciDaniel/claude-seo", 33, "MIT"],
  ["sumeet0701/ResumeSkills", 22, "MIT"],
  ["charlie947/social-media-skills", 17, "MIT"],
  ["nextlevelbuilder/ui-ux-pro-max-skill", 7, "MIT"],
  ["pbakaus/impeccable", 2, "Apache-2.0"],
  ["OSideMedia/higgsfield-ai-prompt-skill", 1, "MIT"],
] as const;

const AGENTES = [
  ["Claude Code", "~/.claude/skills/"],
  ["Codex", "~/.codex/skills/"],
  ["Antigravity (agy)", "~/.gemini/config/skills/"],
] as const;

export function App() {
  const { t } = useLingua();

  return (
    <>
      <header className="cabecalho">
        <span className="marca">AI Hyper Setup</span>
        <Lingua />
      </header>

      <main>
        <section className="heroi">
          <h1>{t.titulo}</h1>
          <p className="subtitulo">{t.subtitulo}</p>
          <Comando />
          <p className="nota">{t.heroiNota}</p>
        </section>

        <section className="painel">
          <h2>{t.instalarTitulo}</h2>
          <Abas />
          <p className="nota">{t.instalarNota}</p>
          <h3>{t.depoisTitulo}</h3>
          <p>{t.depoisTexto}</p>
        </section>

        <section>
          <h2>{t.inventarioTitulo}</h2>
          <Inventario />
        </section>

        <section className="painel">
          <h2>{t.respeitaTitulo}</h2>
          <p>{t.respeitaTexto}</p>
        </section>

        <section>
          <h2>{t.agentesTitulo}</h2>
          <table>
            <tbody>
              {AGENTES.map(([nome, dir]) => (
                <tr key={nome}>
                  <td>{nome}</td>
                  <td>
                    <code>{dir}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section>
          <h2>{t.licencasTitulo}</h2>
          <p>{t.licencasTexto}</p>
          <table>
            <tbody>
              {UPSTREAMS.map(([repo, n, lic]) => (
                <tr key={repo}>
                  <td>
                    <a href={`https://github.com/${repo}`}>{repo}</a>
                  </td>
                  <td>{n}</td>
                  <td>{lic}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>

      <footer>
        <a href="https://github.com/JTeixeiraz/AI-hyper-setup">GitHub</a>
      </footer>
    </>
  );
}
