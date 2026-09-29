#!/usr/bin/env node
// Hook de SessionStart: procura no vault um MOC do projeto atual e o injeta
// no contexto. Falha em silencio — um hook que quebra impede a sessao de abrir,
// e nao ter contexto do cerebro e melhor que nao ter sessao.
import { readFileSync, existsSync } from "node:fs";
import { basename, join } from "node:path";

const VAULT = "{{VAULT}}";

try {
  if (!existsSync(VAULT)) process.exit(0);
  const projeto = basename(process.cwd());
  const moc = join(VAULT, `${projeto}.md`);
  if (!existsSync(moc)) process.exit(0);

  const texto = readFileSync(moc, "utf8");
  console.log(`# Cerebro — ${projeto}\n\n${texto}`);
} catch {
  process.exit(0);
}
