# 🎨 Playgram

API RESTful da aplicação **Playgram**. Este Back-end é integrado com o [playgram](https://github.com/igorfrag/playgram).

## 🚀 Tecnologias Utilizadas

-   [Node.js](https://nodejs.org/)
-   [Express](https://expressjs.com/)
-   [TypeScript](https://www.typescriptlang.org/)
-   [Prisma ORM](https://www.prisma.io/)
-   [SQLite](https://www.sqlite.org/)
-   [JWT (jsonwebtoken)](https://github.com/auth0/node-jsonwebtoken)
-   [bcryptjs](https://github.com/dcodeIO/bcrypt.js)

## 📦 Instalação

```bash
# Clone o repositório
git clone https://github.com/igorfrag/playgram-api
cd playgram-api

# Instale as dependências
npm install

# Configure o banco de dados
npx prisma migrate dev --name init
npx prisma generate

# Rode o projeto
npm run dev
```

## 🔐 Variáveis de Ambiente .env

```
DATABASE_URL="file:./dev.db"
JWT_SECRET=jwtsecret
JWT_EXPIRES_IN="7d"
PORT="3000"
UPLOAD_BASE_PATH="uploads"
UPLOAD_BASE_URL="/uploads"
FRONTEND_URL=url
```

## 🔐 Autenticação

A autenticação é baseada em JWT:
Geração no login/registro
Verificação via middleware (authMiddleware)

## 🗂️ Estrutura de Pastas

```
playgram-api/
│
├── src/
│   ├── controllers/      # Lógica de entrada das rotas
│   ├── services/         # Lógica de negócio
│   ├── routes/           # Definição das rotas da API
│   ├── middlewares/      # Middlewares (auth, errors)
│   ├── prisma/           # Cliente Prisma
│   ├── utils/            # Funções auxiliares
│   ├── types/            # Tipagens personalizadas
│   └── server.ts         # Ponto de entrada da aplicação
├── swagger.yaml          # Documentação Swagger
├── .env                  # Variáveis de ambiente
└── prisma/schema.prisma  # Schema do banco de dados
```

## ✅ Funcionalidades

-   Documentação Swagger em /api-docs
