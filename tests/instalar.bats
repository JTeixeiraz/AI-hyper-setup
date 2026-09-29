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
