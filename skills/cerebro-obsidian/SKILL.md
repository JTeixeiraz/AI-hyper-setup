---
name: cerebro-obsidian
description: Le e escreve no vault do Obsidian para manter contexto entre sessoes. Use ao comecar a trabalhar num projeto que ja tenha notas no vault, ao terminar uma sessao com decisoes ou bugs a registrar, ou quando o usuario pedir para consultar ou atualizar o cerebro.
---

# O cerebro no Obsidian

O vault fica em `{{VAULT}}`. Ele e a memoria entre sessoes: o que nao for
escrito ali se perde quando a sessao fecha.

## Ao comecar

Procure um MOC com o nome do projeto (`<Projeto>.md`) na raiz do vault. Se
existir, leia antes de agir — ele tem as decisoes ja tomadas e os defeitos ja
encontrados. Evita refazer discussao resolvida.

## Ao terminar

Registre o que **mudou de estado**, nao o que foi feito. Um log de comandos nao
vale a leitura de amanha; uma decisao com o motivo, sim.

Vale registrar: decisao tomada e por que; defeito encontrado com a causa raiz;
armadilha que custou tempo; numero medido. Nao vale: "rodei os testes", "li o
arquivo X", qualquer coisa que o `git log` ja conte.

**Se nada relevante mudou, nao escreva nada.** Um vault cheio de notas vazias e
pior que um vault pequeno.

## A gramatica

Um **MOC** por assunto na raiz, com as notas numeradas numa pasta irma de mesmo
nome.

```
Projeto.md              o MOC: o que e, estado, indice
Projeto/
  01 - Contexto e Tese.md
  02 - Arquitetura.md
  18 - Bugs e Incidentes.md
```

Frontmatter em toda nota:

```yaml
---
tags: [projeto, area, tipo]
data_criacao: 2026-09-29
status: em-andamento
---
```

Datas sempre absolutas. "Ontem" nao significa nada daqui a tres meses.

Callouts para separar os registros por natureza:

```markdown
> [!info] contexto
> [!important] o que nao pode ser esquecido
> [!tip] atalho que vale lembrar
> [!bug] defeito, com causa raiz
> [!warning] armadilha
> [!danger] o que trava e nao destrava sozinho
> [!success] o que ficou pronto
```

Wikilinks `[[Nome da Nota]]` entre as notas. Link para nota que ainda nao existe
e valido — marca o que vale escrever depois.

## Escrevendo bem

Uma frase que diz o que aconteceu vale mais que um paragrafo que descreve o
processo. Prefira o numero medido a adjetivo: "12,3% dos pixels mudaram" em vez
de "mudou bastante".

Quando um defeito aparecer, escreva a **causa raiz**, nao o sintoma. O sintoma
voce reconhece de novo; a causa voce esquece.
