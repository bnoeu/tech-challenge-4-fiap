# Tech Challenge Fase 4 — FIAP · Blog de Posts

Plataforma de blog educacional com controle de acesso por papel (professor / aluno),
desenvolvida para o Tech Challenge da Fase 4 da pós-graduação em Software Engineering
da FIAP. Este repositório reúne o back-end (herdado e estendido da Fase 3, com
autenticação e CRUD de professores/alunos) e o novo aplicativo mobile em React Native
pedido nesta fase.

## 👥 Integrantes

* Bruno da Silva Santos
* Diogo Laureano de Sousa
* Lucas Miguel Ribeiro Silva

## Estrutura do repositório

Cada pasta abaixo tem seu **próprio README** com detalhes de arquitetura, setup e guia
de uso — este README serve apenas como ponto de partida para navegar entre eles.

```
.
├── backend/      → API REST (Node.js/Express/TypeScript + MongoDB)
└── mobile-app/   → Aplicativo mobile (React Native / Expo)
```

### [`backend/`](backend/Readme.md)

API REST originada na Fase 3 e estendida nesta fase com autenticação e administração
de pessoas. Contém:

* **Posts** (`src/modules/post`) — CRUD e busca por palavra-chave, já existente da
  Fase 3.
* **Auth** (`src/modules/auth`) — login de professores e emissão de JWT.
* **Teachers** e **Students** (`src/modules/teacher`, `src/modules/student`) — CRUD
  paginado de professores e alunos, novos nesta fase.
* **Middleware de autenticação** (`src/middlewares/auth.middleware.ts`) — protege as
  rotas de escrita (`POST`/`PUT`/`DELETE`) exigindo token JWT válido.
* `tests/` — suíte Jest/Supertest cobrindo os quatro módulos.
* `docker-compose.yml` — sobe API + MongoDB (e o frontend web herdado da Fase 3) com
  um único comando.
* `frontend/` — SPA em React da Fase 3 (não é o foco desta entrega, mas segue
  funcional e integrada à mesma API).

Veja o [README do backend](backend/Readme.md) para instruções completas de setup,
variáveis de ambiente, endpoints da API e execução via Docker.

### [`mobile-app/`](mobile-app/README.md)

Aplicativo React Native (Expo), entregável principal desta fase, consumindo a mesma
API do `backend/`. Contém:

* Autenticação de professores com sessão persistida (`AsyncStorage`).
* Listagem e busca de posts, leitura completa, criação/edição/exclusão (professores).
* Painel administrativo de posts.
* CRUD paginado de professores e alunos, reaproveitando os mesmos componentes de tela
  (`PeopleListScreen` / `PeopleFormScreen`) para os dois cadastros.
* Controle de acesso em duas camadas: o app esconde ações de escrita para quem não é
  professor, e o back-end rejeita (401) qualquer chamada de escrita sem token válido.

Veja o [README do mobile-app](mobile-app/README.md) para arquitetura da aplicação,
setup inicial (Expo), guia de uso e o relato de desafios da equipe.

## Como rodar o projeto

1. Suba o back-end primeiro — instruções em [`backend/Readme.md`](backend/Readme.md)
   (via Docker Compose ou localmente).
2. Depois rode o app mobile — instruções em
   [`mobile-app/README.md`](mobile-app/README.md), ajustando a `BASE_URL` da API para
   o IP da máquina onde o back-end está rodando.
