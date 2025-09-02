# 📦 Instalação e Configuração dos Testes

## Pré-requisitos

- Node.js 18+
- npm ou yarn
- Projeto FavList API configurado

## 🚀 Instalação Rápida

### 1. Instalar dependências de teste
```bash
npm install --save-dev @types/jest ts-jest
```

### 2. Verificar configuração
```bash
# Verificar se jest.config.js existe
ls -la jest.config.js

# Verificar se pasta de testes existe
ls -la test/
```

### 3. Executar testes
```bash
npm test
```

## 📋 Dependências Adicionadas

### DevDependencies
```json
{
  "@types/jest": "^29.5.12",
  "ts-jest": "^29.2.5"
}
```

### Scripts Adicionados
```json
{
  "test": "jest",
  "test:watch": "jest --watch", 
  "test:coverage": "jest --coverage",
  "test:ci": "jest --ci --coverage --watchAll=false"
}
```

## 🔧 Configuração Detalhada

### Jest Configuration (jest.config.js)
```javascript
export default {
    preset: 'ts-jest/presets/default-esm',
    extensionsToTreatAsEsm: ['.ts'],
    testEnvironment: 'node',
    roots: ['<rootDir>/teste'],
    testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
    transform: {
        '^.+\\.ts$': ['ts-jest', {
            useESM: true,
        }],
    },
    moduleNameMapping: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    collectCoverageFrom: [
        'src/**/*.ts',
        '!src/**/*.d.ts',
        '!src/main.ts',
    ],
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'html'],
    setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
    testTimeout: 10000,
};
```

## 🧪 Estrutura de Testes Criada

```
test/
├── setup.ts                           # Configuração global
├── __mocks__/
│   └── prisma.ts                      # Mock do Prisma
├── helpers/
│   └── test-data.ts                   # Dados de teste
├── services/
│   ├── clients/                       # 5 arquivos de teste
│   │   ├── create.service.test.ts     # 3 testes
│   │   ├── update.service.test.ts     # 3 testes
│   │   ├── delete.service.test.ts     # 3 testes
│   │   ├── get.service.test.ts        # 4 testes
│   │   └── list.service.test.ts       # 5 testes
│   └── favorites/                     # 3 arquivos de teste
│       ├── add.service.test.ts        # 6 testes
│       ├── delete.service.test.ts     # 5 testes
│       └── get.service.test.ts        # 6 testes
├── README.md                          # Documentação
├── example-run.md                     # Exemplos de execução
└── INSTALL.md                         # Este arquivo
```

## ✅ Verificação da Instalação

### 1. Teste básico
```bash
npm test -- --version
```

### 2. Executar um teste específico
```bash
npm test -- create.service.test.ts
```

### 3. Verificar coverage
```bash
npm run test:coverage
```

## 🐛 Troubleshooting

### Erro: "Cannot find module '@jest/globals'"
```bash
npm install --save-dev @jest/globals
```

### Erro: "Jest configuration not found"
```bash
# Verificar se jest.config.js está na raiz do projeto
pwd
ls -la jest.config.js
```

### Erro: "TypeScript compilation"
```bash
# Verificar se ts-jest está instalado
npm list ts-jest

# Reinstalar se necessário
npm install --save-dev ts-jest@latest
```

### Erro: "ESM modules"
```bash
# Verificar se package.json tem "type": "module"
cat package.json | grep '"type"'
```

## 📊 Resultados Esperados

### Execução Completa
```
Test Suites: 8 passed, 8 total
Tests:       35 passed, 35 total
Snapshots:   0 total
Time:        ~2-3s
```

### Coverage Esperado
```
----------|---------|----------|---------|---------|-------------------
File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
----------|---------|----------|---------|---------|-------------------
All files |   95+   |   90+    |   100   |   95+   |
----------|---------|----------|---------|---------|-------------------
```

## 🎯 Próximos Passos

1. **Executar testes**: `npm test`
2. **Verificar coverage**: `npm run test:coverage`
3. **Integrar ao CI/CD**: Usar `npm run test:ci`
4. **Adicionar mais testes**: Seguir padrões estabelecidos

## 📚 Documentação Adicional

- [README dos Testes](README.md) - Documentação completa
- [Exemplos de Execução](example-run.md) - Como executar
- [Jest Documentation](https://jestjs.io/docs/getting-started) - Documentação oficial
