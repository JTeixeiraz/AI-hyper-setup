# Antipadrões, dark patterns e risco real

Rode esta checagem antes de entregar qualquer desenho de engajamento ou monetização. Não é moralismo: dark pattern hoje gera rejeição na App Store, processo regulatório e destruição de reputação — e as mesmas mecânicas têm versões que funcionam melhor a longo prazo.

## O risco deixou de ser teórico

- **FTC / ROSCA (EUA):** em 25/set/2025 a Amazon fechou acordo de **US$2,5 bilhões** (US$1 bi de multa civil + US$1,5 bi de restituição) — a maior penalidade civil já imposta por violação de regra da FTC — depois que a corte decidiu, em 17/set/2025, que a empresa violou o ROSCA com inscrição enganosa e cancelamento dificultado no Prime. A regra específica de "click-to-cancel" foi anulada em 2025 por questões processuais, mas os princípios continuam aplicáveis via ROSCA e Section 5.
- **Brasil (CDC):** cancelar precisa ser tão fácil quanto contratar. Dark pattern configura prática abusiva sob o Código de Defesa do Consumidor.
- **União Europeia:** DMA e legislação de consumidor tratam padrões manipulativos de assinatura como infração.
- **App Store:** Guideline 3.1.2 rejeita apps por falta de clareza sobre preço, duração e cancelamento.

## Antipadrões de monetização

| Antipadrão | Por que dá errado | O que fazer no lugar |
|---|---|---|
| Trial escondido no onboarding com cobrança anual automática | Reembolso até 4x maior, review negativo, risco regulatório | Preço e periodicidade na mesma tela do botão; lembrete antes do fim |
| Cancelamento em 6 telas com "tem certeza?" repetido | Ilegal em várias jurisdições; gera denúncia | Uma tela com opção de pausa e downgrade ao lado do cancelar |
| Botão de fechar o paywall invisível ou com delay longo | Rejeição na review; ódio do usuário | Fechar visível; se quiser hard paywall, seja hard e honesto |
| Preço em letra minúscula ao lado de "GRÁTIS" gigante | Enganoso por desenho | Hierarquia visual proporcional à importância da informação |
| Contagem regressiva falsa que reinicia | Escassez fabricada, quebra de confiança | Escassez real (vaga de turma, lote) ou nenhuma |
| Review gating (filtrar quem vê o prompt) | Viola regra da Apple | Escolha o **momento**, nunca **quem** |

## Antipadrões de engajamento

**Streak punitivo sem escape.** Contador que zera de 200 para 0 dispara o *abstinence violation effect*: o usuário sente que perdeu tudo e abandona de vez. Ganho de curto prazo, churn de longo prazo. **Correção:** freeze automático, grace days, streak semanal ("5 dos últimos 7 dias"), heat map de aderência, restauração ativa.

**Notificação de culpa.** "Você decepcionou o Duo." Funciona uma vez, vira meme e depois vira desinstalação. **Correção:** notificação que oferece valor ou usa pressão social positiva ("seu parceiro já fez a parte dele").

**Streak creep.** Quando manter o número vira o objetivo e a atividade original perde sentido — o usuário faz a lição mais curta possível só para não zerar. Isso corrói a motivação intrínseca (overjustification). **Correção:** recompensar qualidade e melhoria, não apenas presença (princípio 7); metas que exigem esforço real mas não crescem indefinidamente.

**Variable ratio sem limite.** Recompensa aleatória é a mecânica mais próxima de cassino. Em app para adolescente ou em domínio sensível (finanças, saúde), é irresponsável. **Correção:** variabilidade dentro de um teto previsível.

**Métricas demais.** Dez indicadores significa nenhum. Além de ineficaz, gera ansiedade. **Correção:** uma métrica diária central.

**Gamificar antes de ter produto.** Se a curva de retenção não achata, nenhuma liga ou badge resolve. Gamificação amplifica valor existente; não cria valor.

## Acessibilidade e saúde

- Permita **modo férias / pausa** sem perder progresso. Doença, luto, viagem existem.
- Não use cor como único sinal de estado (progresso, streak ativo/quebrado).
- Streak e contagem precisam funcionar com leitor de tela e com fonte aumentada.
- Se o app é de saúde, fitness ou alimentação, evite mecânicas que empurrem comportamento compulsivo — pressão diária em app de contagem de calorias tem risco real de reforçar transtorno alimentar. Nesses domínios, prefira metas semanais e evite streaks punitivos por completo.
- Público adolescente muda o cálculo inteiro: pressão social e recompensa variável têm impacto desproporcional.

## O teste final

Antes de entregar, faça três perguntas:

1. **Teste do jornalista:** se essa mecânica fosse descrita numa reportagem, soaria como bom design ou como manipulação?
2. **Teste do usuário informado:** se o usuário entendesse exatamente como isso funciona, ele continuaria usando de bom grado?
3. **Teste da saída:** o usuário consegue sair — cancelar, pausar, desligar notificação, quebrar o streak — sem punição desproporcional e sem caçar o botão?

Se alguma resposta for não, redesenhe. Quase sempre existe uma versão da mesma mecânica que passa nos três testes e retém melhor, porque retenção construída em confiança não tem teto de reputação.
