---
name: auditoria-visual
description: Audita uma interface medindo o que ela renderiza, em vez de inspecionar o codigo. Mede contraste nos pixels, rolagem horizontal por largura, alvos de toque, movimento reduzido e erros de console. Use ao terminar uma tela, antes de publicar, ou quando um defeito visual nao aparece na leitura do CSS.
---

# Auditoria visual por medicao

Ler CSS nao prova nada sobre o que a pessoa ve. Esta skill roda a pagina num
navegador de verdade e mede.

## Quando

Depois que a tela existe e antes de ela sair. Nao serve para decidir o que
desenhar; serve para descobrir o que voce desenhou sem querer.

## Como rodar

```bash
python3 scripts/auditar.py http://localhost:5173/
python3 scripts/auditar.py --dir ./dist --base /meu-projeto/
```

Precisa de `playwright` e `Pillow`. Sem servidor no ar, `--dir` sobe um dentro
do proprio processo — mais previsivel que gerenciar um processo separado.

## O que ele mede, e por que cada um

### Contraste, nos pixels

**Nao** pela arvore do DOM. O caminhador por DOM para na primeira camada com
`background-color` e nao compoe a cadeia: num cabecalho semitransparente sobre
um heroi escuro ele reporta a cor do `body`, que pode estar tres tons longe da
verdade.

> Medido nesta suite: um botao deu **2,17:1** pelo DOM e **4,47:1** nos pixels.
> O DOM errou o numero por um fator de dois — e acertou o lugar. Use os dois: o
> DOM aponta onde olhar, o pixel diz se passa.

Converta a cor pelo canvas (`ctx.fillStyle = cor`), nunca lendo os numeros do
`getComputedStyle` a mao: o navegador devolve `oklch(0.22 0.018 185)`, e tratar
isso como RGB da um resultado que parece plausivel e esta errado.

### Rolagem horizontal

`scrollWidth > clientWidth` em 1440, 900 e 390px. A causa quase sempre e um
filho com largura maior que a janela e sem `overflow: hidden` no pai — uma
faixa animada, um bloco de codigo, uma tabela.

### Alvos de toque

Tudo clicavel abaixo de 44x44px, exceto link dentro de frase (excecao da
WCAG 2.5.8). Um link sozinho numa linha **nao** e excecao.

### Movimento reduzido

Com `prefers-reduced-motion: reduce`, confira que as animacoes pararam **e que
o conteudo apareceu**. O defeito que importa nao e a animacao rodando demais; e
o conteudo que some quando ela nao roda.

> Uma revelacao que zera `opacity` e espera um `IntersectionObserver` entrega a
> secao **em branco** numa aba em segundo plano, num renderizador headless ou
> numa captura de pagina inteira. Anime `transform`; deixe a opacidade em paz.

### Erros de console

`pageerror` e `console.error`. Um erro so costuma significar uma secao inteira
que nao montou.

## Armadilhas que a leitura do codigo nao pega

| Sintoma | Causa |
|---|---|
| Secoes coladas apesar de `section { margin-top }` | Uma classe utilitaria com `margin: 0 auto` — especificidade (0,1,0) vence (0,0,1). Use `margin-inline` |
| Secao em branco so na captura | Revelacao que gateia `opacity` num observer que nao disparou |
| Texto quebrando uma palavra por linha | Filho caiu numa coluna estreita da grade do pai; fixe a `grid-column` |
| Descricao em fonte monoespacada alinhada a direita | Herdou a regra do `dd` da tabela em volta |
| Barra de rolagem escura numa pagina clara | Falta `color-scheme` no `:root` |

## Como reportar

Uma linha por par medido, com o valor e o minimo. Diga o que **passou**
tambem: um relatorio que so lista falha nao deixa ver a cobertura.

Quando o numero do DOM e o do pixel divergirem, reporte os dois e diga qual
voce usou. Esconder a divergencia joga fora a informacao mais util.
