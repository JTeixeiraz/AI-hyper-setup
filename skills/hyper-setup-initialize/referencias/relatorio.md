# Formato do relatorio e registro dos hooks

## O relatorio

Tres listas. Numero entre parenteses no titulo de cada uma.

```
INSTALADO AGORA (N)
  skills       seo (33, AgriciDaniel/claude-seo) - resume (22, sumeet0701/ResumeSkills)
  mcps         ruflo - ruv-swarm
  ferramentas  rtk 0.50.0 - Obsidian 1.13.7

JA ESTAVA INSTALADO (N)
  skills       graphify - brag
  ferramentas  Obsidian 1.12.0

NAO INSTALADO (N)
  meta-ads-optimizer          upstream nao localizado
  ui-ux-pro-max               rode /plugin install ui-ux-pro-max@nextlevelbuilder/ui-ux-pro-max-skill
```

Agrupe as skills que vieram do mesmo repositorio numa linha so, com a contagem.
Listar 33 nomes de skills de SEO enche a tela e nao informa mais que "seo (33)".

## Os hooks de sessao

O cerebro precisa de **dois** mecanismos. A skill diz *como* escrever; os hooks
dizem *quando*. Skills nao disparam na abertura nem no fechamento da sessao.

**Nao faca isso a mao.** Rode:

```bash
node ~/.ai-hyper-setup/cerebro/instalar-hooks.mjs <claude|codex|agy>
```

Ele imprime uma linha pronta para o relatorio:

```
hooks-cerebro | instalado
hooks-cerebro | ja-existia
hooks-cerebro | falhou | ~/.claude/settings.json: JSON invalido: ...
hooks-cerebro | nao-aplicavel | agy nao expoe hooks de sessao
```

O que ele garante, e por que nao e prosa:

- **Recusa gravar num settings.json invalido** e deixa o arquivo exatamente
  como estava. Um settings quebrado costuma ser uma edicao a mao pela metade;
  sobrescrever apagaria o trabalho da pessoa junto com o erro de sintaxe.
- **Preserva os hooks de terceiros** — claude-flow, RTK — acrescentando aos
  arrays em vez de substituir.
- **Faz backup** em `settings.json.bak-pre-hyper` antes de gravar.
- **Nao duplica** quando ja registrado.

Isto e o unico caminho desta suite cujo erro nao tem volta para o usuario.
Esta coberto por teste em `tests/settings.test.mjs`; reimplementar por conta
propria joga essa cobertura fora.

Os comandos apontam para `~/.ai-hyper-setup/cerebro/`, a **copia** — nunca para
`repo/cerebro/`, que e substituido a cada reexecucao do instalador.

## Plugins (so Claude Code)

Plugin nao se baixa: registra-se. Duas chaves no `~/.claude/settings.json`, e o
Claude Code resolve na proxima abertura.

```json
{
  "extraKnownMarketplaces": {
    "claude-plugins-official": { "source": { "source": "github", "repo": "anthropics/claude-plugins-official" } }
  },
  "enabledPlugins": {
    "superpowers@claude-plugins-official": true
  }
}
```

O `repo` de cada marketplace esta em `manifesto.marketplaces`. A chave de
`enabledPlugins` e sempre `<nome>@<marketplace>`.

**Mescle, nao substitua** — as duas chaves costumam ja ter entradas do usuario.
Plugin ja presente em `enabledPlugins` fica como esta, mesmo que esteja `false`:
desligado e uma escolha dele, nao um item faltando.

Depois de gravar, diga ao usuario que os plugins entram na proxima vez que ele
abrir o agente. Sem esse aviso ele vai procurar o `/superpowers` e nao achar.

### Codex — `~/.codex/hooks.json`

Mesma logica, mesmo cuidado, arquivo diferente.

### Antigravity — `~/.gemini/config/`

Nao tem equivalente documentado de hook de sessao. Instale a skill de cerebro e
registre `hooks-cerebro | nao-aplicavel | agy nao expoe hooks de sessao`.
