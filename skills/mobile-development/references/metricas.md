# Métricas, instrumentação e diagnóstico

Índice:
- [Aha moment e North Star](#aha-moment-e-north-star)
- [Benchmarks de retenção](#benchmarks-de-retenção)
- [Como ler uma curva de retenção](#como-ler-uma-curva-de-retenção)
- [Taxonomia de eventos](#taxonomia-de-eventos)
- [Eventos mínimos](#eventos-mínimos-para-um-app-com-assinatura)

---

## Aha moment e North Star

**Aha moment** é a ação que, quando realizada, prevê que o usuário fica. Não é opinião — é uma correlação que se mede.

Exemplos canônicos: Facebook = **7 amigos em 10 dias**; Slack = **~2.000 mensagens trocadas pelo time**; Dropbox = **um arquivo sincronizado entre dois dispositivos**.

**Como encontrar o seu:**
1. Separe usuários retidos em D30 dos não retidos.
2. Para cada ação candidata, compare a taxa de execução nos dois grupos nos primeiros dias.
3. Procure o ponto de inflexão: a ação (e a quantidade) onde a retenção salta.
4. Confirme qualitativamente — entreviste 5-10 usuários retidos e pergunte quando o app "fez sentido".

Correlação não é causa: fazer todo mundo forçadamente executar a ação não garante retenção. Mas serve como bússola de onboarding: **todo o onboarding deve existir para levar o usuário até o aha moment o mais rápido possível.**

Preditor mais forte de D30 documentado: executar a **primeira ação significativa ainda no D1**.

**North Star Metric**: uma métrica que captura valor entregue ao usuário, não vaidade. Facebook = DAU; Spotify = tempo ouvindo; Airbnb = noites reservadas. Downloads não é North Star. Receita também não — receita é resultado, não valor entregue.

**DAU/MAU ratio** mede intensidade de hábito. 20% significa que o usuário médio usa 6 dias por mês; 50%+ é território de app diário.

## Benchmarks de retenção

Média cross-industry (Adjust, 2026): **D1 25-26% · D7 11-13% · D30 5-7%**. Quartil superior: D1 >30%, D7 >15%, D30 >8%.

Por categoria (aproximado, para comparação — use sempre a mediana da SUA categoria):

| Categoria | D1 | D7 | D30 |
|---|---|---|---|
| Fintech | ~30% | ~17,6% | 2-11,6%* |
| Games hyper-casual | ~33% | ~12% | ~4% |
| Social | 25-29% | 9-10% | ~5% |
| Saúde e fitness | 20-27% | ~7% | ~3% |
| Educação | — | — | frequentemente <3% |

\* Fintech caiu ~33% ano a ano em D30 por saturação de mercado — os benchmarks envelhecem, verifique o ano do dado.

iOS costuma reter 2-3 pontos acima de Android.

**A regra que mais importa:** a variação de D30 entre categorias é de cerca de 5x — maior do que qualquer otimização que você consiga fazer dentro da sua própria categoria. Comparar um app de educação com a média global é se sabotar; comparar com a mediana de educação é diagnóstico útil.

## Como ler uma curva de retenção

O formato da curva diz mais que qualquer ponto isolado:

- **Curva que achata** acima de ~7% depois de algumas semanas → existe um núcleo com valor durável. Sinal direcional de product-market fit. Agora vale investir em aquisição e gamificação.
- **Curva que continua caindo até quase zero** → não há núcleo. Nenhuma mecânica de engajamento salva isso; o problema é o produto ou o público.
- **D1 baixo, D7/D30 proporcionalmente bons** → o produto é bom, o onboarding é ruim. Foque no Dia 0.
- **D1 alto, queda brutal em D7** → primeira sessão promete o que o produto não sustenta.

Sempre analise por **coorte** (grupo que instalou na mesma semana). Média agregada esconde tudo: uma melhoria em onboarding só aparece nas coortes novas.

## Taxonomia de eventos

Definir isso uma vez, no começo, economiza meses. Bagunça de nomenclatura fragmenta métricas e o dado vira inútil retroativamente.

**Padrão de indústria: Object-Action**, no passado.
- Bom: `Song Played`, `Checkout Completed`, `Streak Extended`, `Paywall Viewed`
- Ruim: `button_clicked`, `user_action`, `click_2`, `tela_x`

**Quatro decisões a fixar de uma vez:**
1. Framework object-action.
2. Tempo verbal consistente (passado).
3. **Casing consistente** — Amplitude trata `Song Played` e `song played` como eventos diferentes. Casing inconsistente fragmenta métricas silenciosamente.
4. Propriedades globais de contexto anexadas a todo evento.

**Três camadas:**
- **Events** — o que aconteceu (`Purchase Completed`).
- **Event properties** — contexto do evento (`plan_id`, `price`, `paywall_variant`).
- **User properties** — atributos do usuário (`subscription_status`, `signup_date`, `current_streak`).

Mantenha um catálogo central dos eventos em um arquivo versionado no repositório. Cada evento novo entra no catálogo antes de entrar no código.

**Erro comum:** rastrear tudo. Vinte eventos bem escolhidos e consistentes valem mais que duzentos eventos que ninguém consegue interpretar.

## Eventos mínimos para um app com assinatura

```
# Ativação
App Installed
Onboarding Started
Onboarding Step Completed   { step_index, step_name }
Onboarding Completed        { duration_seconds }
Goal Set                    { goal_type }
Signup Completed            { method }
Aha Moment Reached          { time_since_install_seconds }

# Hábito
Session Started
Daily Goal Completed        { metric, value }
Streak Extended             { streak_length }
Streak Broken               { streak_length, days_missed }
Streak Freeze Applied       { automatic: bool }
Streak Restored             { streak_length }
Personal Record Set         { metric, previous_value, new_value }
Milestone Reached           { milestone_type }
Share Card Generated        { milestone_type }
Share Card Shared           { destination }

# Notificação
Push Permission Primed
Push Permission Requested
Push Permission Granted     { granted: bool }
Notification Opened         { campaign_id }

# Monetização
Paywall Viewed              { placement, variant, trigger }
Paywall Dismissed           { seconds_visible }
Plan Selected               { plan_id, billing_period }
Trial Started               { plan_id, trial_days }
Purchase Completed          { plan_id, price, currency }
Subscription Renewed
Subscription Cancelled      { reason, days_subscribed }
Billing Issue Detected
Subscription Recovered
```

Com isso já dá para calcular: funil de onboarding tela a tela, tempo até o aha moment, conversão por variante de paywall, taxa de proteção de streak, impacto de streak em conversão e churn involuntário vs voluntário.
