# Guia de Deploy - Cadastro de Clientes

Documento com instruções para fazer deploy da aplicação em diferentes plataformas.

## 🔍 Pré-requisitos para Deploy

- Build local validado: `npm run build` sem erros
- Lint passou: `npm run lint` sem avisos
- Node.js 16+ e npm 7+ instalados localmente

## ✅ Checklist Pré-Deploy

Antes de fazer deploy, execute:

```bash
# 1. Certifique-se que o código está limpo
npm run lint

# 2. Valide o build
npm run build

# 3. Teste o build localmente
npm run preview

# Visite http://localhost:4173 e teste a aplicação
```

## 🌐 Opções de Deploy

### 1. **Vercel** (Recomendado - Mais fácil)

Vercel é a plataforma oficial para Vite e oferece deploy gratuito com domínio `.vercel.app`.

**Passo a passo:**

a) **Via CLI:**
```bash
# Instale o CLI do Vercel
npm i -g vercel

# Faça login
vercel login

# Deploy em produção
vercel --prod
```

b) **Via GitHub:**
1. Faça push do código para GitHub
2. Acesse https://vercel.com/
3. Clique "New Project"
4. Selecione o repositório GitHub
5. Vercel detectará automaticamente Vite
6. Clique "Deploy"

**Configuração automática em `vercel.json`** (opcional):
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

---

### 2. **Netlify** (Popular)

Netlify oferece deploy automático e contínuo com GitHub.

**Via CLI:**
```bash
# Instale o CLI
npm i -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod --dir=dist
```

**Via GitHub:**
1. Commit e push para GitHub
2. Acesse https://app.netlify.com/
3. "Add new site" → "Connect to Git"
4. Selecione repositório
5. Build command: `npm run build`
6. Publish directory: `dist`
7. Deploy

---

### 3. **GitHub Pages** (Gratuito)

Ideal se o repositório já está em GitHub.

**Passo a passo:**

a) Atualize `vite.config.js`:
```javascript
export default defineConfig({
  base: '/cadastro-clientes/', // ou seu-repositorio/
  // ... resto da config
})
```

b) Adicione ao `package.json`:
```json
{
  "homepage": "https://seu-usuario.github.io/cadastro-clientes"
}
```

c) Crie `.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-artifact@v3
        with:
          name: dist
          path: dist
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

d) Ative GitHub Pages nas configurações do repositório (Settings → Pages → Source: gh-pages)

---

### 4. **Servidor Web Manual** (VPS, Dedicated)

Para servidores com controle total (nginx, Apache, etc).

**Passos:**

1. **Localmente, gere o build:**
```bash
npm run build
```

2. **Copie os arquivos para o servidor:**
```bash
# Usando SCP
scp -r dist/* usuario@seu-servidor.com:/var/www/cadastro-clientes/

# Ou usando rsync (mais eficiente)
rsync -avz dist/ usuario@seu-servidor.com:/var/www/cadastro-clientes/
```

3. **Configure nginx (exemplo):**
```nginx
server {
    listen 80;
    server_name seu-dominio.com www.seu-dominio.com;

    root /var/www/cadastro-clientes;
    index index.html;

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache para assets estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
}
```

4. **Configure Apache (exemplo):**
```apache
<Directory /var/www/cadastro-clientes>
    AllowOverride All
    Allow from all
</Directory>

<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
</IfModule>
```

---

### 5. **AWS S3 + CloudFront**

Para armazenamento em nuvem com CDN global.

**Passo a passo:**

1. **Crie um bucket S3:**
   - AWS S3 → Create bucket
   - Nome: `seu-dominio.com`
   - Desabilite "Block Public Access"

2. **Configure a política de bucket:**
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::seu-dominio.com/*"
        }
    ]
}
```

3. **Upload do build:**
```bash
aws s3 sync dist/ s3://seu-dominio.com/
```

4. **Configure CloudFront:**
   - CloudFront → Create distribution
   - Origin: seu bucket S3
   - Default Root Object: `index.html`
   - Custom error response: 404 → /index.html (status 200)

---

### 6. **Docker** (Para containerização)

Se quiser containerizar a aplicação.

**Dockerfile:**
```dockerfile
# Build stage
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Serve stage
FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
```

**Build e run:**
```bash
docker build -t cadastro-clientes .
docker run -p 3000:3000 cadastro-clientes
```

---

## 📊 Verificação Pós-Deploy

Após fazer deploy, verifique:

1. **Aplicação carrega:**
   - Abra seu domínio no navegador
   - Veja se o título "Cadastro de Clientes" aparece

2. **Funcionalidades funcionam:**
   - Crie um cliente
   - Edite um cliente
   - Busque um cliente
   - Exclua um cliente

3. **Dados persistem:**
   - Recarregue a página (F5)
   - Certifique-se que os dados estão aí

4. **Performance:**
   - Abra DevTools → Network
   - Verifique tamanho dos arquivos:
     - JS bundle: ~62KB (gzip)
     - CSS: ~1.7KB (gzip)

5. **HTTPS:**
   - URL deve usar `https://` (não `http://`)
   - Certificado SSL deve ser válido

---

## 🔧 Troubleshooting

### "API não funciona" ou "Dados não salvam"
- Certifique-se que localStorage está ativado no navegador
- Aplicação usa localStorage, não precisa de backend

### "Site mostra erro 404"
- Certifique-se que o servidor está configurado para SPA (fallback para index.html)
- Exemplo para nginx: `try_files $uri /index.html;`

### "Build falha durante deploy"
- Verifique que `npm run lint` passa localmente
- Verifique versão do Node.js no servidor (deve ser 16+)
- Limpe node_modules e reinstale: `rm -rf node_modules && npm install`

### "Aplicação lag ou lenta"
- Verifique se gzip está ativado no servidor
- Limpe cache do navegador (Ctrl+Shift+Del)
- Verifique conexão de internete

---

## 📈 Monitoramento em Produção

### Recomendado adicionar:
1. **Sentry** para erro tracking
2. **LogRocket** para session replay
3. **Vercel Analytics** (se usar Vercel)
4. **Google Analytics** para tráfego

---

## 🔐 Segurança

- ✅ Dados no localStorage (não há servidor a comprometer)
- ✅ Sem credenciais expostas
- ✅ HTTPS obrigatório
- ⚠️ localStorage é limitado a ~10MB
- ⚠️ localStorage pode ser limpo pelo utilizador

Considere um backend se precisar:
- Sincronização entre dispositivos
- Backup automático
- Autenticação de utilizadores

---

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique o console do navegador (F12)
2. Verifique os logs do servidor de deploy
3. Releia este guia

Boa sorte com o deploy! 🚀
