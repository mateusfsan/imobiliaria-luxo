# Residências — Plataforma Imobiliária de Alto Padrão

> Curadoria digital de residências extraordinárias. Uma plataforma inspirada na Sotheby's Realty e na Airbnb Luxe, construída do zero com foco em **minimalismo extremo**, **tipografia editorial** e **experiência silenciosa**.

![status](https://img.shields.io/badge/status-em%20desenvolvimento-C6A85B?style=flat-square)
![licença](https://img.shields.io/badge/licença-pessoal-111113?style=flat-square)

---

## Sumário

- [Visão do produto](#visão-do-produto)
- [Stack tecnológica](#stack-tecnológica)
- [Arquitetura](#arquitetura)
- [Design system](#design-system)
- [Funcionalidades](#funcionalidades)
- [Como executar localmente](#como-executar-localmente)
- [API](#api)
- [Scripts utilitários](#scripts-utilitários)
- [Roadmap](#roadmap)
- [Autor](#autor)

---

## Visão do produto

Esta não é uma plataforma genérica de imóveis. É uma **curadoria** — cada residência é selecionada manualmente por critérios de arquitetura, localização, acabamentos e história. O posicionamento e o design refletem isso:

- Tipografia serif domina o layout
- Espaço em branco como elemento principal
- Imagens são protagonistas, texto é coadjuvante
- Interações em câmera lenta (transições de 700–1400ms)
- Paleta restrita: preto profundo, branco osso, um único ouro de detalhe

---

## Stack tecnológica

### Frontend

| Camada | Tecnologia |
|---|---|
| Build | Vite 5 |
| UI | React 18 |
| Estilo | Tailwind CSS 3 |
| Animação | Framer Motion 11 |
| Estado | Zustand 5 (com persist) |
| Formulários | React Hook Form + Zod |
| Rotas | React Router DOM 6 |
| HTTP | Axios |
| SEO | React Helmet Async |

### Backend

| Camada | Tecnologia |
|---|---|
| Runtime | Node.js (ESM) |
| Servidor | Express 4 |
| Banco de dados | MongoDB Atlas + Mongoose |
| Autenticação | JWT + bcryptjs |
| Validação | Zod |
| Upload | Multer 2 + Cloudinary |

---

## Arquitetura

Monorepo com responsabilidades isoladas em duas pastas:

```
imobiliaria/
├── backend/
│   ├── server.js                  → ponto de entrada
│   ├── scripts/                   → seed, criar admin, remover usuário
│   └── src/
│       ├── config/                → env, conexão Mongo, Cloudinary
│       ├── controllers/           → camada fina, só orquestra
│       ├── services/              → regra de negócio
│       ├── models/                → schemas Mongoose
│       ├── routes/                → definição de endpoints
│       └── middlewares/           → auth, upload, validação, erros
│
└── frontend/
    ├── index.html
    └── src/
        ├── components/            → layout (navbar/footer) + property
        ├── pages/                 → Home, Properties, PropertyDetails, Auth
        ├── hooks/                 → useProperties, useProperty
        ├── store/                 → Zustand (auth)
        ├── services/              → axios + chamadas à API
        ├── utils/                 → formatação BRL/m²
        └── styles/                → globals.css + design system
```

---

## Design system

### Paleta

| Token | Valor | Uso |
|---|---|---|
| `bg` | `#0B0B0C` | Fundo principal |
| `surface` | `#111113` | Drawers, modais |
| `card` | `#18181B` | Skeletons, placeholders |
| `gold` | `#C6A85B` | Destaques, preços, CTAs |
| `gold-hover` | `#B8963F` | Estado hover do dourado |
| `ink.primary` | `#F4F4F5` | Texto principal |
| `ink.secondary` | `#A1A1AA` | Texto auxiliar |
| `border-subtle` | `rgba(255,255,255,0.08)` | Divisores |

### Tipografia

- **Títulos**: Playfair Display (light/regular — bold é proibido)
- **Texto**: Inter
- Escala fluida no hero (clamp 2.5rem → 4rem)
- Labels em uppercase com tracking 0.1em

### Componentes utilitários (`globals.css`)

- `.btn-gold` — borda dourada, fundo transparente, inverte no hover
- `.input-line` — apenas border-bottom, sem caixa
- `.label-eyebrow` — labels uppercase com tracking generoso
- `.container-luxe` — wrapper 1200px

---

## Funcionalidades

### ✓ Autenticação completa
Registro e login com JWT, hash bcrypt, sessão persistida em localStorage, redirect inteligente após login.

### ✓ Catálogo de imóveis
Listagem paginada com filtros por **cidade**, **estado**, **quartos mínimos**, **faixa de preço** e **ordenação**. Filtros vivem na URL — links são compartilháveis.

### ✓ Página de detalhe editorial
Galeria com layout 8/4 columns, lightbox fullscreen com navegação por teclado (← → Esc), sidebar sticky com preço destacado.

### ✓ Upload de imagens via Cloudinary
Admin envia múltiplas fotos (até 20 por requisição, 8MB cada), conversão automática para WebP com `quality: auto:good`.

### ✓ Painel de filtros não-invasivo
Drawer lateral com backdrop blur — abre apenas quando o usuário pede, nunca polui a tela principal.

### ✓ Microinterações editoriais
Animações Framer Motion com curva `cubic-bezier(0.22, 1, 0.36, 1)` em 700–1400ms. Stagger de 50ms entre cards. Skeletons preservam o layout durante o load.

### ✓ SEO básico
Meta tags por página + Open Graph dinâmico no detalhe do imóvel (título, descrição e imagem de capa).

---

## Como executar localmente

### Pré-requisitos
- Node.js 18 ou superior
- Conta no [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free tier serve)
- Conta no [Cloudinary](https://cloudinary.com) (free tier serve)

### 1. Clonar o repositório
```bash
git clone <url-do-repo>
cd imobiliaria
```

### 2. Configurar o backend
```bash
cd backend
cp .env.example .env
# editar .env com suas credenciais (MONGO_URI, JWT_SECRET, CLOUDINARY_*)
npm install
npm run dev          # sobe em http://localhost:4000
```

### 3. Configurar o frontend (em outro terminal)
```bash
cd frontend
npm install
npm run dev          # abre em http://localhost:5173
```

O Vite proxia automaticamente `/api/*` para `http://localhost:4000`, então o frontend e o backend rodam em portas separadas sem precisar de CORS especial em desenvolvimento.

### 4. Popular com dados de exemplo (opcional)
```bash
cd backend
npm run seed          # insere 8 imóveis de alto padrão de exemplo
```

### 5. Criar um admin
Cadastre-se normalmente pela tela `/cadastro` e depois rode:
```bash
cd backend
npm run make-admin seu-email@exemplo.com
```

---

## API

Base URL: `http://localhost:4000/api`

### Auth
| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/auth/register` | Cria usuário. Body: `{ name, email, password }` |
| `POST` | `/auth/login` | Login. Retorna `{ user, token }` |

### Properties — público
| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/properties` | Lista paginada com filtros via query |
| `GET` | `/properties/:id` | Detalhe de um imóvel |

**Query params suportados:** `city`, `state`, `bedrooms`, `priceMin`, `priceMax`, `highlight`, `sort` (`price_asc` ou `price_desc`), `page`, `limit`.

### Properties — admin (requer JWT com `role: admin`)
| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/properties` | Cria imóvel |
| `PUT` | `/properties/:id` | Atualiza imóvel |
| `DELETE` | `/properties/:id` | Remove imóvel (apaga imagens do Cloudinary) |
| `POST` | `/properties/:id/images` | Upload de imagens (multipart, campo `images`) |
| `DELETE` | `/properties/:id/images` | Remove imagem específica. Body: `{ publicId }` |

### Padrões de erro
Todos os erros retornam JSON consistente:
```json
{ "error": { "code": "VALIDATION_ERROR", "message": "Dados invalidos", "details": { ... } } }
```

---

## Scripts utilitários

Todos no diretório `backend/`:

```bash
npm run dev                              # backend em modo watch (nodemon)
npm start                                # backend em modo produção
npm run seed                             # popula 8 imóveis de exemplo (--wipe limpa antes)
npm run make-admin <email>               # promove usuário a admin
npm run delete-user <email>              # remove usuário do banco
```

---

## Roadmap

### Concluído
- [x] **Fase 1** — Setup do monorepo, autenticação JWT, design system
- [x] **Fase 2** — CRUD de imóveis com upload Cloudinary, seed
- [x] **Fase 3** — UI premium (Home, Listagem, Detalhe) com filtros e galeria

### Em andamento / próximas fases
- [ ] **Fase 4** — Favoritos + agendamento de visitas
- [ ] **Fase 5** — Dashboard administrativo (CRUD visual)
- [ ] **Fase 6** — Polimento final: lazy loading otimizado, Lighthouse 90+, acessibilidade

---

## Autor

**Mateus Fernandes** ([@mateusfsan](https://github.com/mateusfsan))

Projeto pessoal de portfólio — construído com curadoria e atenção a detalhes em parceria com Claude (Anthropic).
