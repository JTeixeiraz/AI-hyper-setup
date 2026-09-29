export const pt = {
  titulo: "AI Hyper Setup",
  subtitulo: "Sua suíte de agentes de IA numa máquina nova, com um comando.",
  heroiNota: "Detecta o agente que você já usa. Não sobrescreve nada.",

  copiar: "copiar",
  copiado: "copiado",

  passosTitulo: "Como funciona",
  passo1t: "Roda o comando",
  passo1d: "Ele detecta seu agente, instala o RTK e o Obsidian, e põe a skill no lugar certo.",
  passo2t: "Abre seu agente",
  passo2d: "Claude Code, Codex ou Antigravity — o que você já usa.",
  passo3t: "Roda a skill",
  passo3d: "A IA instala a suíte e devolve duas listas: o que instalou agora e o que já existia.",

  skillsTitulo: "skills, instaladas de uma vez",
  skillsTexto: "Do SEO ao currículo, de design a mídia paga. Todas de repositórios públicos, baixadas da fonte.",
  agenteClaude: "Instala skills, MCPs, plugins e os hooks de sessão.",
  agenteCodex: "Instala skills e registra o RTK no AGENTS.md.",
  agenteAgy: "Instala skills e configura o RTK.",
  chamadaTitulo: "Pronto para rodar",
  chamadaNota: "{n} skills com fonte conhecida, RTK e Obsidian. O que você já tem fica como está.",
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
    "Nada. Cada item é verificado antes de qualquer escrita, e o que já existe aparece no relatório final como já instalado.",
  garantia1t: "Nenhum arquivo é sobrescrito.",
  garantia1d: "Nem o seu settings.json: os hooks são acrescentados aos que já estão lá.",
  garantia2t: "Rodar duas vezes é seguro.",
  garantia2d: "A segunda execução reporta tudo como já instalado. Isso é testado em contêiner a cada push.",
  garantia3t: "O download é atômico.",
  garantia3d: "Baixa para um temporário e só move quando completa. Rede caindo não deixa instalação pela metade.",

  licencasTitulo: "De onde vêm as skills",
  licencasTexto:
    "Skills de terceiros são baixadas da fonte original, não redistribuídas aqui. A licença de cada upstream está abaixo.",

  agentesTitulo: "Agentes suportados",
  agentesSkills: "Onde cada agente guarda suas skills.",
  semFonte:
    "Outras {n} skills não têm upstream público localizado. Para elas a IA procura a fonte na instalação e, não encontrando, reporta como não instalada — nunca escreve um substituto.",
} as const;

// Record<keyof typeof pt, string> e nao `typeof pt`: com `as const` os valores
// tambem virariam tipos literais, e o ingles teria de repetir o texto portugues
// palavra por palavra. Assim a paridade cobrada e a das CHAVES — chave faltando
// ou sobrando nao compila — e os valores ficam livres.
export type Dicionario = Record<keyof typeof pt, string>;
