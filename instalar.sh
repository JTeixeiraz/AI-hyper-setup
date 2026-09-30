#!/usr/bin/env bash
#
# Instalador do AI Hyper Setup.
#
#   curl -fsSL https://raw.githubusercontent.com/JTeixeiraz/AI-hyper-setup/main/instalar.sh | bash
#
# Detecta o agente de IA instalado, prepara o terreno (RTK, Obsidian) e
# instala a skill /hyper-setup-initialize, que termina o servico.

set -euo pipefail

REPO="${HYPER_REPO:-JTeixeiraz/AI-hyper-setup}"
BASE="${HYPER_BASE:-$HOME/.ai-hyper-setup}"

# O instalador do rtk poe o binario em ~/.local/bin, que numa shell recem-aberta
# pode nao estar no PATH. Sem normalizar aqui, a segunda execucao nao encontra o
# rtk que a primeira instalou e o reinstala — quebrando a idempotencia.
case ":${PATH}:" in
  *":$HOME/.local/bin:"*) ;;
  *) PATH="$HOME/.local/bin:$PATH" ;;
esac
export PATH

VERDE=$'\033[38;5;155m'
CINZA=$'\033[38;5;245m'
FORTE=$'\033[1m'
ZERA=$'\033[0m'

msg()  { printf '%s\n' "$*"; }
erro() { printf '\033[38;5;203m%s\033[0m\n' "$*" >&2; }
tem()  { command -v "$1" >/dev/null 2>&1; }

detectar_so() {
  case "$(uname -s)" in
    Linux*)               echo linux ;;
    Darwin*)              echo macos ;;
    MINGW*|MSYS*|CYGWIN*) echo windows ;;
    *)                    echo desconhecido ;;
  esac
}

detectar_arq() {
  case "$(uname -m)" in
    x86_64|amd64)  echo x64 ;;
    arm64|aarch64) echo arm64 ;;
    *)             echo desconhecido ;;
  esac
}

AGENTES=()
AGENTE_ESCOLHIDO=""

# Onde cada agente guarda suas skills. Verificado em 2026-09-29.
dir_skills() {
  case "$1" in
    claude) echo "$HOME/.claude/skills" ;;
    codex)  echo "$HOME/.codex/skills" ;;
    agy)    echo "$HOME/.gemini/config/skills" ;;
    *)      return 1 ;;
  esac
}

detectar_agentes() {
  AGENTES=()
  local a
  for a in claude codex agy; do
    tem "$a" && AGENTES+=("$a")
  done
  return 0
}

# Escolhe entre os agentes detectados. Roda por pipe na maioria das vezes
# (curl | bash), entao nao ha teclado: ali assumir o primeiro e melhor que
# travar esperando uma tecla que nunca vem.
escolher_agente() {
  if [ -n "${HYPER_AGENTE:-}" ]; then
    # Sem esta validacao um typo (cloud por claude) passava adiante e so
    # estourava em dir_skills, onde o `set -e` encerrava o script em branco —
    # sem mensagem e sem estado.json, depois de RTK e Obsidian ja instalados.
    if ! dir_skills "$HYPER_AGENTE" >/dev/null 2>&1; then
      erro "HYPER_AGENTE=\"$HYPER_AGENTE\" nao e um agente conhecido."
      erro "Use um destes: claude, codex, agy."
      return 1
    fi
    AGENTE_ESCOLHIDO="$HYPER_AGENTE"
    return 0
  fi

  if [ "${#AGENTES[@]}" -eq 0 ]; then
    return 1
  fi

  if [ "${#AGENTES[@]}" -eq 1 ] || [ ! -t 0 ]; then
    AGENTE_ESCOLHIDO="${AGENTES[0]}"
    [ "${#AGENTES[@]}" -gt 1 ] &&
      msg "${CINZA}varios agentes encontrados; usando ${AGENTE_ESCOLHIDO}${ZERA}"
    return 0
  fi

  local sel=0 n=${#AGENTES[@]} primeira=1 tecla resto i
  msg "Qual agente configurar?"
  msg "${CINZA}setas para escolher, Enter para confirmar${ZERA}"
  while true; do
    [ "$primeira" -eq 0 ] && printf '\033[%dA' "$n"
    primeira=0
    for i in "${!AGENTES[@]}"; do
      printf '\033[2K'
      if [ "$i" -eq "$sel" ]; then
        printf '  %s> %s%s\n' "$VERDE$FORTE" "${AGENTES[$i]}" "$ZERA"
      else
        printf '    %s\n' "${AGENTES[$i]}"
      fi
    done
    IFS= read -rsn1 tecla </dev/tty || { AGENTE_ESCOLHIDO="${AGENTES[$sel]}"; return 0; }
    case "$tecla" in
      $'\x1b') read -rsn2 -t 0.05 resto </dev/tty || resto=""
               case "$resto" in
                 '[A') [ "$sel" -gt 0 ] && sel=$((sel - 1)) ;;
                 '[B') [ "$sel" -lt $((n - 1)) ] && sel=$((sel + 1)) ;;
               esac ;;
      'k')     [ "$sel" -gt 0 ] && sel=$((sel - 1)) ;;
      'j')     [ "$sel" -lt $((n - 1)) ] && sel=$((sel + 1)) ;;
      '')      AGENTE_ESCOLHIDO="${AGENTES[$sel]}"; return 0 ;;
      'q')     erro "Cancelado."; exit 1 ;;
    esac
  done
}

PASSOS=()
SO=""
ARQ=""

registrar() { PASSOS+=("$1|$2|${3:-}"); }

# Escreve o estado.json a mao, sem jq: o formato e fixo e conhecido, e uma
# dependencia a mais no caminho do curl e um ponto a mais de falha.
# A skill le este arquivo para nao precisar adivinhar o que o script fez.
gravar_estado() {
  local destino="$1"
  mkdir -p "$(dirname "$destino")"
  {
    printf '{\n'
    printf '  "versao": 1,\n'
    printf '  "quando": "%s",\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
    printf '  "so": "%s",\n' "$SO"
    printf '  "arquitetura": "%s",\n' "$ARQ"
    printf '  "agente": { "nome": "%s", "skills": "%s" },\n' \
      "$AGENTE_ESCOLHIDO" "$(dir_skills "$AGENTE_ESCOLHIDO")"
    printf '  "passos": [\n'
    local i item estado detalhe virgula
    for i in "${!PASSOS[@]}"; do
      IFS='|' read -r item estado detalhe <<< "${PASSOS[$i]}"
      virgula=","
      [ "$i" -eq $(( ${#PASSOS[@]} - 1 )) ] && virgula=""
      printf '    { "item": "%s", "estado": "%s", "detalhe": "%s" }%s\n' \
        "$item" "$estado" "$detalhe" "$virgula"
    done
    printf '  ]\n'
    printf '}\n'
  } > "$destino"
}

# O rtk init tem uma variante por agente. Verificado com `rtk init --help`
# em 2026-09-29, v0.50.0.
flag_rtk() {
  case "$1" in
    claude) echo "-g" ;;
    codex)  echo "-g --codex" ;;
    agy)    echo "-g --agent antigravity" ;;
    *)      return 1 ;;
  esac
}

# O `rtk init` reescreve a configuracao do agente. Rodar a cada execucao mexia
# no settings.json de quem so queria conferir se estava tudo instalado.
dir_config() {
  case "$1" in
    claude) echo "$HOME/.claude" ;;
    codex)  echo "$HOME/.codex" ;;
    agy)    echo "$HOME/.gemini/config" ;;
    *)      return 1 ;;
  esac
}

rtk_hook_registrado() {
  local arq
  case "$AGENTE_ESCOLHIDO" in
    claude) arq="$HOME/.claude/settings.json" ;;
    codex)  arq="$HOME/.codex/hooks.json" ;;
    agy)    arq="$HOME/.gemini/config/settings.json" ;;
    *)      return 1 ;;
  esac
  [ -f "$arq" ] && grep -q 'rtk hook' "$arq" 2>/dev/null
}

instalar_rtk() {
  if tem rtk; then
    registrar rtk ja-existia "$(rtk --version 2>/dev/null | head -1)"
  else
    msg "${CINZA}instalando o RTK...${ZERA}"
    if curl -fsSL https://raw.githubusercontent.com/rtk-ai/rtk/refs/heads/master/install.sh | sh >/dev/null 2>&1; then
      export PATH="$HOME/.local/bin:$PATH"
      registrar rtk instalado "$(rtk --version 2>/dev/null | head -1)"
    else
      registrar rtk falhou "o instalador do rtk nao completou"
      return 0
    fi
  fi

  if rtk_hook_registrado; then
    registrar rtk-hook ja-existia "$AGENTE_ESCOLHIDO"
    return 0
  fi

  # --auto-patch acrescenta o hook ao settings.json existente em vez de
  # perguntar. Sem ele, em modo nao-interativo o rtk pula o patch e o hook
  # nunca e registrado.
  # O `rtk init` desiste em silencio quando o diretorio do agente nao existe,
  # e numa maquina nova ele ainda nao existe neste ponto — a skill so e
  # instalada depois. Sem este mkdir o hook nunca era registrado na primeira
  # execucao, e so aparecia se a pessoa rodasse o instalador duas vezes.
  mkdir -p "$(dir_config "$AGENTE_ESCOLHIDO")"

  # shellcheck disable=SC2046
  rtk init $(flag_rtk "$AGENTE_ESCOLHIDO") --auto-patch >/dev/null 2>&1 || true

  # O codigo de saida do `rtk init` nao prova que o hook ficou registrado: ele
  # pode sair 0 e nao escrever nada quando o diretorio do agente nao existe.
  # Confira o resultado; reportar "instalado" sem ter instalado e pior que
  # reportar a falha.
  if rtk_hook_registrado; then
    registrar rtk-hook instalado "$AGENTE_ESCOLHIDO"
  else
    registrar rtk-hook falhou "rtk init nao registrou o hook em $AGENTE_ESCOLHIDO"
  fi
  return 0
}

# O Obsidian pode estar instalado como flatpak, snap, AppImage ou pacote
# nativo, e nem todos deixam um binario no PATH. O diretorio de configuracao
# e o sinal mais confiavel de que ele ja rodou nesta maquina.
obsidian_presente() {
  tem obsidian && return 0
  [ -d "$HOME/.config/obsidian" ] && return 0
  [ -d "$HOME/Library/Application Support/obsidian" ] && return 0
  [ -n "${APPDATA:-}" ] && [ -d "${APPDATA}/obsidian" ] && return 0
  return 1
}

# Ultimo recurso no Linux: o AppImage oficial, que nao precisa de root nem de
# gerenciador de pacotes. Num Debian ou Ubuntu sem nenhum dos gerenciadores
# acima era a diferenca entre instalar e nao instalar.
obsidian_appimage() {
  local api destino url
  api="https://api.github.com/repos/obsidianmd/obsidian-releases/releases/latest"
  url="$(curl -fsSL "$api" 2>/dev/null \
    | grep -o '"browser_download_url": *"[^"]*\.AppImage"' \
    | sed 's/.*"\(.*\)"/\1/' | head -1)"
  [ -z "$url" ] && return 1
  destino="$HOME/.local/bin/obsidian"
  mkdir -p "$(dirname "$destino")"
  curl -fsSL "$url" -o "$destino" 2>/dev/null || return 1
  chmod +x "$destino"
  return 0
}

# Falha aqui nao interrompe a instalacao: o Obsidian e importante para o
# cerebro, mas o resto da suite funciona sem ele, e o relatorio final avisa.
instalar_obsidian() {
  if obsidian_presente; then
    registrar obsidian ja-existia "detectado"
    return 0
  fi

  msg "${CINZA}instalando o Obsidian...${ZERA}"
  local ok=1
  case "$SO" in
    linux)
      # Tenta ate um FUNCIONAR, nao para no primeiro que EXISTE: um Arch com
      # flatpak instalado mas sem o remote flathub falhava sem nunca tentar o
      # pacman, que resolveria.
      #
      # sudo -n em todos: sem o -n o sudo escreve o prompt de senha em
      # /dev/tty (o 2>/dev/null nao o esconde) e trava a instalacao esperando
      # uma senha que o usuario nao sabe que foi pedida.
      tem flatpak && [ "$ok" -ne 0 ] &&
        { flatpak install -y flathub md.obsidian.Obsidian >/dev/null 2>&1 && ok=0; }
      tem pacman && [ "$ok" -ne 0 ] &&
        { sudo -n pacman -S --noconfirm obsidian >/dev/null 2>&1 && ok=0; }
      tem dnf && [ "$ok" -ne 0 ] &&
        { sudo -n dnf install -y obsidian >/dev/null 2>&1 && ok=0; }
      tem apt-get && [ "$ok" -ne 0 ] &&
        { sudo -n apt-get install -y obsidian >/dev/null 2>&1 && ok=0; }
      tem snap && [ "$ok" -ne 0 ] &&
        { sudo -n snap install obsidian --classic >/dev/null 2>&1 && ok=0; }
      [ "$ok" -ne 0 ] && obsidian_appimage && ok=0
      ;;
    macos)
      tem brew && brew install --cask obsidian >/dev/null 2>&1 && ok=0 ;;
    windows)
      tem winget && winget install -e --id Obsidian.Obsidian >/dev/null 2>&1 && ok=0 ;;
  esac

  if [ "$ok" -eq 0 ]; then
    registrar obsidian instalado "$SO"
  else
    registrar obsidian falhou "instale manualmente: https://obsidian.md/download"
  fi
  return 0
}

# Baixa para um diretorio temporario e so troca $BASE/repo quando completa.
# Rede caindo no meio nao pode deixar a instalacao pela metade.
#
# O repositorio vive em $BASE/repo, nao em $BASE: o que a skill escreve depois
# (o cerebro com o caminho do vault substituido, relatorios) mora ao lado e
# sobrevive a uma reexecucao. Apagar $BASE inteiro apagaria isso em silencio,
# e o produto promete o contrario.
#
# HYPER_LOCAL instala a partir de um diretorio ja existente, sem rede. Serve ao
# teste de integracao e a quem prefere clonar e conferir antes de instalar.
baixar_repo() {
  local tmp origem destino
  destino="$BASE/repo"
  # O temporario nasce ao lado do destino, nao em /tmp: entre filesystems
  # diferentes (tmpfs x btrfs, por exemplo) o `mv` vira copy+unlink e deixa de
  # ser atomico — uma interrupcao no meio deixaria repo/ pela metade.
  mkdir -p "$BASE"
  tmp="$(mktemp -d "$BASE/.baixando.XXXXXX")"

  if [ -n "${HYPER_LOCAL:-}" ] && [ -d "$HYPER_LOCAL" ]; then
    origem="$tmp/local"
    cp -R "$HYPER_LOCAL" "$origem"
  elif curl -fsSL "https://codeload.github.com/${REPO}/tar.gz/refs/heads/main" \
         -o "$tmp/repo.tar.gz" 2>/dev/null &&
       tar -xzf "$tmp/repo.tar.gz" -C "$tmp" 2>/dev/null; then
    # O nome da pasta extraida vem do repositorio, e HYPER_REPO e
    # configuravel: cravar "AI-hyper-setup-*" fazia qualquer fork falhar com
    # "o conteudo nao veio como esperado" tendo o download intacto no disco.
    origem="$(find "$tmp" -mindepth 1 -maxdepth 1 -type d ! -name '.baixando.*' | head -1)"
  elif tem git && git clone --depth 1 "https://github.com/${REPO}.git" "$tmp/clone" >/dev/null 2>&1; then
    origem="$tmp/clone"
  else
    rm -rf "$tmp"
    rmdir "$BASE" 2>/dev/null || true
    erro "Nao consegui baixar o repositorio. Verifique a conexao e tente de novo."
    return 2
  fi

  if [ -z "$origem" ] || [ ! -d "$origem" ]; then
    rm -rf "$tmp"
    rmdir "$BASE" 2>/dev/null || true
    erro "O download completou mas o conteudo nao veio como esperado."
    return 2
  fi

  local ja_tinha=0
  [ -d "$destino" ] && ja_tinha=1

  mkdir -p "$BASE"
  rm -rf "$destino"
  mv "$origem" "$destino"
  rm -rf "$tmp"

  if [ "$ja_tinha" -eq 1 ]; then
    registrar repositorio atualizado "$destino"
  else
    registrar repositorio instalado "$destino"
  fi
  return 0
}

instalar_skill() {
  local destino
  destino="$(dir_skills "$AGENTE_ESCOLHIDO")/hyper-setup-initialize"

  if [ -e "$destino" ]; then
    registrar skill-hyper-setup ja-existia "$destino"
    return 0
  fi

  if [ ! -d "$BASE/repo/skills/hyper-setup-initialize" ]; then
    registrar skill-hyper-setup falhou "a skill nao veio no repositorio baixado"
    return 0
  fi

  mkdir -p "$(dirname "$destino")"
  cp -R "$BASE/repo/skills/hyper-setup-initialize" "$destino"
  registrar skill-hyper-setup instalado "$destino"
  return 0
}

main() {
  msg "${FORTE}AI Hyper Setup${ZERA}"

  SO="$(detectar_so)"
  ARQ="$(detectar_arq)"
  msg "${CINZA}sistema: ${SO} ${ARQ}${ZERA}"

  detectar_agentes
  if ! escolher_agente; then
    erro "Nenhum agente de IA encontrado."
    erro "Suportados: claude (Claude Code), codex (OpenAI Codex), agy (Antigravity)."
    exit 1
  fi
  msg "${CINZA}agente: ${AGENTE_ESCOLHIDO}${ZERA}"

  instalar_rtk
  instalar_obsidian
  baixar_repo || exit 2
  instalar_skill
  gravar_estado "$BASE/estado.json"

  msg ""
  msg "${VERDE}${FORTE}Terreno preparado.${ZERA}"
  msg "Agora abra o ${FORTE}${AGENTE_ESCOLHIDO}${ZERA} e rode:"
  msg ""
  msg "    ${VERDE}/hyper-setup-initialize${ZERA}"
  msg ""
  msg "${CINZA}a IA termina a instalacao e diz o que instalou e o que ja existia${ZERA}"
}

# Roda main quando o script e executado, nao quando e sourceado.
#
# Sao tres situacoes, e as tres importam:
#   curl | bash        BASH_SOURCE vazio, $0 = "bash"   -> roda
#   bash instalar.sh   BASH_SOURCE[0] = $0              -> roda
#   source instalar.sh BASH_SOURCE[0] != $0             -> nao roda
#
# O `:-` nao e defensivo a toa: lendo do stdin o array fica vazio, e sob
# `set -u` a expansao sem ele mata o script antes de main — que e justamente
# o caminho do curl, o principal do produto.
#
# E precisa ser `if` e nao `[ ... ] && main`: a forma com && devolve 1 quando
# o arquivo e sourceado, e com set -e isso aborta quem sourceou.
if [ -z "${BASH_SOURCE[0]:-}" ] || [ "${BASH_SOURCE[0]:-}" = "$0" ]; then
  main "$@"
fi
