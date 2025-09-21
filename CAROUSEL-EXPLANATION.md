# 🎠 **CARROSSEL DE DEPOIMENTOS - EXPLICAÇÃO TÉCNICA**

## 📋 **Visão Geral**
O carrossel usa uma técnica de **posicionamento absoluto** com **transformações CSS** para criar o efeito de cards empilhados com diferentes níveis de profundidade.

## 🏗️ **Estrutura HTML**
```html
<div class="carousel-container">
  <!-- Container com altura fixa e overflow visível -->
  <div class="relative h-[420px] mb-6 overflow-visible px-8">
    
    <!-- Cada card é posicionado absolutamente -->
    <div class="absolute inset-0 transition-all duration-700 ease-in-out" 
         style="transform: translateX(0%) scale(1); z-index: 30; opacity: 1;">
      <!-- Card central (ativo) -->
    </div>
    
    <div class="absolute inset-0 transition-all duration-700 ease-in-out"
         style="transform: translateX(50%) translateY(-15%) scale(0.75) rotate(8deg); z-index: 20; opacity: 0.8;">
      <!-- Card direita -->
    </div>
    
    <div class="absolute inset-0 transition-all duration-700 ease-in-out"
         style="transform: translateX(-50%) translateY(-15%) scale(0.75) rotate(-8deg); z-index: 20; opacity: 0.8;">
      <!-- Card esquerda -->
    </div>
  </div>
  
  <!-- Navegação com dots -->
  <div class="navigation-dots">...</div>
</div>
```

## 🎨 **Lógica de Posicionamento**

### **Função JavaScript para calcular posições:**
```javascript
const getCardStyle = (index) => {
  const diff = index - currentIndex;
  const totalCards = cards.length;
  
  // Normaliza a diferença para array circular
  const normalizedDiff = ((diff % totalCards) + totalCards) % totalCards;
  const adjustedDiff = normalizedDiff > totalCards / 2 ? 
                       normalizedDiff - totalCards : normalizedDiff;
  
  if (adjustedDiff === 0) {
    // CARD CENTRAL (ativo)
    return {
      transform: 'translateX(0%) scale(1)',
      zIndex: 30,
      opacity: 1,
      filter: 'blur(0px)'
    };
  } else if (adjustedDiff === 1) {
    // CARD DIREITA
    return {
      transform: 'translateX(50%) translateY(-15%) scale(0.75) rotate(8deg)',
      zIndex: 20,
      opacity: 0.8,
      filter: 'blur(1px)'
    };
  } else if (adjustedDiff === -1) {
    // CARD ESQUERDA
    return {
      transform: 'translateX(-50%) translateY(-15%) scale(0.75) rotate(-8deg)',
      zIndex: 20,
      opacity: 0.8,
      filter: 'blur(1px)'
    };
  } else {
    // CARDS OCULTOS
    return {
      transform: 'translateX(0%) scale(0.6)',
      zIndex: 10,
      opacity: 0,
      filter: 'blur(2px)'
    };
  }
};
```

## 🎯 **Efeitos Visuais Detalhados**

### **1. Card Central (Ativo):**
- `transform: translateX(0%) scale(1)` - Posição normal, tamanho 100%
- `z-index: 30` - Mais alto (frente)
- `opacity: 1` - Totalmente visível
- `filter: blur(0px)` - Sem desfoque

### **2. Card Direita:**
- `translateX(50%)` - Move 50% para direita
- `translateY(-15%)` - Move 15% para cima
- `scale(0.75)` - Reduz para 75% do tamanho
- `rotate(8deg)` - Rotaciona 8 graus no sentido horário
- `z-index: 20` - Atrás do central
- `opacity: 0.8` - 80% de opacidade
- `filter: blur(1px)` - Leve desfoque

### **3. Card Esquerda:**
- `translateX(-50%)` - Move 50% para esquerda
- `translateY(-15%)` - Move 15% para cima
- `scale(0.75)` - Reduz para 75% do tamanho
- `rotate(-8deg)` - Rotaciona 8 graus no sentido anti-horário
- `z-index: 20` - Atrás do central
- `opacity: 0.8` - 80% de opacidade
- `filter: blur(1px)` - Leve desfoque

### **4. Cards Ocultos:**
- `scale(0.6)` - Muito pequenos (60%)
- `z-index: 10` - Mais atrás
- `opacity: 0` - Invisíveis
- `filter: blur(2px)` - Muito desfocados

## ⚡ **Transições Suaves**
```css
.card {
  transition: all 0.7s ease-in-out;
}
```
- **Duração:** 700ms
- **Easing:** ease-in-out (suave no início e fim)
- **Propriedades:** all (todas as transformações)

## 🎮 **Navegação**

### **Dots de Navegação:**
```javascript
const goToCard = (index) => {
  setCurrentIndex(index);
  // Recalcula todas as posições automaticamente
};
```

### **Navegação por Setas:**
```javascript
const nextCard = () => {
  setCurrentIndex((prev) => (prev + 1) % cards.length);
};

const prevCard = () => {
  setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
};
```

## 🎨 **CSS Classes Principais**

### **Container:**
```css
.carousel-container {
  position: relative;
  height: 420px;
  margin-bottom: 24px;
  overflow: visible;
  padding: 0 32px;
}
```

### **Cards:**
```css
.card {
  position: absolute;
  inset: 0;
  transition: all 0.7s ease-in-out;
  background: white;
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  padding: 16px;
  margin: 0 8px;
}
```

## 🔧 **Para Replicar em Outra Ferramenta:**

### **1. HTML Structure:**
- Container com `position: relative`
- Cards com `position: absolute`
- Altura fixa no container
- `overflow: visible` para ver cards laterais

### **2. JavaScript Logic:**
- Array de cards
- Index atual (currentIndex)
- Função para calcular posições baseada na diferença do index
- Transições suaves entre estados

### **3. CSS Transforms:**
- `translateX()` para movimento horizontal
- `translateY()` para movimento vertical
- `scale()` para redimensionamento
- `rotate()` para rotação
- `z-index` para profundidade
- `opacity` para transparência
- `filter: blur()` para desfoque

### **4. Responsive:**
- Ajustar padding lateral
- Reduzir altura em mobile
- Manter proporções dos cards

## 🎯 **Resultado Final:**
- ✅ Card central em destaque (100% opacidade, sem blur)
- ✅ Cards laterais menores e rotacionados (80% opacidade, blur leve)
- ✅ Transições suaves de 700ms
- ✅ Navegação circular infinita
- ✅ Efeito de profundidade com z-index
- ✅ Responsivo e touch-friendly

Esta técnica cria o efeito visual de "cartas empilhadas" que você vê na imagem! 🎴