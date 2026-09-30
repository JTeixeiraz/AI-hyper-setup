// Funde fontes/upstreams.json com fontes/classificacao.json para produzir
// o manifesto.json que a skill consome. Separar as duas fontes evita repetir
// repo e licenca em cada uma das 75 skills que vem do mesmo punhado de repos.
import { readFileSync, writeFileSync } from "node:fs";

const ORIGENS = new Set([
  "git", "plugin", "uv-tool", "bundled", "builtin", "agente",
  "symlink-local", "EXCLUIDA",
]);

export function gerar(upstreams, classificacao) {
  const skills = [];

  for (const item of classificacao) {
    if (!ORIGENS.has(item.origem)) {
      throw new Error(`origem invalida: ${item.origem} (skill ${item.nome})`);
    }
    // Excluidas e symlinks locais ficam registrados na classificacao para
    // quem for ler o historico, mas nao viram instrucao de instalacao.
    if (item.origem === "EXCLUIDA" || item.origem === "symlink-local") continue;

    const skill = { nome: item.nome, origem: item.origem };

    if (item.origem === "git" || item.origem === "plugin") {
      const up = upstreams[item.upstream];
      if (!up) throw new Error(`upstream desconhecido: ${item.upstream} (skill ${item.nome})`);
      skill.repo = up.repo;
      skill.licenca = up.licenca;
      if (up.ignorar) skill.ignorar = up.ignorar;
      if (item.origem === "git") skill.subpasta = `${up.raiz}/${item.nome}`;
      if (item.origem === "plugin") skill.marketplace = up.marketplace;
    }

    for (const campo of ["pacote", "caminho", "descricao", "dica", "nota"]) {
      if (item[campo]) skill[campo] = item[campo];
    }

    skills.push(skill);
  }

  // Sem data de geracao: o CI confere `npm run manifesto && git diff
  // --exit-code`, e um campo que muda a cada dia faria todo push falhar a
  // partir do dia seguinte ao commit. O artefato precisa ser reproduzivel.
  return {
    versao: 1,
    skills,
    mcps: [
      { nome: "ruflo", comando: "npx",
        args: ["-y", "ruflo@latest", "mcp", "start"],
        env: { CLAUDE_FLOW_MODE: "v3", CLAUDE_FLOW_TOPOLOGY: "hierarchical-mesh" } },
      { nome: "ruv-swarm", comando: "npx",
        args: ["-y", "ruv-swarm", "mcp", "start"], env: {}, opcional: true },
    ],
    // O repo de cada marketplace vai junto: sem ele a skill teria de
    // adivinhar a fonte para registrar em extraKnownMarketplaces.
    marketplaces: {
      "claude-plugins-official": { source: "github", repo: "anthropics/claude-plugins-official" },
      "claude-code-plugins":     { source: "github", repo: "anthropics/claude-code" },
    },
    plugins: [
      { nome: "superpowers",     marketplace: "claude-plugins-official" },
      { nome: "frontend-design", marketplace: "claude-code-plugins" },
      { nome: "figma",           marketplace: "claude-plugins-official" },
    ],
    ferramentas: [
      { nome: "rtk",      verificar: "rtk --version" },
      { nome: "obsidian", verificar: "test -d ~/.config/obsidian" },
    ],
  };
}

// Executado diretamente: gera o arquivo. Importado: so exporta gerar().
if (import.meta.url === `file://${process.argv[1]}`) {
  const upstreams = JSON.parse(readFileSync("fontes/upstreams.json", "utf8"));
  const classificacao = JSON.parse(readFileSync("fontes/classificacao.json", "utf8"));
  const m = gerar(upstreams, classificacao);
  writeFileSync("manifesto.json", JSON.stringify(m, null, 2) + "\n");
  const conta = {};
  for (const s of m.skills) conta[s.origem] = (conta[s.origem] || 0) + 1;
  console.log(`manifesto.json: ${m.skills.length} skills`, conta);
}
