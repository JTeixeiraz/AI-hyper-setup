// Os numeros do README envelhecem calados. Este script confere cada um contra
// o manifesto e as fontes, e roda no CI: sincronizar a mao funciona uma vez e
// desanda na alteracao seguinte.
import { readFileSync } from "node:fs";

const manifesto = JSON.parse(readFileSync("manifesto.json", "utf8"));
const upstreams = JSON.parse(readFileSync("fontes/upstreams.json", "utf8"));
const readme = readFileSync("README.md", "utf8");

const comFonte = manifesto.skills.filter((s) => s.origem !== "agente").length;
const semFonte = manifesto.skills.filter((s) => s.origem === "agente").length;

const erros = [];

const achar = (re, rotulo) => {
  const m = readme.match(re);
  if (!m) { erros.push(`${rotulo}: nao encontrei o trecho no README`); return null; }
  return Number(m[1]);
};

const a = achar(/\*\*(\d+) skills\*\* com fonte conhecida/, "skills com fonte");
if (a !== null && a !== comFonte) erros.push(`skills com fonte: README diz ${a}, manifesto tem ${comFonte}`);

const b = achar(/Outras \*\*(\d+) skills\*\*/, "skills sem fonte");
if (b !== null && b !== semFonte) erros.push(`skills sem fonte: README diz ${b}, manifesto tem ${semFonte}`);

// Cada upstream: contagem e licenca da tabela do README contra as fontes.
for (const [chave, u] of Object.entries(upstreams)) {
  const slug = u.repo.replace("https://github.com/", "");
  const quantas = manifesto.skills.filter((s) => s.repo === u.repo).length;
  if (quantas === 0) continue;
  const linha = readme.split("\n").find((l) => l.includes(slug) && l.startsWith("|"));
  if (!linha) { erros.push(`${chave}: sem linha na tabela do README`); continue; }
  const cols = linha.split("|").map((c) => c.trim());
  if (Number(cols[2]) !== quantas) erros.push(`${chave}: README diz ${cols[2]} skills, manifesto tem ${quantas}`);
  if (cols[3] !== u.licenca) erros.push(`${chave}: README diz licenca ${cols[3]}, fontes dizem ${u.licenca}`);
}

if (erros.length) {
  console.error("numeros do README fora de sincronia:");
  for (const e of erros) console.error(`  ${e}`);
  process.exit(1);
}
console.log(`README confere: ${comFonte} com fonte, ${semFonte} sem, ${Object.keys(upstreams).length} upstreams`);
