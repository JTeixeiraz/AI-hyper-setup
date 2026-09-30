// Acrescenta um hook ao settings sem tocar no que ja esta la. O settings de um
// usuario real costuma ter hooks do claude-flow e do RTK; substituir o array
// em vez de acrescentar quebraria o ambiente dele em silencio.

// O documento do agente pede janelas diferentes: abrir a sessao nao pode
// demorar, fechar pode.
const TIMEOUT = { SessionStart: 8000, SessionEnd: 10000 };
const TIMEOUT_PADRAO = 10000;

export function mesclarHook(settings, evento, comando) {
  if (settings === null || typeof settings !== "object" || Array.isArray(settings)) {
    throw new Error("settings invalido: esperava um objeto");
  }

  const saida = structuredClone(settings);

  // `??=` protege contra ausencia, nao contra tipo errado. Com `hooks` vindo
  // array, o `??=` o mantinha, a propriedade era acrescentada ao array e o
  // JSON.stringify a descartava na gravacao: os hooks do usuario sumiam em
  // silencio. Com o evento vindo objeto, o `.some` abaixo lancava.
  if (saida.hooks === undefined) saida.hooks = {};
  if (saida.hooks === null || typeof saida.hooks !== "object" || Array.isArray(saida.hooks)) {
    throw new Error("settings invalido: `hooks` deveria ser um objeto");
  }

  if (saida.hooks[evento] === undefined) saida.hooks[evento] = [];
  if (!Array.isArray(saida.hooks[evento])) {
    throw new Error(`settings invalido: \`hooks.${evento}\` deveria ser um array`);
  }

  const jaTem = saida.hooks[evento].some((g) =>
    Array.isArray(g?.hooks) && g.hooks.some((h) => h?.command === comando),
  );
  if (jaTem) return saida;

  saida.hooks[evento].push({
    hooks: [{ type: "command", command: comando, timeout: TIMEOUT[evento] ?? TIMEOUT_PADRAO }],
  });
  return saida;
}
