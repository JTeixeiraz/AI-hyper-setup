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

### Claude Code — `~/.claude/settings.json`

Leia o arquivo, ache `hooks.SessionStart` e `hooks.SessionEnd`, e **acrescente**
ao array. Nunca substitua o arquivo nem o array: ali costumam viver hooks do
claude-flow e do RTK, e apaga-los quebra o ambiente do usuario.

```json
{
  "hooks": {
    "SessionStart": [
      { "hooks": [{ "type": "command",
        "command": "node ~/.ai-hyper-setup/cerebro/abrir.mjs", "timeout": 8000 }] }
    ],
    "SessionEnd": [
      { "hooks": [{ "type": "command",
        "command": "node ~/.ai-hyper-setup/cerebro/fechar.mjs", "timeout": 10000 }] }
    ]
  }
}
```

A logica de mesclagem esta implementada em `~/.ai-hyper-setup/cerebro/hooks.mjs`,
na funcao `mesclarHook(settings, evento, comando)`. Use-a em vez de reescrever:
ela ja preserva os hooks existentes e nao duplica um comando ja registrado.

**Se `settings.json` nao for JSON valido, nao grave.** Registre
`hooks-cerebro | falhou | settings.json invalido` e siga. Corromper a
configuracao de alguem e o pior resultado possivel desta skill.

Faca um backup em `settings.json.bak-pre-hyper` antes de gravar.

### Codex — `~/.codex/hooks.json`

Mesma logica, mesmo cuidado, arquivo diferente.

### Antigravity — `~/.gemini/config/`

Nao tem equivalente documentado de hook de sessao. Instale a skill de cerebro e
registre `hooks-cerebro | nao-aplicavel | agy nao expoe hooks de sessao`.
