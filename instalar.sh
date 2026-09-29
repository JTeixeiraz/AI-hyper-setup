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

  # --auto-patch acrescenta o hook ao settings.json existente em vez de
  # perguntar. Sem ele, em modo nao-interativo o rtk pula o patch e o hook
  # nunca e registrado.
  # shellcheck disable=SC2046
  if rtk init $(flag_rtk "$AGENTE_ESCOLHIDO") --auto-patch >/dev/null 2>&1; then
    registrar rtk-hook instalado "$AGENTE_ESCOLHIDO"
  else
    registrar rtk-hook falhou "rtk init nao completou"
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
      if   tem flatpak; then flatpak install -y flathub md.obsidian.Obsidian >/dev/null 2>&1 && ok=0
      elif tem pacman;  then sudo pacman -S --noconfirm obsidian >/dev/null 2>&1 && ok=0
      elif tem dnf;     then sudo dnf install -y obsidian >/dev/null 2>&1 && ok=0
      elif tem snap;    then sudo snap install obsidian --classic >/dev/null 2>&1 && ok=0
      fi ;;
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

main() {
  msg "${FORTE}AI Hyper Setup${ZERA}"
}

# Sourceavel para teste: so roda quando executado diretamente.
# Precisa ser `if` e nao `[ ... ] && main`: a forma com && devolve 1 quando o
# arquivo e sourceado, e com set -e isso aborta quem sourceou.
if [ "${BASH_SOURCE[0]}" = "$0" ]; then
  main "$@"
fi
