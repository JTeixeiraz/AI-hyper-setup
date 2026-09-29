# Monetização, paywall e conversão

Índice:
- [Escolha do modelo](#escolha-do-modelo)
- [O funil que converte em 2026](#o-funil-que-converte-em-2026)
- [Design de paywall](#design-de-paywall)
- [Trial: duração e timing](#trial-duração-e-timing)
- [Churn, win-back e cobrança](#churn-win-back-e-cobrança)
- [Brasil e Pix](#brasil-e-pix)
- [ASO e ratings](#aso-e-ratings)

Todos os benchmarks abaixo vêm majoritariamente do *State of Subscription Apps* da RevenueCat (edição 2026: 115.000+ apps, US$16 bi de receita analisada), complementados por Adapty, Adjust e Superwall. Números de relatórios diferentes medem populações diferentes — não compare entre si.

---

## Escolha do modelo

O dado que derrubou o consenso: **hard paywall converte cerca de 5x mais que freemium** — 10,7% de download-to-paid em D35 contra 2,1% — com retenção anual praticamente idêntica (27% vs 28%). Receita por install em D60: US$3,09 vs US$0,38 (8x).

Isso não significa "sempre hard paywall". Significa que o medo de espantar usuário com paywall na cara estava mal calibrado. Escolha assim:

- **Hard paywall** (bloqueia o app até assinar): app que entrega um programa/resultado estruturado, onde a proposta de valor é clara antes do uso. Fitness, nutrição, finanças pessoais, produtividade com resultado prometido.
- **Freemium**: app onde efeito de rede, conteúdo gerado pelo usuário ou boca a boca importam para o crescimento. Ferramenta social, marketplace, app onde o usuário grátis tem valor para o usuário pago. Freemium captura conversão tardia — em 12 meses pode render 15-25% mais receita total, segundo a Adapty.
- **Híbrido** (assinatura + consumíveis + ads): reduz churn ao atender segmentos diferentes de disposição a pagar, ao custo de complexidade. Só depois de ter um modelo principal funcionando.

Sinal de alerta do mercado: o hard paywall em D35 caiu ~2 pontos em relação a 2025 (era 12,1%), sinal de maior resistência geral do consumidor a assinar.

**Contexto de expectativa:** app mediano gera ~US$8,3 mil/mês depois de 18 meses; top 5% passam de US$1,16M/mês. Apps lançados antes de 2020 respondem por 69% de toda a receita de assinatura; apps lançados em 2025+ respondem por 3%. Ou seja: o mercado é maduro e concentrado — o plano precisa ser nicho + retenção, não "virar o próximo unicórnio no trimestre".

## O funil que converte em 2026

O padrão dominante nos apps que mais crescem:

```
Instalação
  → Onboarding-quiz (3-5 telas de perguntas sobre metas e contexto)
  → Tela de "plano personalizado" gerado a partir das respostas
  → Paywall (trial calibrado, anual pré-selecionado)
  → Primeiro valor entregue
  → [Nunca mostre um zero aqui]
```

Por que o quiz funciona: coleta dados para personalizar **e** cria investimento psicológico (IKEA effect / sunk cost). Quem respondeu 12 perguntas sobre seus objetivos já se comprometeu antes de ver o preço. A pesquisa da Phiture indica que 3-5 telas antes do paywall superam tanto flows de 1-2 quanto de 6+ telas.

Regra do Dia 0: **55% de todos os cancelamentos de trial de 3 dias acontecem no Dia 0.** A primeira sessão é onde a assinatura é ganha ou perdida. O que fazer com isso: entregar valor real na primeira sessão, não prometer valor futuro.

## Design de paywall

**Elementos de maior impacto:**
- **Ancoragem de planos:** três opções com o anual pré-selecionado e o preço mensal equivalente exibido ("R$ 9,90/mês, cobrado anualmente"). Tipicamente 60-70% escolhem o anual.
- **Timing:** depois de o usuário definir uma meta, não antes. O paywall deve ser a ponte entre o objetivo dele e o caminho para chegar lá.
- **Personalização visível:** o paywall deve refletir o que ele respondeu no quiz.
- **Prova social específica** ("2.400 pessoas com o seu objetivo") bate prova social genérica.

**Escolha do ciclo por vertical** (SOSA 2026): games vendem 82% semanal; produtividade 77% mensal; saúde e fitness 68% anual. Vender anual num app de uso esporádico é queimar a base.

**Teste sempre remotamente.** Paywall codificado no app significa que cada teste depende de review da App Store. Use Superwall ou Adapty para mudar layout, preço exibido e copy sem release. Um dev solo que testa paywall remotamente roda em um mês o que outro roda em um ano.

## Trial: duração e timing

Não existe "7 dias" como resposta padrão. Calibre pelo **time-to-value da categoria**:

- Trials de 17-32 dias: ~42,5% de conversão mediana.
- Trials de menos de 4 dias: ~25,5% mediana **em geral** — mas convertem 10-15% **melhor** em apps utilitários e de foto, onde o valor aparece em minutos.
- Regra: trial curto quando o valor é imediato e demonstrável; trial longo quando o usuário precisa formar hábito antes de perceber o ganho.
- Exemplo de calibragem por plano (Headspace): 14 dias no anual, 7 no mensal — trial mais longo reduz o risco percebido do compromisso maior.

**Conversão trial→pago por vertical** (RevenueCat 2025): viagem 48,7%, mídia e entretenimento 43,8%, saúde e fitness 39,9%. Decil superior geral ~68,3%.

**Armadilha do refund:** o padrão "trial de 7 dias escondido no onboarding → cobrança anual" pode gerar taxa de reembolso até 4x maior. Meça **receita líquida**, não conversão em D8. Além disso, é exatamente o padrão que atrai atenção regulatória (ver `antipadroes.md`).

Lembrete obrigatório de fim de trial: exigido pelas lojas e, na prática, melhora retenção real — o usuário que é pego de surpresa cancela e pede reembolso.

## Churn, win-back e cobrança

**Números de referência:** churn mensal mediano de 13-14% — a base inteira se substitui a cada 7-8 meses. ~30% dos assinantes anuais cancelam já no primeiro mês; segundo pico na renovação do mês 12 (9-14%). **95% dos anuais que cancelam nunca voltam** — o que significa que o esforço vale muito mais em prevenção que em recuperação.

**A vitória mais barata que existe:** churn involuntário. Cartão expirado, falha de autorização. Configurar **grace period** e **billing retry (dunning)** no Android recupera 15-20% da receita perdida quase imediatamente, sem nenhum trabalho de produto. Faça isso antes de qualquer teste de paywall.

**Ofertas de retenção** no momento do cancelamento (pausa, downgrade, desconto) — a pausa costuma performar melhor que o desconto, porque preserva o preço.

**Win-back** de lapsados: campanha segmentada por motivo de saída, não um blast único.

**Nota sobre apps com IA:** geram 41% mais receita por usuário, mas o churn é 36% mais rápido. Custo de inferência + churn alto = margem enganosa. Modele o LTV com o churn real, não com o do mercado geral.

## Brasil e Pix

- Pix responde por ~32% das compras digitais no país e caminha para 40% em 2026; ~167,5M de brasileiros usam.
- **Pix Automático**, lançado pelo Banco Central em 16/jun/2025, viabiliza cobrança recorrente com autorização única. É a peça que faltava para assinatura no Brasil: elimina boa parte do churn involuntário (não expira como cartão) e alcança cerca de 60M de brasileiros sem cartão de crédito. A adoção acelerou entre o Q4/2025 e o Q1/2026.
- **Pix Parcelado**: a cultura de parcelamento é forte no Brasil; oferecer o anual parcelado costuma converter melhor que o anual à vista, mesmo com o mesmo total.
- Atenção: o Banco Central facilita o consentimento, não a operação inteira de billing. É preciso usar um PSP (Adyen, EBANX, PagBrasil, PagStream) ou construir a régua de cobrança.
- **Restrição de plataforma:** vender assinatura de conteúdo digital fora do IAP dentro do app iOS ainda é território minado (ver `flutter.md`). Pix Automático se aplica bem a venda via web/checkout externo, apps de serviço físico e casos fora da regra de bens digitais.
- Sensibilidade a preço é alta. Ancoragem em real, preços psicológicos e o anual parcelado importam mais aqui do que no mercado americano. Dados públicos de conversão free-to-paid específicos do Brasil são escassos — a maioria dos benchmarks é global/EUA, então trate-os como referência e valide com os próprios dados.

## ASO e ratings

- 79% dos usuários checam a nota antes de baixar. Subir de 3 para 4 estrelas pode elevar conversão da página em até 89%; apps com 4,5+ convertem cerca de 2x mais que apps abaixo de 4,0.
- Use `SKStoreReviewController` (iOS) e a Play In-App Review API. Limite do iOS: **3 prompts por usuário por ano**.
- **Timing:** peça avaliação logo depois de um momento de sucesso (marco atingido, tarefa concluída, streak batido). Nunca depois de erro, crash, cobrança ou durante o onboarding.
- Responder reviews no Google Play eleva a nota média em cerca de 0,7 estrela.
- **Proibido:** *review gating* — filtrar quem vê o prompt perguntando antes "você está gostando?" e só mandando os felizes para a loja. Viola as regras da Apple. Você pode escolher **quando** pedir, nunca **para quem**.
