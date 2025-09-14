# 🚀 TUTORIAL COMPLETO: Deploy no Vercel

## 📋 **PASSO 1: Preparar Repositório GitHub**

### Se você NÃO tem repositório ainda:
1. Vá para https://github.com
2. Clique em "New repository"
3. Nome: `eagleboost-landing`
4. Marque "Public"
5. Clique "Create repository"

### Comandos para subir o código:
```bash
# No terminal/prompt de comando:
git init
git add .
git commit -m "Add EAGLEBOOST landing page with admin panel"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/eagleboost-landing.git
git push -u origin main
```

## 🌐 **PASSO 2: Deploy no Vercel**

### 2.1 Criar conta no Vercel:
1. Vá para https://vercel.com
2. Clique "Sign Up"
3. Escolha "Continue with GitHub"
4. Autorize o Vercel

### 2.2 Criar novo projeto:
1. No dashboard do Vercel, clique "New Project"
2. Encontre seu repositório `eagleboost-landing`
3. Clique "Import"

### 2.3 Configurar o projeto:
```
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### 2.4 Variáveis de ambiente (opcional):
- Não precisa configurar nada adicional
- Suas configurações já estão no código

### 2.5 Deploy:
1. Clique "Deploy"
2. Aguarde 2-3 minutos
3. Seu site estará no ar!

## ✅ **PASSO 3: Verificar**

Após o deploy, verifique:
- ✅ Site carrega corretamente
- ✅ Admin funciona em `/admin`
- ✅ Suas alterações estão aplicadas
- ✅ Botão Bolt não aparece

## 🆘 **Se der problema:**

### Erro de build:
```bash
# Teste localmente primeiro:
npm install
npm run build
npm run preview
```

### Erro de rota:
- O arquivo `vercel.json` já está configurado
- Todas as rotas redirecionam para `/index.html`

### Configurações não aplicadas:
- Suas alterações estão salvas no código
- Não precisa configurar nada adicional

## 🎉 **RESULTADO FINAL:**

Seu site estará disponível em:
`https://SEU-PROJETO-HASH.vercel.app`

**Tempo estimado: 10-15 minutos** ⏱️