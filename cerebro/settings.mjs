// Leitura e escrita do settings.json do agente.
//
// Isto existia como instrucao em prosa para o modelo seguir. Corromper a
// configuracao de alguem e o pior resultado possivel desta suite, e o unico
// dano irreversivel que ela pode causar — nao e coisa para depender de um
// modelo lembrar de conferir. Aqui e codigo, com teste.
import { readFileSync, writeFileSync, copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { mesclarHook } from "./hooks.mjs";

const SUFIXO_BACKUP = ".bak-pre-hyper";

/** @returns {{estado: 'ok'|'ausente'|'invalido', dados?: object, motivo?: string}} */
export function lerSettings(caminho) {
  if (!existsSync(caminho)) return { estado: "ausente", dados: {} };

  let texto;
  try {
    texto = readFileSync(caminho, "utf8");
  } catch (e) {
    return { estado: "invalido", motivo: `nao consegui ler: ${e.message}` };
  }

  // Arquivo vazio e um caso comum e recuperavel: trata como ausente, nao
  // como corrompido.
  if (texto.trim() === "") return { estado: "ausente", dados: {} };

  let dados;
  try {
    dados = JSON.parse(texto);
  } catch (e) {
    return { estado: "invalido", motivo: `JSON invalido: ${e.message}` };
  }

  if (dados === null || typeof dados !== "object" || Array.isArray(dados)) {
    return { estado: "invalido", motivo: "o conteudo nao e um objeto JSON" };
  }
  return { estado: "ok", dados };
}

/**
 * Acrescenta os hooks do cerebro ao settings do agente.
 *
 * @param {string} caminho
 * @param {Record<string,string>} comandos  evento -> comando
 * @returns {{estado:'instalado'|'ja-existia'|'falhou', motivo?: string}}
 */
export function registrarHooks(caminho, comandos) {
  const lido = lerSettings(caminho);

  // Nunca gravar por cima do que nao se conseguiu ler. Um settings invalido
  // costuma ser uma edicao a mao pela metade, e sobrescrever apagaria o
  // trabalho da pessoa junto com o erro de sintaxe.
  if (lido.estado === "invalido") {
    return { estado: "falhou", motivo: `${caminho}: ${lido.motivo}` };
  }

  let saida = lido.dados;
  let mudou = false;
  try {
    for (const [evento, comando] of Object.entries(comandos)) {
      const antes = JSON.stringify(saida.hooks?.[evento] ?? []);
      saida = mesclarHook(saida, evento, comando);
      if (JSON.stringify(saida.hooks[evento]) !== antes) mudou = true;
    }
  } catch (e) {
    // Estrutura interna fora do esperado (`hooks` array, evento objeto):
    // tratar como arquivo que nao se sabe ler, nunca como convite a
    // reescrever por cima.
    return { estado: "falhou", motivo: `${caminho}: ${e.message}` };
  }

  if (!mudou) return { estado: "ja-existia" };

  try {
    // Nao sobrescrever um backup existente: ele guarda o arquivo ORIGINAL, e
    // uma segunda execucao o trocaria pela versao que a primeira ja mexeu —
    // destruindo a unica copia que serve para desfazer.
    if (lido.estado === "ok" && !existsSync(caminho + SUFIXO_BACKUP)) {
      copyFileSync(caminho, caminho + SUFIXO_BACKUP);
    }
    mkdirSync(dirname(caminho), { recursive: true });
    writeFileSync(caminho, JSON.stringify(saida, null, 2) + "\n");
  } catch (e) {
    return { estado: "falhou", motivo: `nao consegui gravar: ${e.message}` };
  }
  return { estado: "instalado" };
}
