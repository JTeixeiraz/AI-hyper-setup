import { useEffect, useState } from "react";
import manifesto from "../../manifesto.json";
import upstreams from "../../fontes/upstreams.json";
import { useLingua } from "./i18n";
import { Comando, CURL, SKILL } from "./componentes/Comando";
import { Lingua } from "./componentes/Lingua";
import { Terminal } from "./componentes/Terminal";
import { COMPLETO, PASSO_1, PASSO_2, PASSO_3 } from "./componentes/roteiros";
import { Skills } from "./componentes/Skills";
import { Escudo, Certo, Marca, Seta } from "./componentes/Icones";

// Repositorio, contagem e licenca saem das fontes, nunca digitados. Uma
// licenca cravada aqui continuaria publicando "MIT" depois de um upstream
// trocar de licenca — o job semanal abriria a issue e o site seguiria mentindo.
type Upstream = { repo: string; licenca: string };
const UPSTREAMS = Object.entries(upstreams as Record<string, Upstream>)
  .map(([chave, u]) => ({
    repo: u.repo.replace("https://github.com/", ""),
    licenca: u.licenca,
    quantas: manifesto.skills.filter(
      (s) => "repo" in s && (s as { repo?: string }).repo === u.repo,
    ).length,
    chave,
  }))
  .filter((u) => u.quantas > 0)
  .sort((a, b) => b.quantas - a.quantas);

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

              {/* Os dois comandos ficam juntos e ambos copiaveis. O segundo e
                  a string que a pessoa precisa colar dentro do agente, e
                  deixa-la como texto solto era o maior atrito do fluxo. */}
              <div className="receita">
                <Comando
                  comando={CURL}
                  onde="terminal"
                  passo={1}
                  rotulo={t.ondeTerminal}
                  copiar={t.copiar}
                  copiado={t.copiado}
                />
                <div className="receita__elo" aria-hidden="true">
                  <Seta />
                  <span>{t.elo}</span>
                </div>
                <Comando
                  comando={SKILL}
                  onde="agente"
                  passo={2}
                  rotulo={t.ondeAgente}
                  copiar={t.copiar}
                  copiado={t.copiado}
                />
              </div>

              <p className="selo">
                <Escudo size={15} />
                {t.heroiNota}
              </p>
            </div>
            <Terminal roteiro={COMPLETO} />
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
          <h2>{t.passosTitulo}</h2>
          <p className="legenda">{t.passosTexto}</p>

          <ol className="fluxo">
            {[
              [t.passo1t, t.passo1d, PASSO_1, "bash", t.ondeTerminal],
              [t.passo2t, t.passo2d, PASSO_2, "bash", t.ondeTerminal],
              [t.passo3t, t.passo3d, PASSO_3, "claude", t.ondeAgente],
            ].map(([titulo, desc, roteiro, nome, onde], i) => (
              <li className="fluxo__passo" key={titulo as string}>
                <div className="fluxo__texto">
                  <span className="fluxo__n">{i + 1}</span>
                  <h3>{titulo as string}</h3>
                  <p>{desc as string}</p>
                  <span className="fluxo__onde">{onde as string}</span>
                </div>
                <Terminal
                  roteiro={roteiro as typeof PASSO_1}
                  titulo={nome as string}
                  altura={196}
                />
              </li>
            ))}
          </ol>
          <p className="legenda pequena">{t.instalarNota}</p>
        </section>

        <section className="larga">
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
            {UPSTREAMS.map((u) => (
              <div key={u.chave}>
                <span className="rotulo">
                  <a href={`https://github.com/${u.repo}`}>{u.repo}</a>
                </span>
                <span className="valor">
                  {u.quantas} · {u.licenca}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="larga chamada">
          <h2>{t.chamadaTitulo}</h2>
          <div className="receita receita--centro">
            <Comando
              comando={CURL}
              onde="terminal"
              passo={1}
              rotulo={t.ondeTerminal}
              copiar={t.copiar}
              copiado={t.copiado}
            />
            <div className="receita__elo" aria-hidden="true">
              <Seta />
              <span>{t.elo}</span>
            </div>
            <Comando
              comando={SKILL}
              onde="agente"
              passo={2}
              rotulo={t.ondeAgente}
              copiar={t.copiar}
              copiado={t.copiado}
            />
          </div>
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
