# 🎴 **EMPILHAMENTO E INCLINAÇÃO DOS CARDS - EXPLICAÇÃO TÉCNICA**

## 🏗️ **COMO FUNCIONA O EMPILHAMENTO:**

### **1. Base: Todos os Cards na Mesma Posição**
```css
.card {
  position: absolute;
  inset: 0; /* Todos ocupam o mesmo espaço */
}
```
- Todos os cards começam **exatamente na mesma posição**
- É como ter uma pilha de cartas físicas, uma sobre a outra

### **2. Movimentação Individual via Transform**
```css
/* Card Central (ativo) */
transform: translateX(0%) scale(1);

/* Card Direita */
transform: translateX(50%) translateY(-15%) scale(0.75) rotate(8deg);

/* Card Esquerda */
transform: translateX(-50%) translateY(-15%) scale(0.75) rotate(-8deg);
```

## 🎯 **DETALHAMENTO DA INCLINAÇÃO:**

### **Card da Direita:**
- `translateX(50%)` → Move 50% para a **direita**
- `translateY(-15%)` → Move 15% para **cima** (cria o efeito "flutuante")
- `scale(0.75)` → Reduz para 75% do tamanho
- `rotate(8deg)` → **Inclina 8 graus no sentido horário** ↗️

### **Card da Esquerda:**
- `translateX(-50%)` → Move 50% para a **esquerda**
- `translateY(-15%)` → Move 15% para **cima**
- `scale(0.75)` → Reduz para 75% do tamanho
- `rotate(-8deg)` → **Inclina 8 graus no sentido anti-horário** ↖️

## 🎨 **EFEITO VISUAL RESULTANTE:**

```
    ↖️ Card Esquerda        Card Direita ↗️
       (rotação -8°)         (rotação +8°)
           \                     /
            \                   /
             \                 /
              \               /
               \             /
                \           /
                 \         /
                  \       /
                   \     /
                    \   /
                     \ /
                      🎯
                 Card Central
                (sem rotação)
```

## 🔧 **PROFUNDIDADE (Z-INDEX):**
```css
/* Card Central - Mais próximo */
z-index: 30;

/* Cards Laterais - Meio termo */
z-index: 20;

/* Cards Ocultos - Mais distantes */
z-index: 10;
```

## 💡 **ANALOGIA FÍSICA:**
Imagine que você tem **3 cartas de baralho**:

1. **Carta Central**: Reta na sua frente
2. **Carta Direita**: Meio escondida atrás, inclinada para a direita ↗️
3. **Carta Esquerda**: Meio escondida atrás, inclinada para a esquerda ↖️

## 🎭 **OPACIDADE PARA REALISMO:**
```css
/* Card Central */
opacity: 1; /* 100% visível */

/* Cards Laterais */
opacity: 0.8; /* 80% visível - parecem "atrás" */

/* Cards Ocultos */
opacity: 0; /* Invisíveis */
```

## ⚡ **TRANSIÇÃO SUAVE:**
```css
transition: all 0.7s ease-in-out;
```
- Quando muda de card, **todos se movem suavemente**
- O que estava na direita vai para o centro
- O que estava no centro vai para a esquerda
- **Efeito de "baralhar cartas"**

## 🎯 **RESULTADO FINAL:**
- ✅ Cards **empilhados** (mesmo ponto de origem)
- ✅ **Inclinação leve** (±8 graus)
- ✅ **Profundidade visual** (z-index + opacity)
- ✅ **Movimento fluido** (transition)
- ✅ **Foco no central** (maior, sem blur, 100% opaco)

**É como ter um leque de cartas que se reorganiza automaticamente!** 🃏✨