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

// Confere se cada repositorio ainda responde e se a licenca nao mudou.
// Um upstream que troca de licenca deixa de poder ser instalado automaticamente,
// e queremos saber disso por uma issue, nao por uma reclamacao.
export async function validarRede(m) {
  const erros = [];
  const repos = new Map();
  for (const s of m.skills) {
    if (s.repo) repos.set(s.repo, s.licenca);
  }

  for (const [repo, licencaEsperada] of repos) {
    const slug = repo.replace("https://github.com/", "");
    const r = await fetch(`https://api.github.com/repos/${slug}`, {
      headers: { accept: "application/vnd.github+json" },
    });
    if (!r.ok) { erros.push(`${slug}: respondeu ${r.status}`); continue; }
    const dados = await r.json();
    const atual = dados.license?.spdx_id ?? "<sem licenca>";
    if (atual !== licencaEsperada) {
      erros.push(`${slug}: licenca mudou de ${licencaEsperada} para ${atual}`);
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
