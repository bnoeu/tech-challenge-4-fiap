# Tech Challenge Fase 4 - FIAP · Blog de Posts

## 👥 Integrantes

* Bruno da silva santos
* Diogo Laureano de Sousa
* Lucas Miguel Ribeiro Silva

---

# 📑 Sumário

* [Introdução](#introdução)
* [Tecnologias](#tecnologias)
* [Arquitetura da Aplicação](#arquitetura-da-aplicação)
* [Estrutura de Pastas](#estrutura-de-pastas)
* [Pré-requisitos](#pré-requisitos)
* [Execução da Aplicação](#execução-da-aplicação)
* [Variáveis de Ambiente](#variáveis-de-ambiente)
* [Guia de Uso do Frontend](#guia-de-uso-do-frontend)
* [Controle de Acesso](#controle-de-acesso)
* [Rotas do Frontend](#rotas-do-frontend)
* [Gerenciamento de Estado Redux](#gerenciamento-de-estado-redux)
* [Estilização e Responsividade](#estilização-e-responsividade)
* [API REST](#api-rest)
* [Modelo de Dados](#modelo-de-dados)
* [Docker e Deploy](#docker-e-deploy)
* [CI/CD](#cicd)
* [Testes](#testes)
* [Swagger](#swagger)

---

# Introdução

Este projeto é uma plataforma de blog educacional com controle de acesso por papel (professor / aluno), desenvolvida como Tech Challenge Fase 4 da pós-graduação em Software Engineering da FIAP.

A aplicação conta com uma interface gráfica em React integrada a uma API REST em Node.js/Express, banco de dados MongoDB e pipeline completo de CI/CD via GitHub Actions com publicação automática de imagens Docker.

---

# Tecnologias

### Backend
| Tecnologia | Versão | Finalidade |
|---|---|---|
| Node.js | 20 | Runtime |
| TypeScript | 5 | Tipagem estática |
| Express | 5 | Framework HTTP |
| Mongoose | 9 | ODM para MongoDB |
| MongoDB | 7 | Banco de dados |
| Swagger (jsdoc + ui) | 6 / 5 | Documentação da API |
| Jest + Supertest | 30 / 7 | Testes automatizados |

### Frontend
| Tecnologia | Versão | Finalidade |
|---|---|---|
| React | 18 | Biblioteca de UI |
| TypeScript | 5 | Tipagem estática |
| Vite | 6 | Build tool e dev server |
| Redux Toolkit | 2 | Gerenciamento de estado global |
| React Redux | 9 | Binding React + Redux |
| React Router DOM | 6 | Roteamento SPA |
| Styled Components | 6 | Estilização CSS-in-JS |
| Axios | 1 | Cliente HTTP |

---

# Arquitetura da Aplicação

```
┌─────────────────────────────────────────────────┐
│                  NAVEGADOR                        │
│                                                   │
│  React 18 + Vite  ←→  Redux Toolkit              │
│  Styled Components    (authSlice / postsSlice)    │
│  React Router v6      Axios (proxy /posts)        │
└──────────────────────┬──────────────────────────┘
                       │ HTTP :3000
┌──────────────────────▼──────────────────────────┐
│               BACKEND (Express + TS)              │
│                                                   │
│  /api-docs  → Swagger UI                          │
│  /posts     → CRUD + Search endpoints             │
│  Mongoose ODM                                     │
└──────────────────────┬──────────────────────────┘
                       │ TCP :27017
┌──────────────────────▼──────────────────────────┐
│                  MongoDB 7                        │
│              volume: mongo_data                   │
└─────────────────────────────────────────────────┘
```

### Fluxo de autenticação

A autenticação é gerenciada no cliente via `localStorage`. O `authService` valida as credenciais e persiste o objeto `AuthUser` (com `name`, `email` e `role`) no storage. O Redux `authSlice` hidrata o estado a partir do storage na inicialização da aplicação, mantendo a sessão entre recarregamentos de página.

---

# Estrutura de Pastas

```
tech-challenge-3-fiap/
├── .github/
│   └── workflows/
│       ├── ci.yml              # Pipeline CI: testes + builds
│       └── cd.yml              # Pipeline CD: Docker Hub + GHCR
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── Error/          # ErrorMessage
│       │   ├── Layout/         # Header, Footer, Layout wrapper
│       │   ├── Loading/        # Spinner
│       │   ├── PostCard/       # Card da listagem de posts
│       │   ├── PostForm/       # Formulário criar / editar
│       │   ├── PrivateRoute/   # Guard de rota com controle de role
│       │   └── SearchBar/      # Campo de busca por palavra-chave
│       ├── pages/
│       │   ├── AccessDeniedPage.tsx
│       │   ├── AdminPage.tsx
│       │   ├── CreatePostPage.tsx
│       │   ├── EditPostPage.tsx
│       │   ├── HomePage.tsx
│       │   ├── LoginPage.tsx
│       │   └── PostPage.tsx
│       ├── redux/
│       │   ├── slices/
│       │   │   ├── authSlice.ts
│       │   │   └── postsSlice.ts
│       │   └── store.ts
│       ├── services/
│       │   ├── api.ts          # Instância Axios com baseURL
│       │   └── authService.ts  # Login, logout e persistência
│       ├── styles/
│       │   └── GlobalStyles.ts # Tema e reset CSS global
│       ├── types/
│       │   └── index.ts        # Interfaces TypeScript compartilhadas
│       ├── App.tsx             # Roteamento principal
│       └── main.tsx
├── src/                        # Backend TypeScript
│   ├── config/
│   │   ├── database.ts
│   │   └── swagger.ts
│   ├── modules/post/
│   │   ├── post.controller.ts
│   │   ├── post.model.ts
│   │   └── post.routes.ts
│   ├── routes/index.ts
│   ├── app.ts
│   └── server.ts
├── test/                       # Testes Jest + Supertest
├── Dockerfile                  # Backend (Node 20)
├── docker-compose.yml          # Stack local (mongo + api + frontend)
├── docker-compose.hub.yml      # Stack com imagens do Docker Hub
├── package.json
└── tsconfig.json
```

---

# Pré-requisitos

* Docker Desktop (recomendado)  
  _ou_ Node.js 20+ e MongoDB 7+ instalados localmente
* Git

---

# Execução da Aplicação

## 🔹 Opção 1 — Docker com build local (código-fonte)

```bash
docker compose up --build
```

## 🔹 Opção 2 — Imagens pré-construídas do Docker Hub (sem build)

```bash
docker compose -f docker-compose.hub.yml up
```

Aguarde os três containers iniciarem e acesse:

| Serviço | URL |
|---|---|
| **Frontend** | http://localhost |
| **API REST** | http://localhost:3000 |
| **Swagger** | http://localhost:3000/api-docs |
| **MongoDB** | mongodb://localhost:27017/tech-challenge |

Para parar:
```bash
docker compose down
```
Para parar e apagar dados do MongoDB:
```bash
docker compose down -v
```

## 🔹 Opção 3 — Rodando localmente (sem Docker)

**Backend:**
```bash
cp .env.example .env   # ajuste MONGO_URI se necessário
npm install
npm run dev            # hot reload com ts-node-dev em :3000
```

**Frontend** (em outro terminal):
```bash
cd frontend
npm install
npm run dev            # Vite dev server em :5173 com proxy para :3000
```

Acesse http://localhost:5173.

---

# Variáveis de Ambiente

Crie `.env` na raiz (já está no `.gitignore`):

```env
MONGO_URI=mongodb://localhost:27017/tech-challenge
PORT=3000
NODE_ENV=development
```

---

# Guia de Uso do Frontend

## Usuários de teste

| Papel | E-mail | Senha |
|---|---|---|
| Professor | professor@example.com | 123456 |
| Professor (admin) | admin@example.com | admin123 |
| Aluno | aluno@example.com | aluno123 |

## Páginas e funcionalidades

### Página Principal — `/`
- Exibe todos os posts em grid responsivo.
- Cada card mostra: **título** (clicável), **prévia do conteúdo** (clicável), **autor** e **data**.
- Campo de busca filtra posts por palavra-chave via endpoint `GET /posts/search?q=`.
- Exibe contador de resultados ao buscar.

### Leitura de Post — `/posts/:id`
- Exibe o conteúdo completo do post selecionado.
- Mostra autor, data de publicação e data de atualização (se editado).
- Professores autenticados veem botões de **Editar** e **Excluir**.

### Login — `/login`
- Formulário de e-mail e senha com validação.
- Redireciona para a página principal após autenticação.

### Criar Post — `/criar` _(somente professores)_
- Formulário com campos: **Título**, **Autor** e **Conteúdo**.
- Validação de campos obrigatórios no cliente.
- Envia `POST /posts` ao servidor.
- Redireciona para o post criado após sucesso.

### Editar Post — `/editar/:id` _(somente professores)_
- Carrega automaticamente os dados atuais do post.
- Mesmos campos do formulário de criação, pré-preenchidos.
- Envia `PUT /posts/:id` ao servidor.
- Redireciona para o post atualizado após sucesso.

### Painel Administrativo — `/admin` _(somente professores)_
- Tabela com todos os posts: título, autor, data e ações.
- Botões **Editar** (redireciona para `/editar/:id`) e **Excluir** (com confirmação).
- Atalho "+ Novo Post" para criação rápida.

### Acesso Negado — `/acesso-negado`
- Exibida quando um aluno tenta acessar rota exclusiva de professores.

---

# Controle de Acesso

A autorização é gerenciada pelo componente `PrivateRoute`:

| Perfil | Acesso |
|---|---|
| Visitante | `/` e `/posts/:id` |
| Aluno logado | `/` e `/posts/:id` (sem botões de edição) |
| Professor logado | Todas as rotas, incluindo `/criar`, `/editar/:id` e `/admin` |

O `PrivateRoute` recebe a prop `requiredRole`. Se o usuário não tiver o papel exigido, é redirecionado para `/acesso-negado`.

---

# Rotas do Frontend

| Rota | Componente | Acesso |
|---|---|---|
| `/` | `HomePage` | Público |
| `/posts/:id` | `PostPage` | Público |
| `/login` | `LoginPage` | Público |
| `/criar` | `CreatePostPage` | Professor |
| `/editar/:id` | `EditPostPage` | Professor |
| `/admin` | `AdminPage` | Professor |
| `/acesso-negado` | `AccessDeniedPage` | Público |

---

# Gerenciamento de Estado Redux

O estado global é gerenciado com **Redux Toolkit** e dois slices:

### `authSlice`
| Campo | Tipo | Descrição |
|---|---|---|
| `isAuthenticated` | `boolean` | Há usuário logado |
| `user` | `AuthUser \| null` | Dados do usuário (nome, e-mail, role) |

### `postsSlice`
| Campo | Tipo | Descrição |
|---|---|---|
| `items` | `Post[]` | Lista de posts exibida |
| `selectedPost` | `Post \| null` | Post em leitura ou edição |
| `loading` | `boolean` | Indicador de carregamento |
| `error` | `string \| null` | Mensagem de erro da API |
| `searchQuery` | `string` | Termo de busca ativo |

### Thunks assíncronos
- `fetchPosts()` — `GET /posts`
- `searchPosts(query)` — `GET /posts/search?q=`
- `fetchPostById(id)` — `GET /posts/:id`
- `createPost(payload)` — `POST /posts`
- `updatePost({ id, payload })` — `PUT /posts/:id`
- `deletePost(id)` — `DELETE /posts/:id`

---

# Estilização e Responsividade

A estilização utiliza **Styled Components** com tema centralizado em `GlobalStyles.ts`.

### Breakpoints (Mobile-First)
| Nome | Largura máxima |
|---|---|
| `mobile` | 768px |
| `tablet` | 1024px |

### Grid responsivo
- Desktop: `repeat(auto-fill, minmax(300px, 1fr))`
- Mobile: `1fr` (coluna única)

O tema exporta tokens de design (`colors`, `spacing`, `radius`, `shadow`, `breakpoints`) reutilizados em todos os componentes para consistência visual.

---


# API REST

Base URL: `http://localhost:3000`

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/posts` | Lista todos os posts |
| `GET` | `/posts/search?q={termo}` | Busca por palavra-chave (título ou conteúdo) |
| `GET` | `/posts/:id` | Retorna um post pelo ID |
| `POST` | `/posts` | Cria um novo post |
| `PUT` | `/posts/:id` | Atualiza um post existente |
| `DELETE` | `/posts/:id` | Remove um post |

### Corpo das requisições (POST / PUT)

```json
{
  "title": "Título do Post",
  "content": "Conteúdo completo do post...",
  "author": "Nome do Autor"
}
```

### Exemplos com curl

```bash
# Listar todos os posts
curl http://localhost:3000/posts

# Buscar por palavra-chave
curl "http://localhost:3000/posts/search?q=javascript"

# Criar post
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"Novo Post","content":"Conteúdo...","author":"Prof. Silva"}'

# Atualizar post
curl -X PUT http://localhost:3000/posts/<id> \
  -H "Content-Type: application/json" \
  -d '{"title":"Título atualizado","content":"...","author":"..."}'

# Deletar post
curl -X DELETE http://localhost:3000/posts/<id>
```

---

# Modelo de Dados

```json
{
  "_id": "ObjectId",
  "title": "string",
  "content": "string",
  "author": "string",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

---

# Docker e Deploy

## Imagens disponíveis

| Registro | Imagem |
|---|---|
| Docker Hub | `laureanowow/tech-challenge-api:latest` |
| Docker Hub | `laureanowow/tech-challenge-frontend:latest` |
| GHCR | `ghcr.io/diogolaureano/tech-challenge-api:latest` |
| GHCR | `ghcr.io/diogolaureano/tech-challenge-frontend:latest` |

## Opção 1 — Docker Compose com Docker Hub

```bash
docker compose -f docker-compose.hub.yml up
```

## Opção 2 — GHCR (GitHub Container Registry)

```bash
docker pull ghcr.io/diogolaureano/tech-challenge-api:latest
docker pull ghcr.io/diogolaureano/tech-challenge-frontend:latest
```

## Opção 3 — Arquivo .tar (transferência offline)

```bash
# Exportar
docker save laureanowow/tech-challenge-api:latest | gzip > api.tar.gz
docker save laureanowow/tech-challenge-frontend:latest | gzip > frontend.tar.gz

# Importar em outra máquina
docker load < api.tar.gz
docker load < frontend.tar.gz
docker compose -f docker-compose.hub.yml up
```

## Opção 4 — Build local a partir do código-fonte

```bash
docker compose up --build
```

---

# CI/CD

Pipeline com GitHub Actions em dois workflows:

### CI (`ci.yml`) — disparado em todo push e PR para `main`

```
test-backend   → npm ci && npm test
      ↓
build-backend  → npm run build (tsc)

build-frontend → npm ci && npm run build  (paralelo)
              → upload artifact: frontend/dist
```

### CD (`cd.yml`) — disparado em push para `main`

```
wait-ci        → testes + build (garantia de qualidade)
      ↓
docker-publish
  ├── Login Docker Hub  (DOCKERHUB_USERNAME / DOCKERHUB_TOKEN)
  ├── Login GHCR        (GHCR_TOKEN)
  ├── Build + Push API  → :latest e :<sha>
  └── Build + Push Frontend → :latest e :<sha>
```

### Secrets necessários no repositório GitHub

| Secret | Descrição |
|---|---|
| `DOCKERHUB_USERNAME` | Usuário do Docker Hub |
| `DOCKERHUB_TOKEN` | Access token do Docker Hub |
| `GHCR_TOKEN` | GitHub token com permissão `write:packages` |

---

# Testes

Os testes do backend utilizam **Jest** e **Supertest**, com banco de dados mockado:

```bash
# Rodar testes
npm test

# Rodar com cobertura
npm test -- --coverage
```

Cobertura dos testes:
* Listagem de todos os posts (`GET /posts`)
* Busca por palavra-chave (`GET /posts/search`)
* Leitura por ID (`GET /posts/:id`)
* Criação (`POST /posts`)
* Atualização (`PUT /posts/:id`)
* Exclusão (`DELETE /posts/:id`)
* Tratamento de erros (IDs inválidos, campos obrigatórios)

---

# Swagger

Documentação interativa da API disponível em:

```
http://localhost:3000/api-docs
```

Permite visualizar todos os endpoints, ver contratos de requisição/resposta e testar a API diretamente no navegador.

---

# Considerações Finais

O projeto demonstra:

* Interface gráfica em React com controle de acesso por papel (professor/aluno)
* Gerenciamento de estado com Redux Toolkit
* Estilização responsiva com Styled Components e tema centralizado
* Integração completa com API REST via Axios
* Arquitetura backend modular (model / controller / routes)
* Containerização com Docker e Docker Compose
* Publicação de imagens no Docker Hub e GHCR
* Automação completa com CI/CD via GitHub Actions
* Testes automatizados com Jest e Supertest
* Documentação da API com Swagger





