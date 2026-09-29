---
name: tokens-oklch
description: Monta um sistema de tokens de cor em OKLCH com papel claro e paineis escuros, incluindo modo escuro, color-scheme e as armadilhas de nomenclatura. Use ao comecar um projeto visual, ao definir a paleta, ou quando o tema claro e o escuro divergirem.
---

# Tokens em OKLCH

Papel claro em volta, painel escuro para o que e denso. Uma cor de acao. O
humor mora na marca e na tipografia, nunca na superficie.

## A armadilha que pega primeiro

> **Creme, areia e bege sao o padrao saturado de IA.** Toda a faixa
> quente-neutra (L 0.84–0.97, C < 0.06, matiz 40–100) le como
> papel/pergaminho por mais que voce chame de outra coisa. E os **nomes**
> denunciam: `--papel`, `--cream`, `--sand`, `--bone`, `--linen`, `--ivory`.

Se o briefing pede "quente" ou "editorial", a resposta **nao** e um branco
amornado. Escolha uma destas:

- branco literal, `oklch(1 0 0)` — Stripe, Notion, Linear usam `#ffffff` mesmo
- um off-white com croma puxado para a **matiz da marca**, nao para o quente
- uma cor saturada da marca ocupando a superficie (estrategia Committed)

O calor vem do acento e da tipografia.

## A estrutura

```css
:root {
  color-scheme: light;          /* sem isto, controles e barra de rolagem
                                   vem escuros contra uma pagina clara */

  --sup:   oklch(1 0 0);        /* superficie */
  --sup-2: oklch(0.975 0.004 180);

  --ink:   oklch(0.22 0.018 185);   /* tinta sobre a superficie */
  --ink-2: oklch(0.44 0.016 185);   /* secundaria: confira 4.5:1 */
  --linha: oklch(0.905 0.008 185);

  --pnl:      oklch(0.225 0.038 188);  /* painel: escuro COM croma */
  --pnl-2:    oklch(0.285 0.036 188);
  --pnl-ink:  oklch(0.97 0.006 185);
  --pnl-ink-2:oklch(0.755 0.022 185);

  --marca: oklch(0.52 0.092 172);
  --acao:  oklch(0.47 0.165 30);       /* complemento da marca */
}
```

Tres decisoes que valem explicar:

**O painel tem croma.** `oklch(0.225 0.038 188)` em vez de cinza neutro faz
ele parecer metal patinado em vez de terminal generico. Croma 0.03–0.05 e o
suficiente; acima disso vira cor, nao neutro tingido.

**A acao e o complemento da marca.** Matiz da marca + 180° dá o contraste
maximo dentro do sistema. Aqui: teal 172 → ferrugem 30.

**Neutros tingidos puxam para a matiz da marca**, nunca para o quente por
reflexo. Croma 0.005–0.018 basta.

## Modo escuro

Escreva o `@media` **por fora**, nao aninhado: CSS nesting nao e universal.

```css
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) { --sup: oklch(0.13 0.01 188); /* ... */ }
}
:root[data-theme="dark"] { --sup: oklch(0.13 0.01 188); /* ... */ }
```

O `:not([data-theme="light"])` deixa a escolha manual vencer a do sistema: ela
e mais recente e mais especifica.

**Nao ter modo escuro e uma decisao valida** — mas so depois de escrever uma
frase de cena concreta que force a resposta: quem usa, onde, sob que luz, em
que estado de animo. Se a frase nao decide, ela nao esta concreta o bastante.
Decidindo por claro, declare `color-scheme: light`.

## Contraste

Confira `--ink-2` e `--pnl-ink-2` contra seus fundos: sao os que falham. Texto
de corpo precisa de 4.5:1; texto grande (>=24px, ou >=18.66px em negrito) de
3:1.

**Meca nos pixels.** Ver [[auditoria-visual]] — o calculo pela arvore do DOM
erra em fundo semitransparente, em canvas e em gradiente.

Uma cor de acao com texto branco costuma nao chegar a 4.5:1 no tom que parece
bonito. `oklch(0.58 0.16 32)` da 3,3:1; `oklch(0.47 0.165 30)` da 5,0:1. A
diferenca nao se ve lado a lado, e uma passa e a outra nao.

## Escala e ritmo

Escala modular de razao >= 1.25 entre degraus; abaixo disso le como
indecisao. Fluida so no topo, onde a diferenca entre um celular e um monitor
e grande.

```css
--t-corpo:  1.0625rem;
--t-grande: clamp(1.6rem, 1.1rem + 1.9vw, 2.1rem);
--t-heroi:  clamp(2.6rem, 1.5rem + 4.4vw, 4.6rem);
```

Teto do heroi: 6rem. Acima disso a pagina esta gritando.

## A armadilha de especificidade

Um token so serve se a regra que o usa vencer. Classe utilitaria com
`margin: 0 auto` (0,1,0) vence `section { margin-top: var(--e-5) }` (0,0,1) e
zera o ritmo vertical inteiro **sem erro nenhum**.

Use `margin-inline: auto` para centralizar sem tocar no eixo vertical.
