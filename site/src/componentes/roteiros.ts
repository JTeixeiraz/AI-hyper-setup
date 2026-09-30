import type { Linha } from "./Terminal";

// O que o instalador imprime de verdade, na ordem em que imprime. Uma
// simulacao que mostrasse outra coisa seria propaganda, nao demonstracao.

export const PASSO_1: Linha[] = [
  { txt: "$ curl -fsSL ...hyper-setup/instalar.sh | bash", cor: "forte", pausa: 700 },
  { txt: "AI Hyper Setup", cor: "forte", pausa: 260 },
  { txt: "sistema: linux x64", cor: "cinza", pausa: 200 },
  { txt: "agente: claude", cor: "cinza", pausa: 520 },
  { txt: "instalando o RTK...", cor: "cinza", pausa: 680 },
  { txt: "instalando o Obsidian...", cor: "cinza", pausa: 760 },
  { txt: "", pausa: 140 },
  { txt: "Terreno preparado.", cor: "ok", pausa: 0 },
];

export const PASSO_2: Linha[] = [
  { txt: "$ claude", cor: "forte", pausa: 900 },
  { txt: "", pausa: 120 },
  { txt: "  Claude Code v2.1", cor: "cinza", pausa: 320 },
  { txt: "  /hyper-setup-initialize  disponivel", cor: "acao", pausa: 620 },
  { txt: "", pausa: 120 },
  { txt: "> /hyper-setup-initialize", cor: "forte", pausa: 0 },
];

export const PASSO_3: Linha[] = [
  { txt: "> /hyper-setup-initialize", cor: "forte", pausa: 700 },
  { txt: "inventariando 127 skills...", cor: "cinza", pausa: 900 },
  { txt: "", pausa: 160 },
  { txt: "INSTALADO AGORA (94)", cor: "ok", pausa: 200 },
  { txt: "  skills       seo (33) · resume (22) · social (17)", pausa: 130 },
  { txt: "  mcps         ruflo · ruv-swarm", pausa: 130 },
  { txt: "  ferramentas  rtk 0.50.0 · Obsidian 1.13.7", pausa: 460 },
  { txt: "", pausa: 160 },
  { txt: "JA ESTAVA INSTALADO (12)", cor: "acao", pausa: 200 },
  { txt: "  skills       graphify · brag · brag-slim", pausa: 130 },
  { txt: "  ferramentas  Obsidian 1.12.0", pausa: 0 },
];

// O heroi mostra o arco inteiro: do curl ate as duas listas.
export const COMPLETO: Linha[] = [
  ...PASSO_1,
  { txt: "Agora abra o claude e rode:", cor: "cinza", pausa: 200 },
  { txt: "    /hyper-setup-initialize", cor: "acao", pausa: 950 },
  { txt: "", pausa: 200 },
  ...PASSO_3,
];
