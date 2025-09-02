# 🚀 FavList API

Uma API REST moderna e robusta para gerenciamento de listas de favoritos, construída com TypeScript, Node.js e Express.

## ✨ Características

- **🔄 TypeScript** - Código tipado e robusto
- **🏗️ Arquitetura MVC** - Controllers, Routes e Services organizados
- **🔧 ESLint + Prettier** - Qualidade de código e formatação automática
- **📚 Estrutura modular** - Fácil manutenção e escalabilidade
- **🚦 Validações** - Validação de dados e tratamento de erros
- **📖 Documentação clara** - Código bem documentado e legível

## 🛠️ Tecnologias

- **Runtime:** Node.js
- **Framework:** Express.js
- **Linguagem:** TypeScript
- **Autenticação:** JWT (jsonwebtoken)
- **Banco de Dados:** PostgreSQL + Prisma ORM
- **Validação:** Zod
- **Linter:** ESLint
- **Formatter:** Prettier
- **Package Manager:** npm

## 📁 Estrutura do Projeto

```
src/
├── controllers/          # Controllers da aplicação
│   ├── auth/            # Controllers de autenticação
│   │   └── login.controller.ts
│   ├── clientes/        # Controllers de clientes
│   │   ├── create-client.controller.ts
│   │   ├── update-client.controller.ts
│   │   ├── delete-client.controller.ts
│   │   ├── get-clients.controller.ts
│   │   └── index.ts
│   └── favoritos/       # Controllers de favoritos
│       ├── add.controller.ts
│       ├── delete.controller.ts
│       └── get.controller.ts
├── routes/              # Definição das rotas
│   ├── auth.route.ts    # Rotas de autenticação
│   ├── clients.route.ts
│   ├── clients.favorites.route.ts
│   └── index.ts
├── services/            # Lógica de negócio
│   ├── clients/         # Services de clientes
│   └── favorites/       # Services de favoritos
├── middlewares/         # Middlewares customizados
│   ├── auth/            # Middlewares de autenticação
│   │   ├── authenticate.ts
│   │   └── authorize.ts
│   ├── error-handler.ts
│   └── validate-request.ts
├── schemas/             # Schemas de validação
│   ├── client.schema.ts
│   └── favorites.schema.ts
├── database/            # Configuração do banco
│   └── prisma.ts
└── main.ts             # Ponto de entrada da aplicação
```

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+

### Instalação

1. **Clone o repositório**

```bash
git clone https://github.com/caiquealves224/favlist-api.git
cd favlist-api
```

2. **Instale as dependências**

```bash
npm install
```

3. **Configure as variáveis de ambiente**

```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

**Variáveis obrigatórias:**
```env
# JWT Secret para assinatura dos tokens
JWT_SECRET=sua_chave_secreta_super_segura_aqui

# Configurações do banco de dados
DATABASE_URL="postgresql://usuario:senha@localhost:5432/favlist_db"
```

4. **Execute o projeto**

```bash
# Desenvolvimento
npm run dev

# Produção
npm run build
npm start
```

## 📋 Scripts Disponíveis

| Comando                | Descrição                                      |
| ---------------------- | ---------------------------------------------- |
| `npm run dev`          | Executa em modo desenvolvimento com hot-reload |
| `npm run build`        | Compila o TypeScript para JavaScript           |
| `npm start`            | Executa a versão compilada                     |
| `npm run lint`         | Executa o ESLint para verificar código         |
| `npm run lint:fix`     | Corrige automaticamente problemas do ESLint    |
| `npm run format`       | Formata o código com Prettier                  |
| `npm run format:check` | Verifica se o código está formatado            |

## 🔐 Autenticação e Autorização

A API utiliza **JWT (JSON Web Tokens)** para autenticação e autorização baseada em roles.

### Sistema de Autenticação

- **Tipo:** JWT Bearer Token
- **Algoritmo:** HS256
- **Header:** `Authorization: Bearer <token>`

### Usuário Padrão (Desenvolvimento)

```json
{
  "username": "admin",
  "password": "admin",
  "role": "admin"
}
```

### Fluxo de Autenticação

1. **Login:** `POST /api/auth`
2. **Receber Token:** JWT contendo `id` e `role`
3. **Usar Token:** Incluir no header `Authorization: Bearer <token>`

### Níveis de Acesso

- **🔓 Público:** Health check, Login
- **🔒 Autenticado:** Todas as rotas de clientes e favoritos
- **👑 Admin:** Operações de criação (POST) em clientes

## 🌐 Endpoints da API

### Autenticação

| Método | Endpoint     | Descrição                    | Autenticação |
| ------ | ------------ | ---------------------------- | ------------ |
| `POST` | `/api/auth`  | Realiza login e retorna JWT  | ❌ Pública   |

### Clientes

| Método   | Endpoint           | Descrição               | Autenticação | Autorização |
| -------- | ------------------ | ----------------------- | ------------ | ----------- |
| `GET`    | `/api/clients`     | Lista todos os clientes | ✅ Obrigatória | - |
| `POST`   | `/api/clients`     | Cria um novo cliente    | ✅ Obrigatória | 👑 Admin |
| `PATCH`  | `/api/clients/:id` | Atualiza um cliente     | ✅ Obrigatória | - |
| `DELETE` | `/api/clients/:id` | Remove um cliente       | ✅ Obrigatória | - |

### Favoritos

| Método   | Endpoint         | Descrição                 | Autenticação |
| -------- | ---------------- | ------------------------- | ------------ |
| `GET`    | `/api/favorites` | Lista todos os favoritos  | ✅ Obrigatória |
| `POST`   | `/api/favorites` | Adiciona um novo favorito | ✅ Obrigatória |
| `DELETE` | `/api/favorites` | Remove favorito           | ✅ Obrigatória |

## 🔧 Configuração

### ESLint

O projeto usa ESLint com regras rigorosas para TypeScript:

- Verificação de tipos explícitos
- Proibição de `any` implícito
- Regras de boas práticas
- Integração com Prettier

### Prettier

Configuração de formatação automática:

- Aspas simples
- Indentação de 4 espaços
- Largura máxima de 80 caracteres
- Ponto e vírgula obrigatório

## 📝 Exemplos de Uso

### 1. Realizar Login

```bash
POST /api/auth
Content-Type: application/json

{
  "username": "admin",
  "password": "admin"
}
```

**Resposta:**
```json
{
  "message": "Login bem-sucedido",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "role": "admin"
  }
}
```

### 2. Criar um Cliente (Requer Autenticação + Admin)

```bash
POST /api/clients
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "name": "João Silva",
  "email": "joao@email.com"
}
```

**Resposta:**
```json
{
  "success": true,
  "message": "Cliente criado com sucesso",
  "data": {
    "id": "temp-id",
    "name": "João Silva",
    "email": "joao@email.com",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 3. Listar Clientes (Requer Autenticação)

```bash
GET /api/clients
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Erros de Autenticação

**Token ausente:**
```json
{
  "message": "No token"
}
```

**Token inválido:**
```json
{
  "message": "Invalid token"
}
```

**Credenciais inválidas:**
```json
{
  "message": "Credenciais inválidas"
}
```

**Permissão insuficiente:**
```json
{
  "message": "Forbidden: insufficient permissions"
}
```

## 🧪 Testes

```bash
# Executar testes
npm test

# Executar testes em modo watch
npm run test:watch

# Executar testes com coverage
npm run test:coverage
```

## 🔒 Segurança

### Boas Práticas Implementadas

- **JWT Tokens:** Autenticação stateless com tokens seguros
- **Middleware de Autenticação:** Verificação automática de tokens
- **Autorização por Roles:** Controle de acesso baseado em permissões
- **Validação de Dados:** Schemas Zod para validação de entrada
- **Tratamento de Erros:** Middleware centralizado para erros

### Configuração de Segurança

```env
# Use uma chave secreta forte em produção
JWT_SECRET=sua_chave_secreta_super_segura_aqui_min_32_caracteres
```

## 📚 Padrões de Código

### Nomenclatura

- **Controllers:** `CreateClientController`, `UpdateClientController`
- **Routes:** `clients.route.ts`, `favorites.route.ts`
- **Services:** `client.service.ts`, `favorite.service.ts`
- **Middlewares:** `authenticate.ts`, `authorize.ts`

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

**Caique Alves**

- GitHub: [@caiquealves224](https://github.com/caiquealves224)
- Email: caiquealves224@gmail.com
