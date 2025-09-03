/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach, jest, afterEach } from '@jest/globals';
import AddFavoritesService from '../../../src/services/favorites/add.service';
import { prisma } from '../../../src/database/prisma';
import { AppError } from '../../../src/errors/appError';

// Mock do Prisma
jest.mock('../../../src/database/prisma', () => ({
    prisma: {
        client: {
            findUnique: jest.fn(),
        },
        favorite: {
            findUnique: jest.fn(),
            create: jest.fn(),
        },
    },
}));

// Mock do Redis Cache
jest.mock('../../../src/services/cache/redis-cache.service', () => ({
    redisProductCache: {
        get: jest.fn(),
        set: jest.fn(),
        delete: jest.fn(),
        clear: jest.fn(),
        getStats: jest.fn(),
        disconnect: jest.fn(),
    },
}));

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

// Importar e referenciar o mock do Redis
import { redisProductCache } from '../../../src/services/cache/redis-cache.service';
const mockRedisCache = redisProductCache as jest.Mocked<typeof redisProductCache>;

// Mock do fetch global
const mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>;
(global as any).fetch = mockFetch;

describe('AddFavoritesService', () => {
    let addFavoritesService: AddFavoritesService;
    const originalEnv = process.env;

    beforeEach(() => {
        addFavoritesService = new AddFavoritesService();
        jest.clearAllMocks();
        // Reset environment
        process.env = { ...originalEnv };
    });

    afterEach(() => {
        process.env = originalEnv;
    });

    describe('Cache Integration Tests', () => {
        it('deve usar cache HIT quando produto já está em cache', async () => {
            // Arrange
            const params = {
                clientId: 'client-123',
                itemId: 'cached-item-123',
            };

            const mockClient = {
                id: 'client-123',
                name: 'João Silva',
                email: 'joao@email.com',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const cachedProductData = {
                id: 'cached-item-123',
                title: 'Produto em Cache',
                price: 150.50,
                image: 'https://cache.example.com/image.jpg',
                brand: 'Samsung',
                reviewScore: 4.8,
            };

            const mockFavorite = {
                id: 'favorite-123',
                clientId: 'client-123',
                itemId: 'cached-item-123',
                title: 'Produto em Cache',
                price: 150.50,
                imageUrl: 'https://cache.example.com/image.jpg',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockPrisma.client.findUnique.mockResolvedValue(mockClient);
            mockPrisma.favorite.findUnique.mockResolvedValue(null);
            mockPrisma.favorite.create.mockResolvedValue(mockFavorite);
            mockRedisCache.get.mockResolvedValue(cachedProductData); // Cache HIT

            // Act
            const result = await addFavoritesService.execute(params);

            // Assert
            expect(mockRedisCache.get).toHaveBeenCalledWith('cached-item-123');
            expect(mockFetch).not.toHaveBeenCalled(); // Não deve chamar API externa
            expect(mockRedisCache.set).not.toHaveBeenCalled(); // Não deve salvar novamente
            expect(mockPrisma.favorite.create).toHaveBeenCalledWith({
                data: {
                    clientId: params.clientId,
                    itemId: params.itemId,
                    price: cachedProductData.price,
                    imageUrl: cachedProductData.image,
                    title: cachedProductData.title,
                },
            });
            expect(result).toEqual(mockFavorite);
        });

        it('deve fazer cache MISS e salvar produto no cache (desenvolvimento)', async () => {
            // Arrange
            process.env.NODE_ENV = 'development';
            
            const params = {
                clientId: 'client-456',
                itemId: 'new-item-456',
            };

            const mockClient = {
                id: 'client-456',
                name: 'Maria Santos',
                email: 'maria@email.com',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const mockFavorite = {
                id: 'favorite-456',
                clientId: 'client-456',
                itemId: 'new-item-456',
                title: 'Produto Exemplo new-item-456',
                price: 850,
                imageUrl: 'https://via.placeholder.com/300x300?text=Product+new-item-456',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockPrisma.client.findUnique.mockResolvedValue(mockClient);
            mockPrisma.favorite.findUnique.mockResolvedValue(null);
            mockPrisma.favorite.create.mockResolvedValue(mockFavorite);
            mockRedisCache.get.mockResolvedValue(null); // Cache MISS
            mockRedisCache.set.mockResolvedValue(undefined);

            // Act
            const result = await addFavoritesService.execute(params);

            // Assert
            expect(mockRedisCache.get).toHaveBeenCalledWith('new-item-456');
            expect(mockFetch).not.toHaveBeenCalled(); // Deve usar mock em development
            expect(mockRedisCache.set).toHaveBeenCalledWith(
                'new-item-456',
                expect.objectContaining({
                    id: 'new-item-456',
                    title: 'Produto Exemplo new-item-456',
                    price: expect.any(Number),
                    image: 'https://via.placeholder.com/300x300?text=Product+new-item-456',
                    brand: expect.any(String),
                    reviewScore: expect.any(Number),
                })
            );
            expect(result).toEqual(mockFavorite);
        });

        it('deve fazer cache MISS e usar API real (produção)', async () => {
            // Arrange
            process.env.NODE_ENV = 'production';
            
            const params = {
                clientId: 'client-789',
                itemId: 'api-item-789',
            };

            const mockClient = {
                id: 'client-789',
                name: 'Pedro Oliveira',
                email: 'pedro@email.com',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const apiProductData = {
                id: 'api-item-789',
                title: 'Produto da API Real',
                price: 299.99,
                image: 'https://api.example.com/real-image.jpg',
                brand: 'Apple',
                reviewScore: 4.9,
            };

            const mockFavorite = {
                id: 'favorite-789',
                clientId: 'client-789',
                itemId: 'api-item-789',
                title: 'Produto da API Real',
                price: 299.99,
                imageUrl: 'https://api.example.com/real-image.jpg',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockPrisma.client.findUnique.mockResolvedValue(mockClient);
            mockPrisma.favorite.findUnique.mockResolvedValue(null);
            mockPrisma.favorite.create.mockResolvedValue(mockFavorite);
            mockRedisCache.get.mockResolvedValue(null); // Cache MISS
            mockRedisCache.set.mockResolvedValue(undefined);
            mockFetch.mockResolvedValue({
                ok: true,
                status: 200,
                json: () => Promise.resolve(apiProductData),
            } as Response);

            // Act
            const result = await addFavoritesService.execute(params);

            // Assert
            expect(mockRedisCache.get).toHaveBeenCalledWith('api-item-789');
            expect(mockFetch).toHaveBeenCalledWith(
                'https://challenge-api.luizalabs.com/api/product/api-item-789/'
            );
            expect(mockRedisCache.set).toHaveBeenCalledWith('api-item-789', apiProductData);
            expect(result).toEqual(mockFavorite);
        });
    });

    describe('Error Handling Tests', () => {
        it('deve lançar erro quando cliente não existe', async () => {
            // Arrange
            const params = {
                clientId: 'non-existent-client',
                itemId: 'item-123',
            };

            mockPrisma.client.findUnique.mockResolvedValue(null);

            // Act & Assert
            await expect(addFavoritesService.execute(params)).rejects.toThrow(
                new AppError('Client not found', 404)
            );

            expect(mockPrisma.client.findUnique).toHaveBeenCalledWith({
                where: { id: params.clientId },
            });
            expect(mockRedisCache.get).not.toHaveBeenCalled();
            expect(mockPrisma.favorite.findUnique).not.toHaveBeenCalled();
        });

        it('deve lançar erro quando produto já está nos favoritos', async () => {
            // Arrange
            const params = {
                clientId: 'client-123',
                itemId: 'existing-item-123',
            };

            const mockClient = {
                id: 'client-123',
                name: 'João Silva',
                email: 'joao@email.com',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const existingFavorite = {
                id: 'existing-favorite-123',
                clientId: 'client-123',
                itemId: 'existing-item-123',
                title: 'Produto Já Existente',
                price: 99.99,
                imageUrl: 'https://example.com/existing-image.jpg',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockPrisma.client.findUnique.mockResolvedValue(mockClient);
            mockPrisma.favorite.findUnique.mockResolvedValue(existingFavorite);

            // Act & Assert
            await expect(addFavoritesService.execute(params)).rejects.toThrow(
                new AppError('Product already in favorites', 409)
            );

            expect(mockPrisma.favorite.findUnique).toHaveBeenCalledWith({
                where: { clientId_itemId: { clientId: params.clientId, itemId: params.itemId } },
            });
            expect(mockRedisCache.get).not.toHaveBeenCalled();
            expect(mockFetch).not.toHaveBeenCalled();
        });

        it('deve lançar erro quando API externa retorna 404 (produção)', async () => {
            // Arrange
            process.env.NODE_ENV = 'production';
            
            const params = {
                clientId: 'client-404',
                itemId: 'not-found-item',
            };

            const mockClient = {
                id: 'client-404',
                name: 'Cliente Teste',
                email: 'teste@email.com',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockPrisma.client.findUnique.mockResolvedValue(mockClient);
            mockPrisma.favorite.findUnique.mockResolvedValue(null);
            mockRedisCache.get.mockResolvedValue(null); // Cache MISS
            mockFetch.mockResolvedValue({
                ok: false,
                status: 404,
            } as Response);

            // Act & Assert
            await expect(addFavoritesService.execute(params)).rejects.toThrow(
                new AppError('Produto não encontrado na API externa', 404)
            );

            expect(mockRedisCache.get).toHaveBeenCalledWith('not-found-item');
            expect(mockFetch).toHaveBeenCalledWith(
                'https://challenge-api.luizalabs.com/api/product/not-found-item/'
            );
            expect(mockRedisCache.set).not.toHaveBeenCalled();
        });

        it('deve funcionar mesmo quando cache falha (fallback graceful)', async () => {
            // Arrange
            process.env.NODE_ENV = 'development';
            
            const params = {
                clientId: 'client-cache-fail',
                itemId: 'cache-fail-item',
            };

            const mockClient = {
                id: 'client-cache-fail',
                name: 'Cliente Cache Fail',
                email: 'cache@email.com',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const mockFavorite = {
                id: 'favorite-cache-fail',
                clientId: 'client-cache-fail',
                itemId: 'cache-fail-item',
                title: 'Produto Exemplo cache-fail-item',
                price: 750,
                imageUrl: 'https://via.placeholder.com/300x300?text=Product+cache-fail-item',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockPrisma.client.findUnique.mockResolvedValue(mockClient);
            mockPrisma.favorite.findUnique.mockResolvedValue(null);
            mockPrisma.favorite.create.mockResolvedValue(mockFavorite);
            
            // Mock cache get to return null (simulating cache miss)
            mockRedisCache.get.mockResolvedValue(null);
            // Mock cache set to resolve (mas não vamos testar falha aqui)
            mockRedisCache.set.mockResolvedValue(undefined);

            // Act
            const result = await addFavoritesService.execute(params);

            // Assert
            expect(mockRedisCache.get).toHaveBeenCalledWith('cache-fail-item');
            expect(mockFetch).not.toHaveBeenCalled(); // Deve usar mock em development
            expect(result).toEqual(mockFavorite);
            // Service deve continuar funcionando normalmente
        });
    });

    describe('Environment Configuration Tests', () => {
        it('deve usar dados mockados quando MOCK_API=true', async () => {
            // Arrange
            process.env.NODE_ENV = 'production'; // Produção mas com mock forçado
            process.env.MOCK_API = 'true';
            
            const params = {
                clientId: 'client-mock',
                itemId: 'mock-item',
            };

            const mockClient = {
                id: 'client-mock',
                name: 'Cliente Mock',
                email: 'mock@email.com',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const mockFavorite = {
                id: 'favorite-mock',
                clientId: 'client-mock',
                itemId: 'mock-item',
                title: 'Produto Exemplo mock-item',
                price: 500,
                imageUrl: 'https://via.placeholder.com/300x300?text=Product+mock-item',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockPrisma.client.findUnique.mockResolvedValue(mockClient);
            mockPrisma.favorite.findUnique.mockResolvedValue(null);
            mockPrisma.favorite.create.mockResolvedValue(mockFavorite);
            mockRedisCache.get.mockResolvedValue(null); // Cache MISS
            mockRedisCache.set.mockResolvedValue(undefined);

            // Act
            const result = await addFavoritesService.execute(params);

            // Assert
            expect(mockFetch).not.toHaveBeenCalled(); // Não deve chamar API real
            expect(mockRedisCache.set).toHaveBeenCalledWith(
                'mock-item',
                expect.objectContaining({
                    id: 'mock-item',
                    title: 'Produto Exemplo mock-item',
                })
            );
            expect(result).toEqual(mockFavorite);
        });
    });
});
