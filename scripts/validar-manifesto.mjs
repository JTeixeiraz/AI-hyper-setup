// Duas verificacoes separadas de proposito: a de estrutura roda em todo PR e
// e rapida; a de rede roda semanalmente e depende de o GitHub estar no ar.
import { readFileSync } from "node:fs";

export function validarEstrutura(m) {
  const erros = [];
  if (m.versao !== 1) erros.push(`versao inesperada: ${m.versao}`);

  const vistos = new Set();
  for (const s of m.skills ?? []) {
    if (!s.nome) { erros.push("skill sem nome"); continue; }
    if (vistos.has(s.nome)) erros.push(`nome duplicado: ${s.nome}`);
    vistos.add(s.nome);

    if (s.origem === "git" && !s.repo)     erros.push(`${s.nome}: origem git sem repo`);
    if (s.origem === "git" && !s.subpasta) erros.push(`${s.nome}: origem git sem subpasta`);
    if (s.origem === "git" && !s.licenca)  erros.push(`${s.nome}: origem git sem licenca`);
    if (s.origem === "bundled" && !s.caminho) erros.push(`${s.nome}: bundled sem caminho`);
    if (s.origem === "uv-tool" && !s.pacote)  erros.push(`${s.nome}: uv-tool sem pacote`);
  }
  return { erros };
}

// Confere tres coisas contra os repositorios de verdade: que respondem, que a
// licenca nao mudou, e que CADA SUBPASTA EXISTE.
//
// A ultima e a que dolia: 16 skills apontavam para caminhos inexistentes e a
// instalacao as pulava em silencio, com a suite toda verde. Um caminho errado
// no manifesto e invisivel ate alguem clonar e olhar.
export async function validarRede(m) {
  const erros = [];
  const porRepo = new Map();
  for (const s of m.skills) {
    if (!s.repo) continue;
    if (!porRepo.has(s.repo)) porRepo.set(s.repo, { licenca: s.licenca, subpastas: [] });
    if (s.subpasta) porRepo.get(s.repo).subpastas.push([s.nome, s.subpasta]);
  }

  for (const [repo, info] of porRepo) {
    const slug = repo.replace("https://github.com/", "");
    const cab = { accept: "application/vnd.github+json" };

    const r = await fetch(`https://api.github.com/repos/${slug}`, { headers: cab });
    if (!r.ok) { erros.push(`${slug}: respondeu ${r.status}`); continue; }
    const dados = await r.json();
    const atual = dados.license?.spdx_id ?? "<sem licenca>";
    if (atual !== info.licenca) {
      erros.push(`${slug}: licenca mudou de ${info.licenca} para ${atual}`);
    }

    const t = await fetch(
      `https://api.github.com/repos/${slug}/git/trees/${dados.default_branch}?recursive=1`,
      { headers: cab },
    );
    if (!t.ok) { erros.push(`${slug}: nao consegui listar a arvore (${t.status})`); continue; }
    const arvore = await t.json();
    if (arvore.truncated) {
      erros.push(`${slug}: arvore truncada pela API; nao da para conferir as subpastas`);
      continue;
    }
    const dirs = new Set(arvore.tree.filter((n) => n.type === "tree").map((n) => n.path));

    for (const [nome, sub] of info.subpastas) {
      // "." e o proprio repositorio: nao aparece na arvore, e sempre existe.
      if (sub === "." || dirs.has(sub)) continue;
      erros.push(`${slug}: ${nome} aponta para "${sub}", que nao existe no repositorio`);
    }
  }
  return { erros };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const m = JSON.parse(readFileSync("manifesto.json", "utf8"));
  const { erros } = validarEstrutura(m);
  if (process.argv.includes("--rede")) {
    erros.push(...(await validarRede(m)).erros);
  }
  if (erros.length) {
    for (const e of erros) console.error(`  ${e}`);
    process.exit(1);
  }
  console.log(`manifesto valido: ${m.skills.length} skills`);
}
