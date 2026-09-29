# AI Hyper Setup

Sua suíte de agentes de IA numa máquina nova, com um comando.

```bash
curl -fsSL https://raw.githubusercontent.com/JTeixeiraz/AI-hyper-setup/main/instalar.sh | bash
```

O script detecta qual agente de IA você já tem, instala o
[RTK](https://github.com/rtk-ai/rtk) e o [Obsidian](https://obsidian.md), e
coloca a skill `/hyper-setup-initialize` no lugar certo. Você abre o agente,
roda a skill, e a IA termina a instalação — dizendo no fim o que instalou e o
que já estava instalado.

Linux, macOS e Windows (Git Bash ou WSL).

## Agentes suportados

| Agente | Skills vão para |
|---|---|
| Claude Code | `~/.claude/skills/` |
| Codex | `~/.codex/skills/` |
| Antigravity (`agy`) | `~/.gemini/config/skills/` |

## O que instala

- **94 skills** com fonte conhecida, de seis repositórios públicos
- **RTK**, o proxy que corta até 90% da saída de terminal que seu agente lê
- **Obsidian**, com uma skill que lê e escreve o contexto entre sessões
- **Servidores MCP** e os plugins oficiais

## O que ele faz com o que você já tem

Nada. Cada item é verificado antes; o que já existe é pulado e aparece no
relatório final. Nenhum arquivo é sobrescrito — nem o seu `settings.json`, onde
os hooks são **acrescentados** aos que já estão lá.

Rodar duas vezes é seguro: a segunda execução reporta tudo como já instalado.
Isso é testado em contêiner a cada push.

## O que ele não faz

- Não é um gerenciador de pacotes. Instala uma vez; atualizar é rodar de novo.
- Não sincroniza configuração entre máquinas.
- Não instala modelos nem gerencia credenciais de API.

## De onde vêm as skills

Skills de terceiros são baixadas da fonte original, **não redistribuídas aqui**.

| Repositório | Skills | Licença |
|---|---:|---|
| [AgriciDaniel/claude-seo](https://github.com/AgriciDaniel/claude-seo) | 33 | MIT |
| [sumeet0701/ResumeSkills](https://github.com/sumeet0701/ResumeSkills) | 22 | MIT |
| [charlie947/social-media-skills](https://github.com/charlie947/social-media-skills) | 17 | MIT |
| [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | 7 | MIT |
| [pbakaus/impeccable](https://github.com/pbakaus/impeccable) | 2 | Apache-2.0 |
| [OSideMedia/higgsfield-ai-prompt-skill](https://github.com/OSideMedia/higgsfield-ai-prompt-skill) | 1 | MIT |

Um job semanal confere se algum upstream saiu do ar ou trocou de licença.

Outras **32 skills** não têm upstream público localizado. Para elas, a IA procura
a fonte na hora da instalação e, não encontrando, **reporta como não instalada** —
nunca escreve um substituto.

## Instalando a partir de um clone

Preferindo conferir antes:

```bash
git clone https://github.com/JTeixeiraz/AI-hyper-setup.git
cd AI-hyper-setup
HYPER_LOCAL="$PWD" bash instalar.sh
```

## Desenvolvimento

```bash
npm ci && npm test              # testes do bash (bats)
node --test tests/*.test.mjs    # testes do manifesto e dos hooks
npm run validar                 # valida o manifesto
./tests/integracao/rodar.sh     # integração em contêiner (precisa de Docker)
```

## Licença

MIT. Veja [LICENSE](LICENSE).
