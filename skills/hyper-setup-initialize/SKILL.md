---
name: hyper-setup-initialize
description: Instala a suite completa do AI Hyper Setup — skills, MCPs, plugins e o cerebro no Obsidian — pulando tudo que ja existe. Use quando o usuario rodar /hyper-setup-initialize ou pedir para terminar a instalacao do hyper setup.
---

# Hyper Setup — Instalação

Voce esta terminando o que o `instalar.sh` comecou. Ele ja preparou o terreno;
voce instala a suite e relata o resultado.

## Antes de tudo

Leia `~/.ai-hyper-setup/estado.json` e `~/.ai-hyper-setup/repo/manifesto.json`.

O layout separa o que e baixado do que e seu:

```
~/.ai-hyper-setup/
├── estado.json     escrito pelo instalador
├── repo/           o repositorio; uma reexecucao TROCA esta pasta inteira
└── cerebro/        voce cria; sobrevive a reexecucao
```

**Nunca escreva dentro de `repo/`.** O que voce escrever ali some na proxima vez
que o usuario rodar o instalador, e some em silencio.

Se algum dos dois nao existir, pare e diga:

> O terreno ainda nao foi preparado. Rode primeiro:
> `curl -fsSL https://raw.githubusercontent.com/JTeixeiraz/AI-hyper-setup/main/instalar.sh | bash`

O `estado.json` diz o que o script ja fez. **Nao repita o trabalho dele** e nao
tente adivinhar: o que estiver ali entra no relatorio como veio.

## Fase 1 — Inventario

Percorra todas as skills, MCPs, plugins e ferramentas do manifesto e classifique
cada uma em `ja existe` ou `falta`. **Nao instale nada nesta fase.**

Onde procurar as skills, conforme `estado.json.agente.skills`:

| Agente | Diretorio |
|---|---|
| claude | `~/.claude/skills/` |
| codex | `~/.codex/skills/` |
| agy | `~/.gemini/config/skills/` |

Separar descobrir de agir e o que torna o relatorio final confiavel. Se voce
instalar enquanto inventaria, no fim nao sabera mais o que ja estava la.

## Fase 2 — Instalar o que falta

**Agrupe por repositorio.** Setenta e cinco skills vem de seis repositorios:
clone cada um **uma vez** em um diretorio temporario e copie as subpastas. Clonar
por skill seria setenta e cinco clones do mesmo punhado de repos.

Por origem:

- **`git`** — `git clone --depth 1 <repo>` no temporario, copiar `<subpasta>`
  para o diretorio de skills. **Respeite `ignorar`**: esses diretorios sao cache
  ou material de site, nao conteudo da skill. Copiar `ms-playwright` arrasta
  658 MB de navegadores por nada.
- **`plugin`** — no Claude Code, plugin e configuracao, nao download: escreva
  as duas chaves no `~/.claude/settings.json` e ele instala sozinho na proxima
  abertura. Veja "Plugins" em `referencias/relatorio.md`. Mandar o usuario
  rodar `/plugin install` a mao seria deixar metade do trabalho na mesa.
  Nos outros agentes, registre como `nao-aplicavel`.
- **`uv-tool`** — `uv tool install <pacote>`. Se `uv` nao existir, registre como
  falha com a instrucao de instalar o `uv`.
- **`bundled`** — copie de `~/.ai-hyper-setup/repo/<caminho>`.
- **`builtin`** — nao faca nada. Ja vem com o agente.
- **`agente`** — procure a fonte na web pelo `nome` e pela `descricao`, usando a
  `dica` quando houver. **Se nao encontrar com confianca, registre como nao
  instalada e siga.** Nunca escreva uma skill do zero para preencher a lacuna:
  uma skill inventada com o nome certo e pior que a ausencia dela, porque o
  usuario vai confiar nela.

### Regra que nao se dobra

Se o destino ja existe, **pule e registre**. Nunca sobrescreva. Se o conteudo for
diferente do upstream, registre como `ja-existia (conteudo difere)` — o usuario
decide o que fazer.

## Fase 3 — MCPs

Leia `~/.mcp.json`. Acrescente **apenas as chaves ausentes** em `mcpServers` e
grave de volta. Servidor ja presente fica exatamente como esta, mesmo que a
configuracao difira da do manifesto.

Se o arquivo nao existir, crie com `{ "mcpServers": { ... } }`.
Se existir mas nao for JSON valido, **nao grave**: registre a falha e siga.

## Fase 4 — O cerebro no Obsidian

1. Ache o vault. Leia `~/.config/obsidian/obsidian.json` (macOS:
   `~/Library/Application Support/obsidian/obsidian.json`), que lista os vaults
   abertos. Se houver mais de um, pergunte qual usar.
2. Sem nenhum vault, crie `~/Documentos/Obsidian Vault` (ou `~/Documents/...` se
   o sistema estiver em ingles) com um `.obsidian/` vazio dentro.
3. Copie `~/.ai-hyper-setup/repo/skills/cerebro-obsidian` para o diretorio de
   skills e **substitua `{{VAULT}}`** pelo caminho encontrado.

   > A **Regra que nao se dobra** da Fase 2 vale aqui tambem, e aqui ela pesa
   > mais: se `cerebro-obsidian` ou `~/.ai-hyper-setup/cerebro/` ja existem,
   > **pule e registre**. Depois da primeira instalacao esses arquivos carregam
   > o vault do usuario ja configurado — sobrescrever apaga a ligacao com o
   > cerebro dele.

   Substitua `{{VAULT}}` por um **literal JSON** do caminho, aspas incluidas
   (`JSON.stringify(caminho)`). Num caminho do Windows a barra invertida sem
   escape colapsa em silencio e o hook passa a apontar para lugar nenhum.
4. Copie `~/.ai-hyper-setup/repo/cerebro/` para **`~/.ai-hyper-setup/cerebro/`**
   e substitua `{{VAULT}}` la tambem. A copia e obrigatoria: os hooks apontam
   para esses arquivos, e se apontassem para dentro de `repo/` a proxima
   execucao do instalador os devolveria ao marcador literal. O cerebro entao
   pararia de ler o vault **sem erro nenhum** — `existsSync("{{VAULT}}")` e
   falso e o script sai com codigo 0. O usuario perderia a memoria entre
   sessoes sem uma linha avisando.
5. Registre os hooks rodando
   `node ~/.ai-hyper-setup/cerebro/instalar-hooks.mjs <agente>`. **Nao mexa no
   `settings.json` a mao**: o script recusa gravar num arquivo invalido,
   preserva os hooks de terceiros e faz backup, e e a unica parte desta
   instalacao cujo erro nao tem volta. Veja `referencias/relatorio.md`.

## Fase 5 — O relatorio

Siga o formato de `referencias/relatorio.md`. Tres listas, nessa ordem:
**instalado agora**, **ja estava instalado**, **nao instalado** com o motivo.

Uma falha nunca interrompe o resto. Tudo que falhou aparece no relatorio.
