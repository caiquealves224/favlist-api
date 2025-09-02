import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import GetFavoritesService from '../../../src/services/favorites/get.service';
import { prisma } from '../../../src/database/prisma';
import { AppError } from '../../../src/errors/appError';

// Mock do Prisma
jest.mock('../../../src/database/prisma', () => ({
    prisma: {
        client: {
            findUnique: jest.fn(),
        },
        favorite: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
        },
    },
}));

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe('GetFavoritesService', () => {
    let getFavoritesService: GetFavoritesService;

    beforeEach(() => {
        getFavoritesService = new GetFavoritesService();
        jest.clearAllMocks();
    });

    it('deve buscar todos os favoritos de um cliente', async () => {
        // Arrange
        const params = {
            clientId: '1',
        };

        const mockClient = {
            id: '1',
            name: 'João Silva',
            email: 'joao@email.com',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const mockFavorites = [
            {
                id: '1',
                clientId: '1',
                itemId: 'item-123',
                title: 'Produto 1',
                price: 99.99,
                imageUrl: 'https://example.com/image1.jpg',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                id: '2',
                clientId: '1',
                itemId: 'item-456',
                title: 'Produto 2',
                price: 149.99,
                imageUrl: 'https://example.com/image2.jpg',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ];

        mockPrisma.client.findUnique.mockResolvedValue(mockClient);
        mockPrisma.favorite.findMany.mockResolvedValue(mockFavorites);

        // Act
        const result = await getFavoritesService.execute(params);

        // Assert
        expect(mockPrisma.client.findUnique).toHaveBeenCalledWith({
            where: { id: params.clientId },
        });
        expect(mockPrisma.favorite.findMany).toHaveBeenCalledWith({
            where: { clientId: params.clientId },
        });
        expect(result).toEqual(mockFavorites);
        expect(Array.isArray(result)).toBe(true);
        expect(result).toHaveLength(2);
    });

    it('deve buscar um favorito específico por itemId', async () => {
        // Arrange
        const params = {
            clientId: '1',
            itemId: 'item-123',
        };

        const mockClient = {
            id: '1',
            name: 'João Silva',
            email: 'joao@email.com',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const mockFavorite = {
            id: '1',
            clientId: '1',
            itemId: 'item-123',
            title: 'Produto Teste',
            price: 99.99,
            imageUrl: 'https://example.com/image.jpg',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        mockPrisma.client.findUnique.mockResolvedValue(mockClient);
        mockPrisma.favorite.findUnique.mockResolvedValue(mockFavorite);

        // Act
        const result = await getFavoritesService.execute(params);

        // Assert
        expect(mockPrisma.client.findUnique).toHaveBeenCalledWith({
            where: { id: params.clientId },
        });
        expect(mockPrisma.favorite.findUnique).toHaveBeenCalledWith({
            where: {
                clientId_itemId: {
                    clientId: params.clientId,
                    itemId: params.itemId,
                },
            },
        });
        expect(result).toEqual(mockFavorite);
        expect(Array.isArray(result)).toBe(false);
    });

    it('deve lançar erro quando cliente não existe', async () => {
        // Arrange
        const params = {
            clientId: '999',
        };

        mockPrisma.client.findUnique.mockResolvedValue(null);

        // Act & Assert
        await expect(getFavoritesService.execute(params)).rejects.toThrow(
            new AppError('Client not found', 404)
        );

        expect(mockPrisma.client.findUnique).toHaveBeenCalledWith({
            where: { id: params.clientId },
        });
        expect(mockPrisma.favorite.findMany).not.toHaveBeenCalled();
        expect(mockPrisma.favorite.findUnique).not.toHaveBeenCalled();
    });

    it('deve lançar erro quando favorito específico não é encontrado', async () => {
        // Arrange
        const params = {
            clientId: '1',
            itemId: 'item-999',
        };

        const mockClient = {
            id: '1',
            name: 'João Silva',
            email: 'joao@email.com',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        mockPrisma.client.findUnique.mockResolvedValue(mockClient);
        mockPrisma.favorite.findUnique.mockResolvedValue(null);

        // Act & Assert
        await expect(getFavoritesService.execute(params)).rejects.toThrow(
            new AppError('Product not found in favorites', 404)
        );

        expect(mockPrisma.favorite.findUnique).toHaveBeenCalledWith({
            where: {
                clientId_itemId: {
                    clientId: params.clientId,
                    itemId: params.itemId,
                },
            },
        });
    });

    it('deve retornar lista vazia quando cliente não tem favoritos', async () => {
        // Arrange
        const params = {
            clientId: '1',
        };

        const mockClient = {
            id: '1',
            name: 'João Silva',
            email: 'joao@email.com',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        mockPrisma.client.findUnique.mockResolvedValue(mockClient);
        mockPrisma.favorite.findMany.mockResolvedValue([]);

        // Act
        const result = await getFavoritesService.execute(params);

        // Assert
        expect(result).toEqual([]);
        expect(Array.isArray(result)).toBe(true);
        expect(result).toHaveLength(0);
    });

    it('deve verificar se cliente existe antes de buscar favoritos', async () => {
        // Arrange
        const params = {
            clientId: '1',
        };

        const mockClient = {
            id: '1',
            name: 'João Silva',
            email: 'joao@email.com',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const mockFavorites = [
            {
                id: '1',
                clientId: '1',
                itemId: 'item-123',
                title: 'Produto Teste',
                price: 99.99,
                imageUrl: 'https://example.com/image.jpg',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ];

        mockPrisma.client.findUnique.mockResolvedValue(mockClient);
        mockPrisma.favorite.findMany.mockResolvedValue(mockFavorites);

        // Act
        await getFavoritesService.execute(params);

        // Assert
        expect(mockPrisma.client.findUnique).toHaveBeenCalledTimes(1);
        expect(mockPrisma.client.findUnique).toHaveBeenCalledWith({
            where: { id: params.clientId },
        });
    });
});
