# Flutter Liquid Glass Design System

## Objective

Always reproduce Apple Liquid Glass aesthetics using
liquid_glass_renderer.

Never use generic glassmorphism.

---

## Preferred Package

liquid_glass_renderer

---

## Rules

### Shapes

Always use:

LiquidRoundedSuperellipse

Never use:

BorderRadius.circular

---

### Sidebar

Use:

LiquidGlass

Settings:

thickness: 20
blur: 12
saturation: 1.2

---

### Cards

Use:

FakeGlass

Settings:

blur: 8

---

### Floating Buttons

Use:

LiquidGlass

Settings:

thickness: 10
blur: 8

---

### Colors

Prefer:

glassColor: Color(0x20FFFFFF)

Avoid:

Strong white overlays

---

### Performance

Use FakeGlass for lists.

Never place more than 10 LiquidGlass widgets on screen.

Prefer one LiquidGlassLayer per page.

---

### Layout Style

Inspired by:

- Apple VisionOS
- iOS Liquid Glass
- Modern fintech dashboards

Characteristics:

- Soft shadows
- Large radii
- Floating panels
- Layered depth
- Subtle highlights

---

### Example

# Liquid Glass no Flutter (Estilo Apple / VisionOS / iOS 26)

## Objetivo

Criar interfaces parecidas com estas características:

- Refração do fundo
- Blur suave
- Efeito de lente
- Bordas iluminadas
- Transparência dinâmica
- Superfícies estilo Apple
- Componentes que se fundem visualmente
- Profundidade e brilho interno

Importante:

> Glassmorphism comum NÃO é suficiente.
>
> O efeito das referências é Liquid Glass.

---

# 1. Instalar a biblioteca

Atualmente a biblioteca mais avançada para isso no Flutter é:

`liquid_glass_renderer`

Ela oferece:

- Refração real
- Distorção do fundo
- Blur
- Glow
- Blending
- Shapes estilo Apple
- Squash & Stretch

Documentação:
https://pub.dev/packages/liquid_glass_renderer

Adicionar ao projeto:

```yaml
dependencies:
  liquid_glass_renderer: ^0.2.0-dev.4
```

ou

```bash
flutter pub add liquid_glass_renderer
```

Fonte:
https://pub.dev/packages/liquid_glass_renderer
```

---

# 2. Importar o pacote

```dart
import 'package:liquid_glass_renderer/liquid_glass_renderer.dart';
```

---

# 3. Entender como o Liquid Glass funciona

O efeito é criado capturando os pixels atrás do widget e aplicando:

- Refração
- Blur
- Iluminação

Por isso o widget SEMPRE precisa estar sobre outro conteúdo.

Estrutura básica:

```dart
Stack(
  children: [

    Background(),

    LiquidGlassLayer(
      child: MeuPainel(),
    ),

  ],
)
```

---

# 4. Criando um painel Liquid Glass

Exemplo mínimo:

```dart
LiquidGlassLayer(
  settings: const LiquidGlassSettings(
    thickness: 20,
    blur: 10,
    glassColor: Color(0x33FFFFFF),
  ),
  child: LiquidGlass(
    shape: LiquidRoundedSuperellipse(
      borderRadius: 30,
    ),
    child: const SizedBox(
      width: 300,
      height: 200,
    ),
  ),
)
```

---

# 5. O segredo das bordas Apple

ERRADO:

```dart
BorderRadius.circular(30)
```

CERTO:

```dart
LiquidRoundedSuperellipse(
  borderRadius: 30,
)
```

Apple usa superfícies semelhantes a squircle/superellipse.

Isso gera aquele visual mais suave das interfaces do VisionOS.

---

# 6. Configurações recomendadas

Para ficar parecido com as referências:

```dart
LiquidGlassSettings(
  thickness: 15,
  blur: 10,
  saturation: 1.2,
  lightIntensity: 1.5,
  outlineIntensity: 0.5,
)
```

---

# 7. O que cada propriedade faz

## thickness

Controla a refração.

```dart
thickness: 20
```

Mais valor:

- Mais distorção
- Mais efeito lente

Menos valor:

- Mais sutil

---

## blur

Controla o desfoque.

```dart
blur: 10
```

Faixa recomendada:

```dart
8 ~ 16
```

Evite:

```dart
40
50
60
```

Isso gera apenas glassmorphism genérico.

---

## saturation

```dart
saturation: 1.2
```

Aumenta a intensidade das cores vistas através do vidro.

Visual mais próximo do Apple Liquid Glass.

---

## lightIntensity

```dart
lightIntensity: 1.5
```

Controla os highlights.

---

## outlineIntensity

```dart
outlineIntensity: 0.5
```

Controla a intensidade das bordas.

---

# 8. Criando o Glow

Para reproduzir o brilho suave das bordas:

```dart
GlassGlow(
  glowColor: Colors.white24,
  child: MeuWidget(),
)
```

Exemplo:

```dart
LiquidGlass(
  shape: LiquidRoundedSuperellipse(
    borderRadius: 30,
  ),
  child: GlassGlow(
    glowColor: Colors.white24,
    child: MeuConteudo(),
  ),
)
```

---

# 9. Criando Sidebars como as referências

Estrutura recomendada:

```dart
LiquidGlassLayer(
  settings: const LiquidGlassSettings(
    thickness: 20,
    blur: 12,
    saturation: 1.2,
  ),
  child: LiquidGlass(
    shape: LiquidRoundedSuperellipse(
      borderRadius: 40,
    ),
    child: Sidebar(),
  ),
)
```

---

# 10. Fazendo múltiplos componentes se fundirem

A biblioteca possui:

```dart
LiquidGlassBlendGroup
```

Exemplo:

```dart
LiquidGlassBlendGroup(
  blend: 20,
  child: Column(
    children: [

      LiquidGlass.grouped(
        shape: LiquidRoundedSuperellipse(
          borderRadius: 40,
        ),
      ),

      LiquidGlass.grouped(
        shape: LiquidRoundedSuperellipse(
          borderRadius: 40,
        ),
      ),
    ],
  ),
)
```

Isso gera o efeito de componentes líquidos conectados.

---

# 11. Quando usar FakeGlass

Nem tudo precisa usar refração real.

A biblioteca oferece:

```dart
FakeGlass
```

Mais leve:

```dart
FakeGlass(
  shape: LiquidRoundedSuperellipse(
    borderRadius: 20,
  ),
  settings: const LiquidGlassSettings(
    blur: 10,
  ),
)
```

Ideal para:

- Cards
- Itens de listas
- Componentes repetidos

---

# 12. Estrutura ideal para Dashboards

## Sidebar

Use:

```dart
LiquidGlass
```

---

## Header

Use:

```dart
LiquidGlass
```

---

## FAB

Use:

```dart
LiquidGlass
```

---

## Cards internos

Use:

```dart
FakeGlass
```

---

## Fundo

Use:

- Gradient
- Noise
- Blur leve
- Sombras suaves

O fundo influencia MUITO no resultado final.

---

# 13. Performance

A documentação alerta que o efeito é pesado.

Recomendações:

- Ativar Impeller
- Evitar dezenas de painéis LiquidGlass
- Limitar animações
- Usar FakeGlass quando possível
- Testar em dispositivos reais

---

# 14. Receita para reproduzir as imagens de referência

Sidebar:

```dart
thickness: 20
blur: 12
saturation: 1.2
borderRadius: 40
```

Cards:

```dart
FakeGlass
blur: 8
```

Botões:

```dart
LiquidGlass
thickness: 10
blur: 8
```

Glow:

```dart
Colors.white24
```

Fundo:

```text
Gradient escuro
+
Noise
+
Sombras suaves
```

Resultado esperado:

- Aproximadamente 90% a 95% do visual das referências
- Aparência semelhante ao Apple Liquid Glass
- Performance aceitável em Android e iOS