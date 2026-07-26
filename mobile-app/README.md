# Blog Mobile — React Native (Tech Challenge Fase 04)

Aplicativo mobile em **React Native (Expo)** para a plataforma de blog educacional,
consumindo a API REST do back-end da Fase 03 (Node.js/Express/MongoDB), estendida
nesta fase com autenticação e CRUD de professores e alunos.

## Arquitetura da aplicação

```
┌─────────────────────────────────────────────┐
│                APP MOBILE (Expo)             │
│                                               │
│  App.js                                      │
│   └─ AuthProvider (Context API)              │
│       └─ AppNavigator (React Navigation)     │
│           ├─ LoginScreen                     │
│           ├─ PostListScreen                  │
│           ├─ PostDetailScreen                │
│           ├─ PostFormScreen                  │
│           ├─ AdminPostsScreen                │
│           ├─ PeopleListScreen (teacher/aluno)│
│           └─ PeopleFormScreen (teacher/aluno)│
│                                               │
│  src/api/api.js → axios + interceptor JWT    │
└──────────────────┬────────────────────────────┘
                   │ HTTP (JSON)
┌──────────────────▼────────────────────────────┐
│         BACKEND (Node/Express/TS)             │
│  /auth  /posts  /teachers  /students          │
└──────────────────┬────────────────────────────┘
                   │
              MongoDB
```

### Decisões de arquitetura

- **Gerenciamento de estado**: Context API (`AuthContext`) para autenticação/sessão.
  Cada tela gerencia seu próprio estado local com hooks (`useState`, `useEffect`),
  sem necessidade de Redux dado o escopo do app.
- **Navegação**: React Navigation (native-stack). O `AppNavigator` decide quais
  telas existem com base no `user` do `AuthContext` — sem sessão, só a tela de
  Login é acessível.
- **Persistência de sessão**: `AsyncStorage` guarda o token JWT e os dados do
  usuário logado, restaurando a sessão ao reabrir o app.
- **Camada de API centralizada**: `src/api/api.js` concentra todas as chamadas
  REST (posts, professores, alunos, autenticação), com um interceptor do axios
  que anexa automaticamente o header `Authorization: Bearer <token>`.
- **Componentes reutilizados**: `PeopleListScreen` e `PeopleFormScreen` atendem
  tanto professores quanto alunos (parâmetro `type`), evitando duplicação de
  código entre os dois CRUDs praticamente idênticos.

## Controle de acesso (permissões)

| Perfil | O que pode fazer |
| --- | --- |
| **Visitante / Aluno** | Visualizar lista de posts, buscar, ler post completo |
| **Professor (logado)** | Tudo acima + criar/editar/excluir posts, e criar/editar/excluir professores e alunos |

- Apenas **professores** possuem login (e-mail + senha). Alunos usam o app em
  modo "somente leitura", sem autenticação — ao abrir o app, podem optar por
  "Continuar como aluno".
- A garantia de permissão é **dupla**: o app esconde botões de escrita para
  quem não é professor, e o back-end também rejeita (401) qualquer chamada de
  criação/edição/exclusão sem um token JWT válido.

## Pré-requisitos

- Node.js 18+
- Expo Go instalado no celular (Android/iOS) **ou** um emulador Android/iOS
- O back-end rodando (veja o README do repositório do back-end)

## Setup inicial

```bash
# 1. Instalar dependências
npm install

# 2. Configurar a URL da API
# Edite src/api/api.js e ajuste BASE_URL para o IP da máquina rodando o back-end:
#   - Emulador Android: http://10.0.2.2:3000
#   - iOS Simulator:    http://localhost:3000
#   - Expo Go (device físico): http://<IP-da-sua-rede-local>:3000

# 3. Rodar o app
npm start
```

Escaneie o QR Code com o app **Expo Go** (Android) ou a câmera (iOS), ou
pressione `a` / `i` no terminal para abrir em um emulador.

## Guia de uso

1. **Login**: professores entram com e-mail/senha (veja o seed do back-end
   para credenciais de teste). Alunos tocam em "Continuar como aluno(a)".
2. **Lista de posts**: tela inicial, com busca por palavra-chave. Professores
   veem botões extras: `+ Novo Post`, `Admin`, `Professores`, `Alunos`.
3. **Leitura de post**: toque em qualquer card para ver o conteúdo completo.
   Professores veem botões de Editar/Excluir.
4. **Criar/editar post**: formulário com título, autor e conteúdo.
5. **Administração de posts**: lista todos os posts com ações rápidas de
   editar/excluir.
6. **Professores / Alunos**: listagem paginada com editar/excluir, e formulário
   de cadastro (professores exigem senha; alunos exigem número de matrícula).

## Estrutura de pastas

```
mobile-app/
├── App.js
├── app.json
├── babel.config.js
├── package.json
└── src/
    ├── api/
    │   └── api.js              # Cliente axios + todas as chamadas REST
    ├── context/
    │   └── AuthContext.js      # Login, logout, sessão persistida
    ├── navigation/
    │   └── AppNavigator.js     # Stack de telas + controle de acesso
    ├── components/
    │   ├── PostCard.js
    │   └── SearchBar.js
    └── screens/
        ├── LoginScreen.js
        ├── PostListScreen.js
        ├── PostDetailScreen.js
        ├── PostFormScreen.js
        ├── AdminPostsScreen.js
        ├── PeopleListScreen.js   # genérica: professores ou alunos
        └── PeopleFormScreen.js   # genérica: professores ou alunos
```

## Relato de desafios

Este foi o primeiro contato da equipe com o desenvolvimento de um aplicativo mobile,
o que trouxe uma curva de aprendizado real ao longo do projeto. Boa parte do esforço
inicial foi entender o ecossistema do React Native e do Expo — hooks, navegação entre
telas com React Navigation, persistência de sessão com AsyncStorage e o ciclo de
build/execução em emulador e dispositivo físico, tudo isso sem a base prévia que já
tínhamos com React para web.

Outro ponto de aprendizado foi a integração entre o app e o back-end: configurar a
`BASE_URL` corretamente para cada ambiente (emulador Android, simulador iOS e Expo Go
em dispositivo físico), lidar com CORS e ajustar o interceptor do Axios para anexar o
token JWT em todas as requisições autenticadas. Também exigiu atenção desenhar o fluxo
de autenticação de forma que professores tivessem login completo enquanto alunos
pudessem navegar em modo leitura sem qualquer barreira.

Apesar da curva de aprendizado, o processo reforçou conceitos de componentização e
gerenciamento de estado que já conhecíamos do React, e permitiu que a equipe saísse do
projeto confortável com o desenvolvimento mobile.