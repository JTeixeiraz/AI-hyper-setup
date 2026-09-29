// Acrescenta um hook ao settings sem tocar no que ja esta la. O settings de um
// usuario real costuma ter hooks do claude-flow e do RTK; substituir o array
// em vez de acrescentar quebraria o ambiente dele em silencio.
export function mesclarHook(settings, evento, comando) {
  if (settings === null || typeof settings !== "object" || Array.isArray(settings)) {
    throw new Error("settings invalido: esperava um objeto");
  }

  const saida = structuredClone(settings);
  saida.hooks ??= {};
  saida.hooks[evento] ??= [];

  const jaTem = saida.hooks[evento].some((g) =>
    (g.hooks ?? []).some((h) => h.command === comando),
  );
  if (jaTem) return saida;

  saida.hooks[evento].push({
    hooks: [{ type: "command", command: comando, timeout: 10000 }],
  });
  return saida;
}
