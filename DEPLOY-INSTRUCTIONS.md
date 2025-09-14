# 📦 Instruções de Deploy para Hospedagem

## 🚀 Como Gerar os Arquivos para Hospedagem

### Passo 1: Gerar Build de Produção
```bash
npm run build:hosting
```

Este comando irá:
- Limpar a pasta `dist/` anterior
- Gerar um novo build otimizado para produção
- Criar um arquivo `build-info.json` com informações do build
- Mostrar instruções de deploy

### Passo 2: Arquivos Gerados
Após executar o comando, você encontrará na pasta `dist/`:
- `index.html` - Página principal
- `assets/` - CSS e JavaScript otimizados
- `favicon.ico` - Ícone do site
- `build-info.json` - Informações do build (data, versão, etc.)

### Passo 3: Upload para Hospedagem
1. **Copie todos os arquivos** da pasta `dist/`
2. **Faça upload** para o diretório raiz da sua hospedagem
3. **Configure o servidor** para servir `index.html` como fallback para rotas SPA

## ⚙️ Configurações de Servidor

### Apache (.htaccess)
Crie um arquivo `.htaccess` no diretório raiz:
```apache
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

### Nginx
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

### Netlify
Crie um arquivo `_redirects` na pasta `public/`:
```
/*    /index.html   200
```

### Vercel
Crie um arquivo `vercel.json` na raiz:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

## 🔧 Comandos Úteis

- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build básico
- `npm run build:hosting` - Build com instruções de deploy
- `npm run preview` - Preview do build local

## 📝 Notas Importantes

1. **Sempre teste localmente** com `npm run preview` antes do deploy
2. **Verifique o arquivo build-info.json** para confirmar a data/versão do build
3. **Mantenha backup** dos arquivos de configuração da hospedagem
4. **Configure HTTPS** na sua hospedagem para melhor segurança

## 🆘 Solução de Problemas

- **Página em branco**: Verifique se o servidor está configurado para SPAs
- **Recursos não carregam**: Confirme se todos os arquivos da pasta `assets/` foram enviados
- **Rotas não funcionam**: Configure o fallback para `index.html`