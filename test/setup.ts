import { jest, afterEach } from '@jest/globals';

// Mock do Prisma
jest.mock('../src/database/prisma', () => ({
    prisma: {
        client: {
            findFirst: jest.fn(),
            findUnique: jest.fn(),
            findMany: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            count: jest.fn(),
        },
        favorite: {
            findFirst: jest.fn(),
            findUnique: jest.fn(),
            findMany: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
    },
}));

// Mock do fetch global
(global as any).fetch = jest.fn();

// Mock das variáveis de ambiente
process.env.JWT_SECRET = 'test-secret-key';
process.env.PRODUCTS_API_URL = 'https://api.example.com/products';
process.env.PRODUCTS_API_KEY = 'test-api-key';

// Limpar todos os mocks após cada teste
afterEach(() => {
    jest.clearAllMocks();
});
