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

main() {
  msg "${FORTE}AI Hyper Setup${ZERA}"
}

# Sourceavel para teste: so roda quando executado diretamente.
# Precisa ser `if` e nao `[ ... ] && main`: a forma com && devolve 1 quando o
# arquivo e sourceado, e com set -e isso aborta quem sourceou.
if [ "${BASH_SOURCE[0]}" = "$0" ]; then
  main "$@"
fi
