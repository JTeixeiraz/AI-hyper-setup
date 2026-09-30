#!/usr/bin/env node
// Hook de SessionStart: procura no vault um MOC do projeto atual e o injeta
// no contexto. Falha em silencio — um hook que quebra impede a sessao de abrir,
// e nao ter contexto do cerebro e melhor que nao ter sessao.
import { readFileSync, existsSync } from "node:fs";
import { basename, join } from "node:path";

// A skill substitui {{VAULT}} por um caminho ja escapado como literal JSON,
// aspas incluidas. Num caminho do Windows (C:\Users\...) a barra invertida
// sem escape colapsaria — \U vira U, sem erro — e o VAULT apontaria para o
// lugar errado, com existsSync dando falso e o hook calado.
const VAULT = {{VAULT}};

try {
  if (!existsSync(VAULT)) process.exit(0);
  // Indexado pelo nome do diretorio: dois projetos com a mesma pasta em
  // caminhos diferentes compartilhariam o MOC. Aceita tambem um nome
  // explicito em .hyper-projeto, que desempata sem exigir renomear pasta.
  let projeto = basename(process.cwd());
  const apelido = join(process.cwd(), ".hyper-projeto");
  if (existsSync(apelido)) {
    const lido = readFileSync(apelido, "utf8").trim();
    if (lido) projeto = lido;
  }

  const moc = join(VAULT, `${projeto}.md`);
  if (!existsSync(moc)) process.exit(0);

  const texto = readFileSync(moc, "utf8");
  console.log(`# Cerebro — ${projeto}\n\n${texto}`);
} catch {
  process.exit(0);
}
