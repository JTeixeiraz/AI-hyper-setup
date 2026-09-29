#!/usr/bin/env bats

setup() {
  source "${BATS_TEST_DIRNAME}/../instalar.sh"
}

@test "tem() encontra um comando que existe" {
  run tem sh
  [ "$status" -eq 0 ]
}

@test "tem() nao encontra um comando inexistente" {
  run tem comando-que-nao-existe-xyz
  [ "$status" -ne 0 ]
}

@test "sourcear instalar.sh nao executa main" {
  run bash -c "source '${BATS_TEST_DIRNAME}/../instalar.sh'; echo SOURCEADO"
  [ "$status" -eq 0 ]
  [ "${lines[-1]}" = "SOURCEADO" ]
}

@test "detectar_so reconhece Linux" {
  uname() { echo "Linux"; }
  export -f uname
  run detectar_so
  [ "$output" = "linux" ]
}

@test "detectar_so reconhece Darwin como macos" {
  uname() { echo "Darwin"; }
  export -f uname
  run detectar_so
  [ "$output" = "macos" ]
}

@test "detectar_so reconhece Git Bash como windows" {
  uname() { echo "MINGW64_NT-10.0"; }
  export -f uname
  run detectar_so
  [ "$output" = "windows" ]
}

@test "detectar_so devolve desconhecido no resto" {
  uname() { echo "Plan9"; }
  export -f uname
  run detectar_so
  [ "$output" = "desconhecido" ]
}

@test "detectar_arq mapeia aarch64 para arm64" {
  uname() { echo "aarch64"; }
  export -f uname
  run detectar_arq
  [ "$output" = "arm64" ]
}

@test "detectar_arq mapeia x86_64 para x64" {
  uname() { echo "x86_64"; }
  export -f uname
  run detectar_arq
  [ "$output" = "x64" ]
}

@test "dir_skills devolve o caminho do claude" {
  run dir_skills claude
  [ "$output" = "$HOME/.claude/skills" ]
}

@test "dir_skills devolve o caminho do codex" {
  run dir_skills codex
  [ "$output" = "$HOME/.codex/skills" ]
}

@test "dir_skills devolve o caminho do agy" {
  run dir_skills agy
  [ "$output" = "$HOME/.gemini/config/skills" ]
}

@test "detectar_agentes acha os que existem no PATH" {
  tem() { [ "$1" = "codex" ]; }
  detectar_agentes
  [ "${#AGENTES[@]}" -eq 1 ]
  [ "${AGENTES[0]}" = "codex" ]
}

@test "detectar_agentes devolve vazio quando nao ha nenhum" {
  tem() { return 1; }
  detectar_agentes
  [ "${#AGENTES[@]}" -eq 0 ]
}

@test "escolher_agente sem TTY cai no primeiro sem travar" {
  run bash -c "source '${BATS_TEST_DIRNAME}/../instalar.sh'
               AGENTES=(claude codex)
               escolher_agente < /dev/null
               echo \$AGENTE_ESCOLHIDO"
  [ "$status" -eq 0 ]
  [ "${lines[-1]}" = "claude" ]
}

@test "HYPER_AGENTE vence a deteccao" {
  run bash -c "source '${BATS_TEST_DIRNAME}/../instalar.sh'
               HYPER_AGENTE=codex
               AGENTES=(claude codex)
               escolher_agente < /dev/null
               echo \$AGENTE_ESCOLHIDO"
  [ "${lines[-1]}" = "codex" ]
}

@test "registrar acumula passos" {
  PASSOS=()
  registrar rtk instalado "v0.50.0"
  registrar obsidian ja-existia "1.13.7"
  [ "${#PASSOS[@]}" -eq 2 ]
}

@test "gravar_estado produz JSON valido" {
  local tmp; tmp="$(mktemp -d)"
  PASSOS=(); SO=linux; ARQ=x64; AGENTE_ESCOLHIDO=claude
  registrar rtk instalado "v0.50.0"
  gravar_estado "$tmp/estado.json"
  run node -e "JSON.parse(require('fs').readFileSync('$tmp/estado.json','utf8'))"
  [ "$status" -eq 0 ]
  rm -rf "$tmp"
}

@test "gravar_estado registra item, estado e detalhe" {
  local tmp; tmp="$(mktemp -d)"
  PASSOS=(); SO=linux; ARQ=x64; AGENTE_ESCOLHIDO=claude
  registrar rtk instalado "v0.50.0"
  gravar_estado "$tmp/estado.json"
  run node -e "
    const e=JSON.parse(require('fs').readFileSync('$tmp/estado.json','utf8'));
    const p=e.passos[0];
    if(p.item!=='rtk'||p.estado!=='instalado'||p.detalhe!=='v0.50.0') process.exit(1);
    if(e.agente.nome!=='claude') process.exit(1);
  "
  [ "$status" -eq 0 ]
  rm -rf "$tmp"
}

@test "gravar_estado funciona em caminho com espaco" {
  local tmp; tmp="$(mktemp -d)/com espaco no nome"
  mkdir -p "$tmp"
  PASSOS=(); SO=macos; ARQ=arm64; AGENTE_ESCOLHIDO=claude
  registrar rtk instalado "v0.50.0"
  gravar_estado "$tmp/estado.json"
  [ -f "$tmp/estado.json" ]
  run node -e "JSON.parse(require('fs').readFileSync('$tmp/estado.json','utf8'))"
  [ "$status" -eq 0 ]
  rm -rf "$tmp"
}

@test "flag_rtk mapeia cada agente para a variante certa" {
  run flag_rtk claude; [ "$output" = "-g" ]
  run flag_rtk codex;  [ "$output" = "-g --codex" ]
  run flag_rtk agy;    [ "$output" = "-g --agent antigravity" ]
}

@test "instalar_rtk pula quando o rtk ja existe" {
  PASSOS=()
  tem() { [ "$1" = "rtk" ]; }
  rtk() { echo "rtk 0.50.0"; }
  AGENTE_ESCOLHIDO=claude
  instalar_rtk
  [[ "${PASSOS[0]}" == rtk\|ja-existia\|* ]]
}

@test "obsidian_presente acha pelo binario no PATH" {
  tem() { [ "$1" = "obsidian" ]; }
  run obsidian_presente
  [ "$status" -eq 0 ]
}

@test "obsidian_presente acha pelo diretorio de configuracao" {
  local tmp; tmp="$(mktemp -d)"
  mkdir -p "$tmp/.config/obsidian"
  tem() { return 1; }
  HOME="$tmp"
  run obsidian_presente
  [ "$status" -eq 0 ]
  rm -rf "$tmp"
}

@test "obsidian_presente devolve 1 quando nao ha nada" {
  local tmp; tmp="$(mktemp -d)"
  tem() { return 1; }
  HOME="$tmp"
  run obsidian_presente
  [ "$status" -ne 0 ]
  rm -rf "$tmp"
}

@test "instalar_obsidian pula quando ja existe" {
  PASSOS=()
  obsidian_presente() { return 0; }
  instalar_obsidian
  [[ "${PASSOS[0]}" == obsidian\|ja-existia\|* ]]
}

@test "instalar_obsidian falha sem interromper" {
  PASSOS=()
  SO=desconhecido
  obsidian_presente() { return 1; }
  run instalar_obsidian
  [ "$status" -eq 0 ]
}

@test "baixar_repo sai com 2 e nao deixa sujeira quando a rede falha" {
  local tmp; tmp="$(mktemp -d)"
  BASE="$tmp/base"
  curl() { return 7; }
  git()  { return 1; }
  run baixar_repo
  [ "$status" -eq 2 ]
  [ ! -d "$BASE" ]
  rm -rf "$tmp"
}

@test "baixar_repo usa HYPER_LOCAL em vez de baixar" {
  local tmp; tmp="$(mktemp -d)"
  mkdir -p "$tmp/origem/skills"
  echo "conteudo" > "$tmp/origem/manifesto.json"
  PASSOS=()
  BASE="$tmp/base"
  HYPER_LOCAL="$tmp/origem"
  curl() { return 7; }
  run baixar_repo
  [ "$status" -eq 0 ]
  rm -rf "$tmp"
}

@test "instalar_skill pula quando a skill ja existe" {
  local tmp; tmp="$(mktemp -d)"
  PASSOS=()
  BASE="$tmp/base"
  mkdir -p "$BASE/skills/hyper-setup-initialize"
  echo "conteudo" > "$BASE/skills/hyper-setup-initialize/SKILL.md"
  mkdir -p "$tmp/skills/hyper-setup-initialize"
  echo "ja estava aqui" > "$tmp/skills/hyper-setup-initialize/SKILL.md"
  dir_skills() { echo "$tmp/skills"; }
  AGENTE_ESCOLHIDO=claude
  instalar_skill
  [[ "${PASSOS[0]}" == skill-hyper-setup\|ja-existia\|* ]]
  [ "$(cat "$tmp/skills/hyper-setup-initialize/SKILL.md")" = "ja estava aqui" ]
  rm -rf "$tmp"
}

@test "instalar_skill copia quando nao existe" {
  local tmp; tmp="$(mktemp -d)"
  PASSOS=()
  BASE="$tmp/base"
  mkdir -p "$BASE/skills/hyper-setup-initialize"
  echo "conteudo novo" > "$BASE/skills/hyper-setup-initialize/SKILL.md"
  mkdir -p "$tmp/skills"
  dir_skills() { echo "$tmp/skills"; }
  AGENTE_ESCOLHIDO=claude
  instalar_skill
  [[ "${PASSOS[0]}" == skill-hyper-setup\|instalado\|* ]]
  [ "$(cat "$tmp/skills/hyper-setup-initialize/SKILL.md")" = "conteudo novo" ]
  rm -rf "$tmp"
}

# curl | bash entrega o script pelo stdin, e ali o array BASH_SOURCE fica
# vazio. Rodar por arquivo nao exercita esse caminho — e ele e o caminho
# principal do produto.
@test "roda main quando o script chega pelo stdin (curl | bash)" {
  run bash -c "cat '${BATS_TEST_DIRNAME}/../instalar.sh' | HYPER_AGENTE=claude bash 2>&1 | head -3"
  [ "$status" -eq 0 ]
  [[ "$output" == *"AI Hyper Setup"* ]]
  [[ "$output" != *"unbound variable"* ]]
}

@test "nao roda main ao ser sourceado" {
  run bash -c "source '${BATS_TEST_DIRNAME}/../instalar.sh'; echo FIM"
  [ "$status" -eq 0 ]
  [[ "$output" != *"sistema:"* ]]
  [[ "${lines[-1]}" == "FIM" ]]
}
