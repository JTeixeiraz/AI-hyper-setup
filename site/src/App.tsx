import { useEffect, useState } from "react";
import manifesto from "../../manifesto.json";
import { useLingua } from "./i18n";
import { Comando } from "./componentes/Comando";
import { Lingua } from "./componentes/Lingua";
import { Terminal } from "./componentes/Terminal";
import { Skills } from "./componentes/Skills";
import { Escudo, Certo, Marca } from "./componentes/Icones";

const UPSTREAMS = [
  ["AgriciDaniel/claude-seo", 33, "MIT"],
  ["sumeet0701/ResumeSkills", 22, "MIT"],
  ["charlie947/social-media-skills", 17, "MIT"],
  ["nextlevelbuilder/ui-ux-pro-max-skill", 7, "MIT"],
  ["pbakaus/impeccable", 2, "Apache-2.0"],
  ["OSideMedia/higgsfield-ai-prompt-skill", 1, "MIT"],
] as const;

const COM_FONTE = manifesto.skills.filter((s) => s.origem !== "agente").length;
const SEM_FONTE = manifesto.skills.filter((s) => s.origem === "agente").length;
const TOTAL = manifesto.skills.length;

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

  const agentes = [
    ["Claude Code", "~/.claude/skills/", t.agenteClaude],
    ["Codex", "~/.codex/skills/", t.agenteCodex],
    ["Antigravity", "~/.gemini/config/skills/", t.agenteAgy],
  ] as const;

  const passos = [
    [t.passo1t, t.passo1d],
    [t.passo2t, t.passo2d],
    [t.passo3t, t.passo3d],
  ];

  return (
    <>
      <header className="cabecalho" data-rolou={rolou ? "sim" : "nao"}>
        <div className="larga cabecalho__linha">
          <span className="marca">
            <Marca />
            AI Hyper Setup
          </span>
          <Lingua />
        </div>
      </header>

      <main>
        {/* O heroi e escuro de ponta a ponta: e onde o terminal mora, e um
            terminal sobre papel branco seria um recorte, nao uma cena. */}
        <section className="heroi">
          <div className="larga heroi__grade">
            <div className="heroi__texto">
              <h1>{t.titulo}</h1>
              <p className="sub">{t.subtitulo}</p>
              <Comando />
              <p className="selo">
                <Escudo size={15} />
                {t.heroiNota}
              </p>
            </div>
            <Terminal />
          </div>
        </section>

        <section className="skills-secao">
          <div className="larga">
            <div className="skills-cab">
              <h2>
                <span className="conta">{TOTAL}</span> {t.skillsTitulo}
              </h2>
              <p className="legenda">{t.skillsTexto}</p>
            </div>
          </div>
          <Skills />
          <div className="larga">
            <p className="legenda pequena">
              {t.semFonte.replace("{n}", String(SEM_FONTE))}
            </p>
          </div>
        </section>

        <section className="larga">
          <div className="duas">
            <div>
              <h2>{t.passosTitulo}</h2>
              <ol className="passos">
                {passos.map(([titulo, desc]) => (
                  <li key={titulo}>
                    <strong>{titulo}</strong>
                    <span>{desc}</span>
                  </li>
                ))}
              </ol>
              <p className="legenda pequena">{t.instalarNota}</p>
            </div>

            <div className="painel">
              <h2>{t.respeitaTitulo}</h2>
              <p>{t.respeitaTexto}</p>
              <ul className="garantias">
                {[
                  [t.garantia1t, t.garantia1d],
                  [t.garantia2t, t.garantia2d],
                  [t.garantia3t, t.garantia3d],
                ].map(([b, d]) => (
                  <li key={b}>
                    <Certo />
                    <span>
                      <b>{b}</b> {d}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="larga">
          <h2>{t.agentesTitulo}</h2>
          <p className="legenda">{t.agentesSkills}</p>
          <div className="agentes">
            {agentes.map(([nome, dir, desc]) => (
              <div className="agente" key={nome}>
                <h3>{nome}</h3>
                <p>{desc}</p>
                <code>{dir}</code>
              </div>
            ))}
          </div>
        </section>

        <section className="larga">
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
        </section>

        <section className="larga chamada">
          <h2>{t.chamadaTitulo}</h2>
          <Comando />
          <p className="legenda pequena">
            {t.chamadaNota.replace("{n}", String(COM_FONTE))}
          </p>
        </section>
      </main>

      <footer className="larga">
        <div className="rodape">
          <span>MIT · JTeixeiraz</span>
          <a href="https://github.com/JTeixeiraz/AI-hyper-setup">GitHub</a>
        </div>
      </footer>
    </>
  );
}
