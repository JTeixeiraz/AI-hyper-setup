import { test } from "node:test";
import assert from "node:assert/strict";
import { mesclarHook } from "../cerebro/hooks.mjs";

test("acrescenta o hook preservando os que ja existem", () => {
  const antes = {
    hooks: { SessionStart: [{ hooks: [{ type: "command", command: "claude-flow" }] }] },
  };
  const depois = mesclarHook(antes, "SessionStart", "node cerebro/abrir.mjs");
  assert.equal(depois.hooks.SessionStart.length, 2);
  assert.equal(depois.hooks.SessionStart[0].hooks[0].command, "claude-flow");
});

test("cria o array quando o evento ainda nao existe", () => {
  const depois = mesclarHook({}, "SessionEnd", "node cerebro/fechar.mjs");
  assert.equal(depois.hooks.SessionEnd.length, 1);
});

test("nao duplica um hook ja registrado", () => {
  const antes = mesclarHook({}, "SessionStart", "node cerebro/abrir.mjs");
  const depois = mesclarHook(antes, "SessionStart", "node cerebro/abrir.mjs");
  assert.equal(depois.hooks.SessionStart.length, 1);
});

test("nao muta o objeto recebido", () => {
  const antes = { hooks: { SessionStart: [] } };
  mesclarHook(antes, "SessionStart", "node cerebro/abrir.mjs");
  assert.equal(antes.hooks.SessionStart.length, 0);
});

test("recusa settings que nao e objeto", () => {
  assert.throws(() => mesclarHook(null, "SessionStart", "x"), /settings invalido/);
  assert.throws(() => mesclarHook("texto", "SessionStart", "x"), /settings invalido/);
  assert.throws(() => mesclarHook([], "SessionStart", "x"), /settings invalido/);
});
