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

main() {
  msg "${FORTE}AI Hyper Setup${ZERA}"
}

# Sourceavel para teste: so roda quando executado diretamente.
# Precisa ser `if` e nao `[ ... ] && main`: a forma com && devolve 1 quando o
# arquivo e sourceado, e com set -e isso aborta quem sourceou.
if [ "${BASH_SOURCE[0]}" = "$0" ]; then
  main "$@"
fi
