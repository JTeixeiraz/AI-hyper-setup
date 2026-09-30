#!/usr/bin/env node
// Registra os hooks de sessao do cerebro na configuracao do agente.
//
//   node instalar-hooks.mjs <agente> [caminho-do-settings]
//
// A skill chama isto em vez de ler, mesclar e gravar por conta propria: o
// caminho de escrita no settings.json alheio e o unico desta suite cujo erro
// nao tem volta, e ele esta coberto por teste aqui.
import { homedir } from "node:os";
import { join } from "node:path";
import { registrarHooks } from "./settings.mjs";

const CONFIG = {
  claude: join(homedir(), ".claude", "settings.json"),
  codex: join(homedir(), ".codex", "hooks.json"),
};

const COMANDOS = {
  SessionStart: `node ${join(homedir(), ".ai-hyper-setup", "cerebro", "abrir.mjs")}`,
  SessionEnd: `node ${join(homedir(), ".ai-hyper-setup", "cerebro", "fechar.mjs")}`,
};

const agente = process.argv[2];
const caminho = process.argv[3] || CONFIG[agente];

if (!agente) {
  console.error("uso: node instalar-hooks.mjs <claude|codex|agy> [caminho]");
  process.exit(2);
}

// O Antigravity nao expoe equivalente documentado de hook de sessao. Dizer
// isso e melhor que escrever num arquivo que ele nao le.
if (agente === "agy") {
  console.log("hooks-cerebro | nao-aplicavel | agy nao expoe hooks de sessao");
  process.exit(0);
}

if (!caminho) {
  console.error(`hooks-cerebro | falhou | agente desconhecido: ${agente}`);
  process.exit(1);
}

const r = registrarHooks(caminho, COMANDOS);
console.log(`hooks-cerebro | ${r.estado}${r.motivo ? ` | ${r.motivo}` : ""}`);
process.exit(r.estado === "falhou" ? 1 : 0);
