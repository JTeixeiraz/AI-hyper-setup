#!/usr/bin/env node
// Hook de SessionEnd: pede o registro da sessao no vault. Nao escreve nada
// sozinho — quem escreve e o modelo, seguindo a skill cerebro-obsidian, que
// conhece a gramatica do vault. Este hook so lembra que e hora de escrever.
import { existsSync } from "node:fs";
import { basename } from "node:path";

// A skill substitui {{VAULT}} por um caminho ja escapado como literal JSON,
// aspas incluidas. Num caminho do Windows (C:\Users\...) a barra invertida
// sem escape colapsaria — \U vira U, sem erro — e o VAULT apontaria para o
// lugar errado, com existsSync dando falso e o hook calado.
const VAULT = {{VAULT}};

if (existsSync(VAULT)) {
  console.log(
    `Antes de encerrar: registre esta sessao no vault (${VAULT}) seguindo a ` +
    `skill cerebro-obsidian. Projeto: ${basename(process.cwd())}. ` +
    `Se nada relevante mudou, nao escreva nada.`,
  );
}
