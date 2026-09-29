#!/usr/bin/env node
// Hook de SessionEnd: pede o registro da sessao no vault. Nao escreve nada
// sozinho — quem escreve e o modelo, seguindo a skill cerebro-obsidian, que
// conhece a gramatica do vault. Este hook so lembra que e hora de escrever.
import { existsSync } from "node:fs";
import { basename } from "node:path";

const VAULT = "{{VAULT}}";

if (existsSync(VAULT)) {
  console.log(
    `Antes de encerrar: registre esta sessao no vault (${VAULT}) seguindo a ` +
    `skill cerebro-obsidian. Projeto: ${basename(process.cwd())}. ` +
    `Se nada relevante mudou, nao escreva nada.`,
  );
}
