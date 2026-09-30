#!/usr/bin/env bash
# Roda o instalador em conteineres e confere o que ele reporta.
#
# Usa HYPER_LOCAL=/repo: o conteiner ja tem o repositorio copiado, e depender
# do GitHub tornaria o teste refem da rede e da publicacao do repo.
set -euo pipefail

cd "$(dirname "$0")/../.."
falhas=0

checar() {
  local nome="$1" esperado="$2" saida="$3"
  if printf '%s' "$saida" | grep -q "$esperado"; then
    printf '  ok    %s\n' "$nome"
  else
    printf '  FALHA %s (esperava /%s/)\n' "$nome" "$esperado"
    falhas=$((falhas + 1))
  fi
}

printf 'maquina limpa\n'
docker build -q -f tests/integracao/Dockerfile.limpo -t hyper-limpo . >/dev/null
saida="$(docker run --rm hyper-limpo bash -c '
  HYPER_LOCAL=/repo bash instalar.sh 2>&1
  echo "---"
  cat ~/.ai-hyper-setup/estado.json')"
checar "escolhe o claude"      'agente: claude'                                  "$saida"
checar "instala o rtk"         '"item": "rtk", "estado": "instalado"'            "$saida"
checar "instala a skill"       '"item": "skill-hyper-setup", "estado": "instalado"' "$saida"
checar "manda rodar a skill"   '/hyper-setup-initialize'                         "$saida"

# O produto e um curl canalizado para o bash. Rodar por arquivo nao exercita
# o mesmo caminho: pelo stdin o array BASH_SOURCE fica vazio.
printf 'pelo stdin (curl | bash)\n'
saida="$(docker run --rm hyper-limpo bash -c 'cat instalar.sh | HYPER_LOCAL=/repo bash 2>&1')"
checar "main roda pelo stdin"  'Terreno preparado'  "$saida"
if printf '%s' "$saida" | grep -q 'unbound variable'; then
  printf '  FALHA sem unbound variable\n'; falhas=$((falhas + 1))
else
  printf '  ok    sem unbound variable\n'
fi

printf 'maquina parcial\n'
docker build -q -f tests/integracao/Dockerfile.parcial -t hyper-parcial . >/dev/null
saida="$(docker run --rm hyper-parcial bash -c '
  HYPER_LOCAL=/repo bash instalar.sh >/dev/null 2>&1
  cat ~/.ai-hyper-setup/estado.json')"
checar "pula o rtk"       '"item": "rtk", "estado": "ja-existia"'      "$saida"
checar "pula o obsidian"  '"item": "obsidian", "estado": "ja-existia"' "$saida"

# A segunda execucao e o teste que prova a idempotencia que o produto promete.
#
# Afirma sobre TODOS os passos, nao sobre os que se sabe que passam: a versao
# anterior checava so `rtk` e `skill-hyper-setup` e deixava de fora justamente
# `repositorio` e `rtk-hook`, que eram os dois que reportavam `instalado`. Um
# teste que escolhe o que olhar nao pode falhar no defeito que existe.
printf 'segunda execucao\n'
saida="$(docker run --rm hyper-limpo bash -c '
  HYPER_LOCAL=/repo bash instalar.sh >/dev/null 2>&1
  HYPER_LOCAL=/repo bash instalar.sh >/dev/null 2>&1
  cat ~/.ai-hyper-setup/estado.json')"

novos="$(printf '%s' "$saida" | grep -c '"estado": "instalado"' || true)"
if [ "$novos" -eq 0 ]; then
  printf '  ok    nada reinstalado na segunda passada\n'
else
  printf '  FALHA %s passo(s) ainda reportam instalado:\n' "$novos"
  printf '%s' "$saida" | grep '"estado": "instalado"' | sed 's/^/          /'
  falhas=$((falhas + 1))
fi

for item in rtk rtk-hook obsidian repositorio skill-hyper-setup; do
  linha="$(printf '%s' "$saida" | grep "\"item\": \"${item}\"" || true)"
  if [ -z "$linha" ]; then
    printf '  FALHA %s ausente do estado.json\n' "$item"; falhas=$((falhas + 1))
  elif printf '%s' "$linha" | grep -q '"estado": "instalado"'; then
    printf '  FALHA %s reinstalado\n' "$item"; falhas=$((falhas + 1))
  else
    printf '  ok    %s preservado\n' "$item"
  fi
done

printf '\n'
if [ "$falhas" -gt 0 ]; then
  printf '%d falha(s)\n' "$falhas"; exit 1
fi
printf 'tudo certo\n'
