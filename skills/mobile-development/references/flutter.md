# Implementação em Flutter e plataforma

Índice:
- [Stack recomendada](#stack-recomendada)
- [Assinatura com RevenueCat](#assinatura-com-revenuecat)
- [Push notifications](#push-notifications)
- [Widgets e Live Activities](#widgets-e-live-activities)
- [Modelagem do streak](#modelagem-do-streak)
- [Regras das lojas](#regras-das-lojas)

---

## Stack recomendada

Para dev solo, todos com SDK oficial no pub.dev:

| Função | Pacote / serviço | Nota |
|---|---|---|
| Assinatura | `purchases_flutter` (RevenueCat) | Grátis até US$2.500 MTR; depois 1% do MTR bruto |
| Paywall remoto + A/B | `superwallkit_flutter` ou `adapty_flutter` | Muda paywall sem release |
| Analytics | `firebase_analytics` (grátis) ou `amplitude_flutter` / `mixpanel_flutter` | Amplitude tem melhor análise de coorte |
| Push | `onesignal_flutter` | Tier gratuito generoso |
| Widget home screen | `home_widget` | Interface Dart, UI nativa |
| Live Activities | `live_activities` | iOS 16.1+ |

Superwall + RevenueCat juntos é a combinação mais comum: Superwall cuida da UI e do teste do paywall, RevenueCat processa a compra e é a fonte única de verdade da assinatura.

MTR = Monthly Tracked Revenue, receita bruta antes da taxa das lojas. O 1% empilha sobre os 15-30% da Apple/Google — considere no modelo de margem.

## Assinatura com RevenueCat

O valor real não é o wrapper sobre StoreKit e Play Billing — é o backend. A RevenueCat recebe App Store Server Notifications e Google Play RTDN (via Cloud Pub/Sub), valida recibos server-side e dispara **webhooks** em cada evento de assinatura. Isso elimina polling e resolve o problema mais chato de app com assinatura: saber o estado real de quem cancelou, teve falha de cobrança ou pediu reembolso.

**Entitlements** desacoplam produto de permissão: o código pergunta "o usuário tem acesso a `premium`?" em vez de checar SKUs específicos. Isso permite mudar preços e planos sem tocar na lógica de acesso.

Configure desde o dia 1 (as duas coisas que devs esquecem e custam receita):
- **Grace period** — mantém o acesso enquanto a cobrança é retentada.
- **Billing retry / dunning** no Google Play — recupera 15-20% da receita perdida.

## Push notifications

Erro número 1: disparar o prompt de permissão do sistema no primeiro launch. O prompt do iOS só aparece **uma vez** — negado, o usuário precisa ir nas Configurações, e ninguém vai.

**Os opt-ins estão caindo** (Batch, benchmark 2025, 800 bi de mensagens): Android caiu de 85% para 67% em um ano; iOS de 58% para 56%; média geral 61%. Ou seja, a permissão está mais cara — não desperdice.

**O que fazer:**
- **Pre-permission priming:** uma tela in-app própria explicando o benefício concreto antes de chamar o prompt do sistema. Melhora opt-in em 2-3x. Se o usuário recusar a sua tela, você não gasta o prompt do sistema e pode pedir de novo depois.
- Peça **depois** de um momento de valor (primeira meta concluída), nunca no launch.
- Enquadre como serviço, não como permissão: "quer que eu te lembre no horário que você escolher?" em vez de "permitir notificações?".
- **Provisional Authorization** (iOS 12+) entrega notificações silenciosas direto na central sem prompt — bom para começar e ganhar permissão total depois.
- Ofereça **preferências por categoria**. Usuário irritado com uma categoria desliga aquela categoria em vez do app inteiro.

**Conteúdo:** notificações de promoção/código têm CTR melhor (16-18%). Notificações de culpa ("você abandonou seu streak") funcionam uma vez e depois viram motivo de desinstalação. Prefira "seu parceiro já fez a parte dele" ou "faltam 2 minutos para fechar o dia".

## Widgets e Live Activities

Widget de home screen é a superfície de reengajamento mais subestimada: ela mostra o estado incompleto (princípio 4) sem exigir que o app seja aberto.

**Melhor dado primário disponível:** o app Gratitude reportou **+25% de retenção** entre usuários que instalaram o widget, e cerca de 1.000 entradas semanais originadas pelo widget (Android Developers Blog, 2026). A tática deles: pedir o *pin* do widget dentro do app, no momento contextual certo (`requestPinGlanceAppWidget`), em vez de esperar o usuário descobrir sozinho.

**Realidade técnica do Flutter:** o pacote `home_widget` dá uma interface Dart unificada para passar dados, mas **a UI do widget é nativa** — SwiftUI/WidgetKit no iOS, XML ou Jetpack Glance no Android, com App Group compartilhado para os dados. Flutter não renderiza widget de home screen. Planeje escrever SwiftUI e Kotlin. App Intents permitem botões interativos no widget que executam Dart em background.

**Live Activities / Dynamic Island** (`live_activities`, iOS 16.1+): exige Widget Extension em SwiftUI e updates limitados a 4KB. Faz sentido para algo com progresso contínuo durante o dia (treino, sessão de foco, meta diária), não para tudo.

## Modelagem do streak

As pegadinhas que quebram implementação ingênua:

- **Fuso horário:** guarde a data local do usuário, não UTC. Um usuário que viaja de São Paulo para Lisboa não pode perder o streak por causa disso. Guarde também o timezone usado no último registro.
- **Definição do dia:** muitos apps usam "dia" começando às 4h da manhã local, não à meia-noite, para não punir quem usa o app tarde da noite.
- **Cálculo preguiçoso:** não rode um job noturno para zerar streaks. Calcule o estado do streak na leitura, a partir da data do último registro. Isso resolve offline, fuso e usuário inativo de uma vez.
- **Freeze automático:** ao detectar que a lacuna é de exatamente 1 dia e há freeze disponível, consuma o freeze automaticamente e informe o usuário na próxima abertura ("usamos um congelamento para proteger sua sequência de 47 dias"). Isso é o que salva o usuário em risco — ele não está lá para decidir.
- **Restauração:** guarde o valor do streak perdido por alguns dias para permitir "complete uma tarefa hoje e recupere seus 47 dias".
- **Estado a persistir:** `current_streak`, `longest_streak`, `last_activity_date`, `last_activity_timezone`, `freezes_available`, `freezes_used_dates`, `recoverable_streak`, `recoverable_until`.
- **Offline first:** registre localmente e sincronize. Nunca deixe o usuário perder sequência por falha de rede.

## Regras das lojas

⚠️ **Este cenário está em fluxo em meados de 2026. Confirme antes de implementar qualquer estratégia de billing externo.**

**Apple, EUA (Epic v. Apple):** em 30/abr/2025 a decisão proibiu a Apple de cobrar comissão sobre compras externas e de restringir estilo/posição de links externos; em 01/mai/2025 a Guideline 3.1.1(a) foi atualizada permitindo links externos em apps dos EUA sem entitlement. Em 11/dez/2025 o 9º Circuito manteve boa parte, mas considerou a proibição total de comissão "overbroad" e devolveu ao tribunal para definir uma comissão razoável. **A taxa final americana não estava definida.**

**Apple, União Europeia (DMA):** desde 26/jun/2025, um entitlement único de comunicação e promoção de ofertas, com estrutura de ~2% de acquisition fee + 5-13% de store services fee + 5% de Core Technology Commission. A substituição da CTF (€0,50 por install) pela CTC estava prevista para 01/jan/2026 mas não foi confirmada.

**Google Play:** user choice billing dá 4% de desconto na taxa. A reestruturação de jun/2026 separou service fee (começando em 10% no primeiro US$1M anual, incluindo assinaturas) de billing fee; links externos evitam a billing fee. Vigência a partir de 30/jun/2026, começando por EUA, EEE e Reino Unido.

**Guideline 3.1.2 — causas mais comuns de rejeição de app com assinatura:**
1. Faltar disclosures completos: título, duração, preço, e **links funcionais** para Terms of Use/EULA e Privacy Policy **dentro do app** e nos metadados do App Store Connect.
2. Assinatura sem "dynamic, ongoing value" — cobrar recorrente por algo que é compra única é rejeitado.
3. Período mínimo de assinatura: 7 dias.

Antes de submeter, cheque: preço e periodicidade visíveis na mesma tela do botão de compra; link de restaurar compras; links legais funcionando; lembrete de fim de trial configurado.
