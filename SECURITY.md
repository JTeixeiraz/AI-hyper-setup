# Segurança

## Antes de rodar o comando

O `curl | bash` executa código da internet na sua máquina. Leia o script antes:
[`instalar.sh`](instalar.sh). São menos de 300 linhas, sem ofuscação.

Preferindo não canalizar para o shell:

```bash
curl -fsSL https://raw.githubusercontent.com/JTeixeiraz/AI-hyper-setup/main/instalar.sh -o instalar.sh
less instalar.sh
bash instalar.sh
```

Ou clone o repositório e instale a partir dele, sem rede:

```bash
git clone https://github.com/JTeixeiraz/AI-hyper-setup.git
cd AI-hyper-setup && HYPER_LOCAL="$PWD" bash instalar.sh
```

## O que o instalador faz na sua máquina

| Faz | Não faz |
|---|---|
| Baixa o RTK pelo instalador oficial, que verifica SHA-256 | Não lê, grava nem transmite credenciais |
| Instala o Obsidian pelo gerenciador do seu sistema | Não desativa verificação de certificado |
| Escreve em `~/.ai-hyper-setup/` e no diretório de skills do agente | Não sobrescreve arquivo existente |
| Acrescenta hooks ao seu `settings.json` | Não substitui o arquivo nem apaga hooks de terceiros |

`sudo` é usado apenas pelo gerenciador de pacotes do sistema ao instalar o
Obsidian (`pacman`, `dnf`, `snap`), e só se você já não o tiver. Falha ali não
interrompe nada.

O download do repositório é atômico: baixa para um diretório temporário e só
move para o destino quando completa. Rede caindo no meio não deixa uma
instalação pela metade.

## Skills de terceiros

Este repositório **não redistribui** skills de terceiros: ele aponta para o
repositório original de cada uma, e a instalação clona de lá. Isso significa
que você executa código de outros autores — os seis upstreams estão listados no
[README](README.md) com licença e link, para você avaliar antes.

Um job semanal confere se algum upstream mudou de licença ou saiu do ar.

Skills sem upstream localizado não são instaladas automaticamente. A IA procura
a fonte e, não encontrando, reporta como não instalada em vez de escrever um
substituto.

## Relatando um problema

Abra uma issue. Se for algo que não deva ser público, escreva no corpo da issue
apenas que existe e como te contatar.
