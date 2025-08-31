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
- **Linter:** ESLint
- **Formatter:** Prettier
- **Package Manager:** npm

## 📁 Estrutura do Projeto

```
src/
├── controllers/          # Controllers da aplicação
│   ├── clientes/        # Controllers de clientes
│   │   ├── create-client.controller.ts
│   │   ├── update-client.controller.ts
│   │   ├── delete-client.controller.ts
│   │   ├── get-clients.controller.ts
│   │   └── index.ts
│   └── favorites/       # Controllers de favoritos
|       └──
|       └──
|       └──
├── routes/              # Definição das rotas
│   ├── clients.route.ts
│   ├── favorites.route.ts
│   └── index.ts
├── services/            # Lógica de negócio
├── models/              # Modelos de dados
├── middlewares/         # Middlewares customizados
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

## 🌐 Endpoints da API

### Clientes

| Método   | Endpoint           | Descrição               |
| -------- | ------------------ | ----------------------- |
| `GET`    | `/api/clients`     | Lista todos os clientes |
| `POST`   | `/api/clients`     | Cria um novo cliente    |
| `PATCH`  | `/api/clients/:id` | Atualiza um cliente     |
| `DELETE` | `/api/clients/:id` | Remove um cliente       |

### Favoritos

| Método | Endpoint         | Descrição                 |
| -------- | ---------------- | ------------------------- |
| `GET`    | `/api/favorites` | Lista todos os favoritos  |
| `POST`   | `/api/favorites` | Adiciona um novo favorito |
| `DELETE` | `/api/favorites` | Remove favorito           |

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

## 📝 Exemplo de Uso

### Criar um Cliente

```typescript
POST /api/clients
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@email.com",
}
```

### Resposta

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

## 🧪 Testes

```bash
# Executar testes
npm test

# Executar testes em modo watch
npm run test:watch

# Executar testes com coverage
npm run test:coverage
```

## 📚 Padrões de Código

### Nomenclatura

- **Controllers:** `CreateClientController`, `UpdateClientController`
- **Routes:** `clients.route.ts`, `favorites.route.ts`
- **Services:** `client.service.ts`, `favorite.service.ts`

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

**Caique Alves**

- GitHub: [@caiquealves224](https://github.com/caiquealves224)
- Email: caiquealves224@gmail.com
