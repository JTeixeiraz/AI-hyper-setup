import { useEffect, useState } from "react";
import manifesto from "../../manifesto.json";
import { useLingua } from "./i18n";
import { Comando } from "./componentes/Comando";
import { Lingua } from "./componentes/Lingua";
import { Revela } from "./componentes/Revela";
import { Escudo, Certo, Marca } from "./componentes/Icones";

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
  ["Antigravity", "~/.gemini/config/skills/"],
] as const;

// As contagens vem do manifesto, nao digitadas a mao: o site nao pode
// envelhecer em relacao ao produto.
const COM_FONTE = manifesto.skills.filter((s) => s.origem !== "agente").length;
const SEM_FONTE = manifesto.skills.filter((s) => s.origem === "agente").length;

function useRolou() {
  const [rolou, setRolou] = useState(false);
  useEffect(() => {
    const ao = () => setRolou(window.scrollY > 8);
    ao();
    window.addEventListener("scroll", ao, { passive: true });
    return () => window.removeEventListener("scroll", ao);
  }, []);
  return rolou;
}

export function App() {
  const { t } = useLingua();
  const rolou = useRolou();

  const passos = [
    [t.passo1t, t.passo1d],
    [t.passo2t, t.passo2d],
    [t.passo3t, t.passo3d],
  ];

  return (
    <>
      <header className="cabecalho" data-rolou={rolou ? "sim" : "nao"}>
        <div className="casca">
          <span className="marca">
            <Marca />
            AI Hyper Setup
          </span>
          <Lingua />
        </div>
      </header>

      <main>
        <section className="heroi casca">
          <h1>{t.titulo}</h1>
          <p className="sub">{t.subtitulo}</p>
          <Comando />
          <p className="selo">
            <Escudo size={15} />
            {t.heroiNota}
          </p>
        </section>

        <section className="casca">
          <h2>{t.passosTitulo}</h2>
          <Revela>
            <ol className="passos">
              {passos.map(([titulo, desc], i) => (
                <li key={titulo} style={{ ["--i" as string]: i }}>
                  <div>
                    <strong>{titulo}</strong>
                    <span>{desc}</span>
                  </div>
                </li>
              ))}
            </ol>
          </Revela>
          <p className="legenda" style={{ marginTop: "var(--e-2)", fontSize: "var(--t-pequeno)" }}>
            {t.instalarNota}
          </p>
        </section>

        <section className="casca">
          <h2>{t.inventarioTitulo}</h2>
          <Revela>
            <dl className="linhas">
              <div style={{ ["--i" as string]: 0 }}>
                <dt>{t.inventarioSkills}</dt>
                <dd>
                  <span className="numero">{COM_FONTE}</span>
                </dd>
              </div>
              <div style={{ ["--i" as string]: 1 }}>
                <dt>{t.inventarioMcps}</dt>
                <dd>
                  <span className="numero">{manifesto.mcps.length}</span>
                </dd>
              </div>
              <div style={{ ["--i" as string]: 2 }}>
                <dt>RTK</dt>
                <dd className="desc">{t.inventarioFerramentas}</dd>
              </div>
              <div style={{ ["--i" as string]: 3 }}>
                <dt>Obsidian</dt>
                <dd className="desc">{t.inventarioObsidian}</dd>
              </div>
            </dl>
          </Revela>
        </section>

        <section className="casca">
          <div className="painel">
            <h2>{t.respeitaTitulo}</h2>
            <p>{t.respeitaTexto}</p>
            <ul className="garantias">
              <li>
                <Certo />
                <span>
                  <b>{t.garantia1t}</b> {t.garantia1d}
                </span>
              </li>
              <li>
                <Certo />
                <span>
                  <b>{t.garantia2t}</b> {t.garantia2d}
                </span>
              </li>
              <li>
                <Certo />
                <span>
                  <b>{t.garantia3t}</b> {t.garantia3d}
                </span>
              </li>
            </ul>
          </div>
        </section>

        <section className="casca">
          <h2>{t.agentesTitulo}</h2>
          <p className="legenda">{t.agentesSkills}</p>
          <div className="linhas">
            {AGENTES.map(([nome, dir]) => (
              <div key={nome}>
                <span className="rotulo">{nome}</span>
                <span className="valor">{dir}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="casca">
          <h2>{t.licencasTitulo}</h2>
          <p className="legenda">{t.licencasTexto}</p>
          <div className="linhas">
            {UPSTREAMS.map(([repo, n, lic]) => (
              <div key={repo}>
                <span className="rotulo">
                  <a href={`https://github.com/${repo}`}>{repo}</a>
                </span>
                <span className="valor">
                  {n} · {lic}
                </span>
              </div>
            ))}
          </div>
          <p className="legenda" style={{ marginTop: "var(--e-2)", fontSize: "var(--t-pequeno)" }}>
            {t.semFonte.replace("{n}", String(SEM_FONTE))}
          </p>
        </section>
      </main>

      <footer className="casca">
        <div className="rodape">
          <span>MIT · JTeixeiraz</span>
          <a href="https://github.com/JTeixeiraz/AI-hyper-setup">GitHub</a>
        </div>
      </footer>
    </>
  );
}
