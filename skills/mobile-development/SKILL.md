---
name: mobile-engagement
description: Projeta e implementa mecânicas de engajamento, retenção, ativação e monetização em apps mobile (especialmente Flutter/Dart) — streaks, gamificação, onboarding, paywalls, trials, push notifications, widgets, analytics e loops de compartilhamento. Use sempre que o usuário estiver trabalhando em um app mobile e mencionar retenção, churn, engajamento, gamificação, streak, onboarding, paywall, assinatura, conversão, trial, "usuários não voltam", "como faço o usuário usar mais", notificações push, ou quiser aumentar receita/DAU de um app — mesmo que ele não use a palavra "engajamento". Use também quando o usuário pedir para revisar o funil, o onboarding ou a tela de assinatura de um app existente.
---

# Mobile Engagement & Monetization

Skill para desenhar e implementar o que faz um app mobile ser usado todo dia e converter em receita.

A tese central, que vale mais do que qualquer mecânica isolada:

> Os melhores apps não retêm usuários por causa de pontos ou badges. Eles fazem as pessoas sentirem que estão **progredindo**, que estão **protegendo algo que conquistaram** e que estão **se tornando alguém melhor**. Pontos e badges são a superfície; isso aqui é o motor.

Duas consequências práticas disso, e elas guiam toda a skill:

1. Recompensa por **participação** (XP genérico, badge de "abriu o app") não gera hábito e ainda corrói motivação intrínseca. Recompensa por **melhoria** (recorde pessoal, "você estudou 20% mais que semana passada") gera.
2. Pressão punitiva funciona a curto prazo e destrói a longo prazo. Toda mecânica de perda precisa de uma válvula de escape.

## Ordem de trabalho

Não pule etapas. Gamificar um app que ninguém ativa é otimizar o que não existe.

**1. Diagnóstico antes de construir.** Antes de sugerir qualquer mecânica, descubra:
- Qual é o **aha moment** do app (a ação que, quando o usuário faz, ele fica)?
- Qual é a **North Star** (uma métrica que captura valor entregue, não vaidade)?
- Como estão D1 / D7 / D30 hoje, e como estão comparados à mediana da **categoria** do app?

Thresholds que mudam a decisão:
- **D1 < 25%** → o problema é onboarding/ativação. Não gamifique ainda, não compre tráfego ainda.
- **Curva de retenção não achata acima de ~7%** → não há núcleo de usuários com valor durável. Conserte o produto.
- **Churn mensal > 14%** → foque em retenção antes de escalar aquisição.

Se o usuário não tiver esses números instrumentados, o primeiro entregável é a instrumentação. Veja `references/metricas.md`.

**2. Ativação (o Dia 0 decide quase tudo).** Nunca mostre um zero. Onboarding que coleta metas e cria investimento. Adie signup e permissão de push até depois do primeiro valor. Veja `references/mecanicas.md` (princípios 1 e 2) e `references/monetizacao.md`.

**3. Hábito.** Uma métrica diária com algo sempre incompleto, streak com proteção automática, recompensa de melhoria, grupos pequenos, progresso compartilhado. Veja `references/mecanicas.md`.

**4. Monetização.** Paywall, trial calibrado pelo time-to-value, ancoragem, recuperação de churn involuntário, Pix Automático no Brasil. Veja `references/monetizacao.md`.

**5. Implementação.** Pacotes Flutter, push, widgets, Live Activities, regras das lojas. Veja `references/flutter.md`.

**6. Checagem ética/legal.** Passe o que foi desenhado por `references/antipadroes.md` antes de entregar. Isso não é burocracia: dark pattern hoje gera rejeição na App Store e responsabilidade jurídica (FTC/ROSCA nos EUA, CDC no Brasil).

## Os 7 princípios (resumo executivo)

Detalhamento, base científica e variações em `references/mecanicas.md`.

1. **Nunca mostre um zero.** Ninguém se cadastra para ver 0 pontos, 0 dias e uma página de conquistas vazia. Dê a primeira recompensa por criar a conta ou terminar o onboarding — 10 pontos, barra em 10%, badge "Começando". Base: *endowed progress effect* (34% vs 19% de conclusão no estudo do lava-jato).
2. **Faça vencer parecer possível.** Ninguém abre um app para descobrir que está em #82.491. Ligas semanais de 20-30 pessoas com atividade parecida, não leaderboard global.
3. **Torne o progresso compartilhado.** Streak individual é fácil de abandonar; streak compartilhado significa que outra pessoa perde se você não aparecer.
4. **Sempre deixe uma coisa por terminar.** Três anéis, um incompleto. Escolha **uma** métrica diária e mostre exatamente quanto falta. Base: efeito Zeigarnik + goal-gradient.
5. **Recompense o retorno.** Todo usuário vai perder um dia. Streak freeze, bônus de volta, "complete uma tarefa hoje e recupere sua sequência". O usuário em risco é justamente o que não abriu o app — então a proteção precisa ser **automática**, não uma decisão dele.
6. **Dê algo que valha a pena guardar.** Ninguém compartilha feature; as pessoas compartilham prova. Wrapped, recordes, recaps. Gere um card compartilhável a cada marco, já no formato de story.
7. **Recompense a melhoria, não a presença.** Substitua XP sem significado por progresso que o usuário consegue explicar numa frase: "corri 30s mais rápido que meu recorde".

## Como entregar

Quando o pedido for de código, entregue implementação real, não pseudocódigo: modelo de dados do streak (incluindo fuso horário e o caso do usuário que viaja), lógica de freeze, eventos de analytics já nomeados, widget de paywall. Em Flutter, prefira `purchases_flutter` (RevenueCat) para assinatura e `home_widget` para widget de home screen — os detalhes e as pegadinhas estão em `references/flutter.md`.

Quando o pedido for de estratégia, seja específico e numérico. "Melhore o onboarding" é inútil; "corte de 9 para 4 telas, mova o pedido de push para depois da primeira meta concluída, e o paywall para depois do plano personalizado" é acionável.

Sempre diga **o que medir** para saber se funcionou, e em quanto tempo esperar sinal. Uma mudança de ativação aparece em D1 em poucos dias; uma mudança de hábito só aparece em D30 depois de um mês.

## Calibragem honesta

Os números citados nas referências vêm de fontes de qualidade desigual, e isso importa na hora de aconselhar:
- **Evidência forte:** endowed progress, goal-gradient, loss aversion, overjustification effect — estudos revisados por pares.
- **Direcional:** casos de empresa (Duolingo, Cal AI, Spotify) — números de blog corporativo, sem controle.
- **Benchmarks:** RevenueCat, Adjust, Adapty medem populações diferentes; não compare números entre relatórios como se fossem a mesma escala. Compare sempre com a mediana da categoria do app, não com a média global — a variação entre categorias em D30 é maior do que qualquer otimização interna consegue fechar.

Quando o usuário perguntar "isso funciona?", diferencie o que é lei do comportamento humano do que é anedota de um app que também tinha marca, timing e orçamento de marketing.
