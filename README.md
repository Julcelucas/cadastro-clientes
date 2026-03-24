# Cadastro de Clientes - Sistema de Gestão Comercial

Aplicação web moderna para gestão e cadastro de clientes em contexto angolano, construída com **React** e **Vite**, com persistência de dados no navegador via localStorage.

## 🎯 Funcionalidades

- ✅ **CRUD Completo**: Criar, editar, listar e excluir clientes
- 📱 **Dados Angolanos**: NIF, província, telefone com padrão +244
- 🔍 **Busca Inteligente**: Filtrar por nome, email, NIF, província e telefone
- 📊 **Resumo Rápido**: Estatísticas de clientes cadastrados
- 💾 **Persistência**: Dados salvos automaticamente no localStorage
- 📱 **Responsivo**: Interface adaptada para desktop, tablet e mobile
- ⚡ **Performance**: Build otimizado com Vite, ~62KB gzip

## 🚀 Início Rápido

### Pré-requisitos
- Node.js 16+ e npm

### Instalação

```bash
# Clone o repositório
git clone <seu-repositorio>
cd cadastro-clientes

# Instale as dependências
npm install
```

### Desenvolvimento

```bash
# Inicie o servidor de desenvolvimento (HMR ativado)
npm run dev

# Abra http://localhost:5173 no navegador
```

### Validação

```bash
# Execute o linter
npm run lint

# Verifique se há erros
npm run build

# Visualize o build de produção
npm run preview
```

## 📦 Build para Produção

```bash
# Gere o build otimizado
npm run build

# Os arquivos compilados estarão em ./dist
```

O build inclui:
- CSS minificado
- JavaScript minificado (Terser)
- Remoção de console.log em produção
- Chunking automático de vendor para melhor caching
- Source maps desabilitados para reduzir tamanho

## 🌐 Deploy

A aplicação pode ser deployada em qualquer servidor web estático:

### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### Vercel
```bash
npm install -g vercel
vercel --prod
```

### GitHub Pages
Adicione ao `package.json`:
```json
{
  "homepage": "https://<seu-usuario>.github.io/cadastro-clientes"
}
```

### Servidor Web (nginx, Apache, S3, etc.)
Copie os arquivos de `./dist` para o servidor:
```bash
# Exemplo com SCP
scp -r dist/* usuario@servidor:/var/www/cadastro-clientes/
```

## 📋 Estrutura do Projeto

```
cadastro-clientes/
├── src/
│   ├── App.jsx          # Componente principal com lógica CRUD
│   ├── App.css          # Estilos profissionais
│   ├── index.css        # Variables CSS e estilos globais
│   └── main.jsx         # Ponto de entrada
├── public/              # Assets estáticos
├── dist/                # Build de produção (gerado)
├── vite.config.js       # Configuração Vite
├── eslint.config.js     # Configuração ESLint
├── package.json         # Dependências
└── README.md            # Este arquivo
```

## 🔐 Dados e Privacidade

- **Sem servidor backend**: Todos os dados são armazenados localmente no navegador (localStorage)
- **Sem cookies de rastreamento**: Aplicação não coleta dados pessoais
- **Backup local**: Exporte seus dados regularmente (data estarão no IndexedDB do navegador)

## 🛠️ Tecnologias

- **React 19.2**: Interface reativa
- **Vite 8**: Build tool ultrarrápido
- **ESLint 9**: Qualidade de código
- **Manrope + Sora**: Tipografia moderna

## 📝 Licença

Este projeto é fornecido como é. Sinta-se livre para utilizá-lo e modificá-lo.

## 👨‍💻 Desenvolvimento

Para contribuir ou reportar problemas:
1. Certifique-se que `npm run lint` passa
2. Certifique-se que `npm run build` não tem erros
3. Teste localmente com `npm run dev`

---

**Versão**: 1.0.0 | **Última atualização**: Março 2026 | **Status**: Pronto para produção ✅
