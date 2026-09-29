# Mecânicas de engajamento — detalhamento

Índice:
- [Os 7 princípios em profundidade](#os-7-princípios-em-profundidade)
- [Fundamentos comportamentais](#fundamentos-comportamentais)
- [Frameworks de design](#frameworks-de-design)
- [Casos concretos](#casos-concretos)

---

## Os 7 princípios em profundidade

### 1. Nunca mostre um zero

Um usuário que termina o cadastro e vê `0 pontos · 0 dias · nenhuma conquista` acabou de receber a mensagem "você está no começo de tudo e não tem nada". Isso é o oposto do que a psicologia recomenda.

**Base:** Nunes & Drèze (2006, *Journal of Consumer Research*). Cartões de fidelidade de lava-jato: cartão de 10 selos com 2 já carimbados teve **34%** de conclusão; cartão de 8 selos vazio teve **19%** — o esforço restante era idêntico (8 lavagens). Chama-se *endowed progress effect*: dar progresso inicial faz a pessoa se sentir já dentro da jornada, não na linha de partida.

**Implementação:**
- Recompensa no signup (pontos, moeda interna, badge "Começando").
- Barra de progresso que já nasce em 10-20%, nunca em 0%.
- Página de conquistas com a primeira conquista já desbloqueada antes de o usuário chegar na home.
- Reformule a meta para incluir o que já foi feito: em vez de "0 de 5 lições", "1 de 6 passos — o cadastro já conta".

**Cuidado:** o progresso dado precisa ser justificado por algo que o usuário fez (terminou o onboarding, definiu uma meta). Progresso arbitrário e óbvio ("ganhou 500 pontos por respirar") vira ruído e desvaloriza a moeda.

### 2. Faça vencer parecer possível

Leaderboard global é desmotivador para 99% dos usuários. Quem está na posição #82.491 não tem nenhum caminho crível até o topo, então não joga.

**Implementação:**
- Ligas semanais de **20-30 pessoas** agrupadas por nível de atividade similar (é assim que a Duolingo faz).
- Promoção/rebaixamento entre divisões: a estrutura de torneio mantém o senso de progressão mesmo para quem não é o melhor.
- Alternativa sem competição social: competir contra a **própria versão passada** ("você está 12% acima da sua média de 4 semanas").

**Cuidado:** ligas geram ansiedade competitiva em parte dos usuários. Deixe sair (opt-out) sem punição.

### 3. Torne o progresso compartilhado

Streak individual você quebra e ninguém vê. Streak compartilhado tem uma segunda pessoa do outro lado — a pressão social é o que dá peso. Snapchat e Duolingo introduziram sequências compartilhadas justamente por isso.

**Implementação:**
- Um streak conjunto entre dois amigos em vez de dois streaks separados.
- Metas de grupo/família com contribuição visível de cada um.
- Notificação de "seu parceiro já fez a parte dele hoje" — funciona muito melhor que "não perca sua sequência".

**Cuidado ético:** isso é loss aversion com pressão social somada, a mecânica mais potente do arsenal e a mais fácil de virar coerção. Nunca torne o custo do abandono humilhante publicamente. Dê um jeito de pausar a dois ("modo férias").

### 4. Sempre deixe uma coisa por terminar

O Apple Watch não mostra dez métricas. Mostra três anéis, e a tensão de um anel incompleto puxa a pessoa de volta. Tarefas incompletas ocupam a memória de trabalho (efeito Zeigarnik) e o esforço acelera quanto mais perto do fim (goal-gradient, Hull 1932; Kivetz, Urminsky & Zheng 2006).

**Implementação:**
- Escolha **uma** métrica diária central. Uma. Se você tem cinco, o usuário não tem nenhuma.
- Mostre a distância exata até completar, não uma porcentagem vaga: "faltam 2 lições" bate "40% concluído".
- Widget de home screen com o estado incompleto visível sem abrir o app.

**Cuidado:** "sempre incompleto" não pode virar "nunca alcançável". A meta precisa fechar todo dia; se o usuário completa, celebre e pare — não empurre imediatamente uma meta maior. Isso é a diferença entre satisfação e esteira.

### 5. Recompense o retorno

Todo usuário vai perder um dia. O que o app faz nesse momento decide se ele volta ou desinstala. O padrão psicológico aqui é o *abstinence violation effect*: quebrou a regra uma vez, o esforço todo parece perdido, então abandona de vez. Um contador que zera de 200 para 0 é um convite a desinstalar.

**Implementação:**
- **Streak freeze** distribuído por vários caminhos (drop aleatório, missão diária, assinatura).
- **Aplicação automática** do freeze quando o usuário perde o dia. Esse detalhe é o que mais importa: o usuário em risco é, por definição, aquele que não abriu o app — ele não vai usar um item que exige que ele abra o app.
- **Restauração ativa:** "complete uma tarefa hoje e recupere sua sequência de 47 dias".
- **Grace days / streak semanal**: em vez de contador rígido diário, contar "5 dos últimos 7 dias" ou mostrar heat map de aderência. Reduz ansiedade sem perder o efeito de compromisso.
- Copy de volta que não culpa: "que bom te ver de novo" > "você perdeu sua sequência".

### 6. Dê algo que valha a pena guardar

Ninguém posta print de uma feature. As pessoas postam **prova** — de identidade, de esforço, de gosto. Spotify Wrapped, recordes do Strava, recaps anuais funcionam porque o usuário sente que aquilo é *dele*, não propaganda do app.

**Números direcionais:** Wrapped 2025 teve mais de 500 milhões de compartilhamentos no primeiro dia (+41% ano a ano); em 2024 gerou pico de engajamento no app na semana de lançamento. Strava "Year in Sport" cobre 180M+ atletas.

**Implementação:**
- Card gerado automaticamente a cada marco (não só uma vez por ano — marcos pequenos e frequentes rendem mais).
- Formato vertical de story (1080×1920), tipografia grande, contraste alto, marca discreta no canto.
- Compartilhamento em **um toque**, com o share sheet nativo.
- O conteúdo tem que ser sobre o usuário, com número concreto e comparação ("seu melhor mês do ano"), não sobre o app.

Isso fecha um growth loop: prova compartilhada → aquisição orgânica → curiosidade → novos usuários. E funciona como gatilho de reentrada para quem já estava sumindo.

### 7. Recompense a melhoria, não a presença

XP genérico é uma moeda que o usuário não sabe explicar. "Corri 400m a mais que semana passada" é uma frase que ele repete no almoço. Strava e Peloton recompensam melhoria; é por isso que a coisa gruda em adulto e não parece infantil.

**Base científica:** meta-análise de Deci, Koestner & Ryan (1999, 128 experimentos) mostra que recompensa extrínseca por mera participação **reduz** motivação intrínseca (*overjustification effect*). Cameron et al. (2001) mostram a exceção decisiva: recompensa explicitamente ligada a **performance/melhoria** preserva ou aumenta a competência percebida. Ou seja: o que quebra não é recompensar, é recompensar presença.

**Implementação:**
- Métricas de delta pessoal: recorde, média móvel, comparação com o próprio passado.
- Nomes com significado no domínio ("minutos de foco", "km", "palavras aprendidas") em vez de "pontos".
- Feedback que explica o ganho: "sua retenção de vocabulário subiu de 68% para 74%".

**Regra prática:** se o usuário não consegue explicar sua pontuação em uma frase para outra pessoa, a métrica está errada.

---

## Fundamentos comportamentais

**Fogg Behavior Model (B = MAP):** o comportamento acontece quando Motivação, Habilidade e Prompt coincidem no mesmo instante. É multiplicativo — se um fator é ~zero, não acontece. Consequência prática que quase todo dev ignora: **é muito mais barato reduzir fricção do que aumentar motivação**. Antes de desenhar uma campanha para motivar, tire dois toques do caminho.

Três tipos de prompt: *facilitator* (motivação alta, habilidade baixa → "deixa eu facilitar"), *spark* (habilidade alta, motivação baixa → "olha o que você ganha"), *signal* (ambos altos → só lembre).

**Hook Model (Nir Eyal):** Trigger → Action → Variable Reward → Investment. O ponto menos explorado é o **investment**: fazer o usuário depositar algo (dados, conteúdo, conexões, configuração) que torna o app mais valioso na próxima sessão e carrega o próximo gatilho. Três tipos de recompensa variável: tribo (social), caça (recurso/informação), self (domínio/conclusão).

**Self-Determination Theory (Deci & Ryan):** autonomia, competência e relacionamento. Gamificação que suporta as três funciona; gamificação que só empilha pontos ataca a autonomia e vira controle externo. Uma revisão sistemática (Springer, 2023) encontra efeito positivo em autonomia e relacionamento, mas efeito mínimo em competência — o que sugere que a maioria das implementações erra exatamente no ponto do princípio 7.

**Outros efeitos aplicáveis:**
- **Loss aversion** (Kahneman & Tversky): perder dói ~2x mais do que ganhar o equivalente. Motor dos streaks.
- **IKEA effect / sunk cost:** esforço investido aumenta valorização. É por isso que onboarding longo com quiz converte melhor que onboarding curto.
- **Peak-end rule:** a experiência é lembrada pelo pico e pelo fim. Desenhe um pico emocional (celebração do marco) e um bom encerramento de sessão — não termine a sessão num paywall frio.
- **Variable ratio reinforcement** (Skinner): reforço imprevisível é o mais potente e o mais próximo de mecânica de cassino. Use com parcimônia consciente.

## Frameworks de design

**Octalysis (Yu-kai Chou)** — 8 core drives, útil como checklist de cobertura:
1. Significado épico e chamado · 2. Desenvolvimento e realização · 3. Empoderamento criativo e feedback · 4. Posse e propriedade · 5. Influência social e relacionamento · 6. Escassez e impaciência · 7. Imprevisibilidade e curiosidade · 8. Perda e evitação.

Topo do octógono = **White Hat** (empoderador, sustentável, mas baixa urgência). Base = **Black Hat** (urgência, ansiedade, compulsão — eficaz e corrosivo). Lado direito = intrínseco; esquerdo = extrínseco.

Regra de design: **White Hat para lealdade de longo prazo; Black Hat em doses pontuais e conscientes.** Um app inteiro construído em drives 6 e 8 tem métrica boa no trimestre e reputação ruim no ano.

Ao avaliar um app existente, mapeie quais drives ele usa. Quase sempre o diagnóstico é: muito 2 e 8, quase nada de 1, 3 e 4.

## Casos concretos

**Duolingo.** Jorge Mazal (ex-CPO) relata, em "How Duolingo reignited user growth", aumento de 21% no CURR (Current User Retention Rate), redução de mais de 40% no churn diário dos melhores usuários e crescimento de 4,5x em DAU. FY2024: 40,5M DAU e US$748M de receita (+41% a/a). Detalhes de design que valem copiar:
- Trocaram o ícone de chama por um **odômetro numérico** — tornou o streak tangível.
- Uma mudança de copy de 8 palavras explicando a regra do streak rendeu mais de 10.000 DAU.
- Rodam 500+ experimentos simultâneos; só o time Android fez 200+ testes A/B em 2024.
- Ligas de ~30 pessoas; freeze automático para assinantes Super.
- Fontes citam entre 5M e 9M de usuários com streak de mais de um ano, dependendo da data e da fonte — trate a ordem de grandeza, não o número.

**Apple Fitness rings:** três métricas, uma incompleta, celebração visual ao fechar. O caso canônico do princípio 4.

**Cal AI:** onboarding com 25+ telas de quiz intercaladas com estatísticas, terminando em plano personalizado → paywall com trial de 3 dias → anual. 15M+ downloads e US$30M+ de ARR em menos de 2 anos; adquirido pela MyFitnessPal. Só a primeira superfície de monetização passou por 61 experimentos. A fala do fundador que resume a lição: se você está há semanas debatendo como deve ser seu paywall, já perdeu — teste.

**O lado negativo (importante conhecer).** Pesquisas de UX identificam vidas/corações, streaks, ligas e notificações como fontes reais de ansiedade e frustração. "Streak creep": a atividade deixa de ser aprender e vira manter o número, corroendo a motivação original. Busque "Duolingo burnout" no Reddit e você acha páginas de usuários frustrados. A própria Duolingo satirizou a pressão que criou. Isso não invalida as mecânicas — invalida as versões punitivas delas. As correções estão nos princípios 5 e 7 e em `antipadroes.md`.
