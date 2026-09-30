import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, readFileSync, existsSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { lerSettings, registrarHooks } from "../cerebro/settings.mjs";

const novo = () => mkdtempSync(join(tmpdir(), "hs-"));
const COMANDOS = {
  SessionStart: "node ~/.ai-hyper-setup/cerebro/abrir.mjs",
  SessionEnd: "node ~/.ai-hyper-setup/cerebro/fechar.mjs",
};

test("classifica arquivo ausente", () => {
  const d = novo();
  assert.equal(lerSettings(join(d, "nao-existe.json")).estado, "ausente");
  rmSync(d, { recursive: true });
});

test("classifica JSON invalido sem lancar", () => {
  const d = novo(), f = join(d, "settings.json");
  writeFileSync(f, '{ "hooks": { ops');
  assert.equal(lerSettings(f).estado, "invalido");
  rmSync(d, { recursive: true });
});

test("classifica JSON valido que nao e objeto", () => {
  const d = novo(), f = join(d, "settings.json");
  writeFileSync(f, '["isto e um array"]');
  assert.equal(lerSettings(f).estado, "invalido");
  rmSync(d, { recursive: true });
});

// Review Focus #5 — o caso cujo dano e irreversivel.
test("NAO grava por cima de um settings.json invalido", () => {
  const d = novo(), f = join(d, "settings.json");
  const original = '{ "hooks": { isto esta quebrado';
  writeFileSync(f, original);
  const r = registrarHooks(f, COMANDOS);
  assert.equal(r.estado, "falhou");
  assert.match(r.motivo, /invalido/);
  assert.equal(readFileSync(f, "utf8"), original, "o arquivo foi alterado");
  assert.equal(existsSync(f + ".bak-pre-hyper"), false, "criou backup de lixo");
  rmSync(d, { recursive: true });
});

test("preserva hooks de terceiros ao acrescentar os nossos", () => {
  const d = novo(), f = join(d, "settings.json");
  writeFileSync(f, JSON.stringify({
    model: "claude-opus-5",
    hooks: {
      SessionStart: [{ hooks: [{ type: "command", command: "claude-flow restore" }] }],
      PreToolUse: [{ matcher: "Bash", hooks: [{ command: "rtk hook claude" }] }],
    },
  }));
  assert.equal(registrarHooks(f, COMANDOS).estado, "instalado");
  const d2 = JSON.parse(readFileSync(f, "utf8"));
  assert.equal(d2.model, "claude-opus-5");
  assert.equal(d2.hooks.PreToolUse[0].hooks[0].command, "rtk hook claude");
  assert.equal(d2.hooks.SessionStart[0].hooks[0].command, "claude-flow restore");
  assert.equal(d2.hooks.SessionStart.length, 2);
  assert.equal(d2.hooks.SessionEnd.length, 1);
  rmSync(d, { recursive: true });
});

test("faz backup antes de gravar", () => {
  const d = novo(), f = join(d, "settings.json");
  writeFileSync(f, '{"model":"x"}');
  registrarHooks(f, COMANDOS);
  assert.equal(existsSync(f + ".bak-pre-hyper"), true);
  assert.equal(JSON.parse(readFileSync(f + ".bak-pre-hyper", "utf8")).model, "x");
  rmSync(d, { recursive: true });
});

test("cria o arquivo quando nao existe", () => {
  const d = novo(), f = join(d, "settings.json");
  assert.equal(registrarHooks(f, COMANDOS).estado, "instalado");
  assert.equal(JSON.parse(readFileSync(f, "utf8")).hooks.SessionStart.length, 1);
  rmSync(d, { recursive: true });
});

test("rodar duas vezes nao duplica nem regrava", () => {
  const d = novo(), f = join(d, "settings.json");
  registrarHooks(f, COMANDOS);
  const r = registrarHooks(f, COMANDOS);
  assert.equal(r.estado, "ja-existia");
  assert.equal(JSON.parse(readFileSync(f, "utf8")).hooks.SessionStart.length, 1);
  rmSync(d, { recursive: true });
});
