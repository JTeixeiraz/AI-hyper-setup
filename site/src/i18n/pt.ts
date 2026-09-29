export const pt = {
  titulo: "AI Hyper Setup",
  subtitulo: "Sua suíte de agentes de IA numa máquina nova, com um comando.",
  heroiNota: "Detecta o agente que você já usa. Não sobrescreve nada.",

  instalarTitulo: "Instalação",
  instalarNota: "Roda em Linux, macOS e Windows (Git Bash ou WSL).",
  depoisTitulo: "Depois do comando",
  depoisTexto:
    "Abra seu agente e rode /hyper-setup-initialize. A IA termina a instalação e diz o que instalou e o que já estava instalado.",

  inventarioTitulo: "O que ele instala",
  inventarioSkills: "skills de seis repositórios públicos",
  inventarioMcps: "servidores MCP",
  inventarioFerramentas:
    "RTK, o proxy que corta até 90% da saída de terminal que seu agente lê",
  inventarioObsidian:
    "Obsidian, com uma skill que lê e escreve o contexto entre sessões",

  respeitaTitulo: "O que ele faz com o que você já tem",
  respeitaTexto:
    "Nada. Cada item é verificado antes; o que já existe é pulado e aparece no relatório final. Nem o seu settings.json é substituído — os hooks são acrescentados aos que já estão lá.",

  licencasTitulo: "De onde vêm as skills",
  licencasTexto:
    "Skills de terceiros são baixadas da fonte original, não redistribuídas aqui. A licença de cada upstream está abaixo.",

  agentesTitulo: "Agentes suportados",
  agentesSkills: "Skills vão para",
} as const;

// Record<keyof typeof pt, string> e nao `typeof pt`: com `as const` os valores
// tambem virariam tipos literais, e o ingles teria de repetir o texto portugues
// palavra por palavra. Assim a paridade cobrada e a das CHAVES — chave faltando
// ou sobrando nao compila — e os valores ficam livres.
export type Dicionario = Record<keyof typeof pt, string>;
