# 🧪 Testes Unitários - FavList API

Este diretório contém todos os testes unitários da aplicação FavList API.

## 📁 Estrutura dos Testes

```
teste/
├── setup.ts                    # Configuração global dos testes
├── __mocks__/                  # Mocks globais
│   └── prisma.ts              # Mock do Prisma
├── helpers/                    # Utilitários de teste
│   └── test-data.ts           # Dados de teste reutilizáveis
└── services/                   # Testes dos services
    ├── clients/               # Testes dos services de clientes
    │   ├── create.service.test.ts
    │   ├── update.service.test.ts
    │   ├── delete.service.test.ts
    │   ├── get.service.test.ts
    │   └── list.service.test.ts
    └── favorites/             # Testes dos services de favoritos
        ├── add.service.test.ts
        ├── delete.service.test.ts
        └── get.service.test.ts
```

## 🚀 Como Executar os Testes

### Executar todos os testes
```bash
npm test
```

### Executar testes em modo watch
```bash
npm run test:watch
```

### Executar testes com coverage
```bash
npm run test:coverage
```

### Executar testes específicos
```bash
# Testes de um service específico
npm test -- create.service.test.ts

# Testes de uma pasta específica
npm test -- services/clients/
```

## 📊 Cobertura de Testes

Os testes cobrem:

### ✅ Services de Clientes
- **CreateClientService**: Criação de clientes, validação de email único
- **UpdateClientService**: Atualização de clientes, validação de existência
- **DeleteClientService**: Exclusão de clientes
- **GetClientService**: Busca por ID ou email, inclusão de favoritos
- **ListClientService**: Listagem com paginação e busca

### ✅ Services de Favoritos
- **AddFavoritesService**: Adição de favoritos, validação de cliente e produto
- **DeleteFavoritesService**: Remoção de favoritos
- **GetFavoritesService**: Busca de favoritos (todos ou específico)

## 🔧 Configuração dos Testes

### Jest Configuration
- **Preset**: TypeScript com ESM
- **Environment**: Node.js
- **Timeout**: 10 segundos
- **Coverage**: Relatórios em texto, LCOV e HTML

### Mocks Configurados
- **Prisma Client**: Mock completo do banco de dados
- **Fetch API**: Mock para chamadas HTTP externas
- **Variáveis de Ambiente**: Configuração para testes

### Setup Global
- Limpeza automática de mocks após cada teste
- Configuração de variáveis de ambiente de teste
- Mock do Prisma global

## 📝 Padrões de Teste

### Estrutura dos Testes
```typescript
describe('ServiceName', () => {
    let service: ServiceName;

    beforeEach(() => {
        service = new ServiceName();
        jest.clearAllMocks();
    });

    it('deve fazer algo com sucesso', async () => {
        // Arrange
        const mockData = { ... };
        mockPrisma.method.mockResolvedValue(mockData);

        // Act
        const result = await service.execute(params);

        // Assert
        expect(result).toEqual(expectedResult);
        expect(mockPrisma.method).toHaveBeenCalledWith(expectedParams);
    });
});
```

### Casos de Teste Cobertos
- ✅ **Cenários de sucesso**: Operações que funcionam corretamente
- ✅ **Cenários de erro**: Validações e tratamento de erros
- ✅ **Cenários edge**: Casos limite e dados inválidos
- ✅ **Mocks**: Verificação de chamadas e parâmetros

## 🎯 Objetivos dos Testes

1. **Garantir Qualidade**: Validar que os services funcionam conforme esperado
2. **Prevenir Regressões**: Detectar mudanças que quebram funcionalidades
3. **Documentar Comportamento**: Os testes servem como documentação viva
4. **Facilitar Refatoração**: Permitir mudanças seguras no código

## 📈 Métricas de Qualidade

- **Cobertura de Código**: > 90%
- **Casos de Teste**: Cenários positivos e negativos
- **Mocks**: Isolamento de dependências externas
- **Performance**: Testes executam em < 5 segundos

## 🔍 Debugging

### Executar teste específico com debug
```bash
npm test -- --verbose create.service.test.ts
```

### Verificar mocks
```typescript
console.log(mockPrisma.client.create.mock.calls);
```

### Logs detalhados
```bash
npm test -- --verbose --no-coverage
```
