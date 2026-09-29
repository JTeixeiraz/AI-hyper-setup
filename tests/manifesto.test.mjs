import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { gerar } from "../scripts/gerar-manifesto.mjs";

const upstreams = JSON.parse(readFileSync("fontes/upstreams.json", "utf8"));
const classificacao = JSON.parse(readFileSync("fontes/classificacao.json", "utf8"));

test("gera uma entrada por skill instalavel", () => {
  const m = gerar(upstreams, classificacao);
  const naoInstalaveis = classificacao.filter(
    (s) => s.origem === "EXCLUIDA" || s.origem === "symlink-local",
  ).length;
  assert.equal(m.skills.length, classificacao.length - naoInstalaveis);
});

test("resolve o upstream de uma skill git em repo, licenca e ignorar", () => {
  const m = gerar(upstreams, [{ nome: "seo", origem: "git", upstream: "claude-seo" }]);
  const s = m.skills[0];
  assert.equal(s.repo, "https://github.com/AgriciDaniel/claude-seo");
  assert.equal(s.licenca, "MIT");
  assert.deepEqual(s.ignorar, ["ms-playwright", "node_modules"]);
  assert.equal(s.subpasta, "skills/seo");
});

test("recusa uma skill git cujo upstream nao existe", () => {
  assert.throws(
    () => gerar(upstreams, [{ nome: "x", origem: "git", upstream: "inexistente" }]),
    /upstream desconhecido: inexistente/,
  );
});

test("recusa uma origem que nao esta no vocabulario", () => {
  assert.throws(
    () => gerar(upstreams, [{ nome: "x", origem: "telepatia" }]),
    /origem invalida: telepatia/,
  );
});

test("skill agente preserva descricao e dica, e nao ganha repo", () => {
  const m = gerar(upstreams, [
    { nome: "x", origem: "agente", descricao: "d", dica: "t" },
  ]);
  assert.equal(m.skills[0].descricao, "d");
  assert.equal(m.skills[0].dica, "t");
  assert.equal(m.skills[0].repo, undefined);
});

test("skills excluidas nao entram no manifesto", () => {
  const m = gerar(upstreams, [{ nome: "xpe-db-query", origem: "EXCLUIDA" }]);
  assert.equal(m.skills.length, 0);
});

test("symlinks locais nao entram no manifesto", () => {
  const m = gerar(upstreams, [{ nome: "remotion-maps", origem: "symlink-local" }]);
  assert.equal(m.skills.length, 0);
});
