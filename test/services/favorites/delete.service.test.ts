import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import DeleteFavoritesService from '../../../src/services/favorites/delete.service';
import { prisma } from '../../../src/database/prisma';
import { AppError } from '../../../src/errors/appError';

// Mock do Prisma
jest.mock('../../../src/database/prisma', () => ({
    prisma: {
        client: {
            findUnique: jest.fn(),
        },
        favorite: {
            delete: jest.fn(),
        },
    },
}));

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe('DeleteFavoritesService', () => {
    let deleteFavoritesService: DeleteFavoritesService;

    beforeEach(() => {
        deleteFavoritesService = new DeleteFavoritesService();
        jest.clearAllMocks();
    });

    it('deve deletar um favorito com sucesso', async () => {
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

        const deletedFavorite = {
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
        mockPrisma.favorite.delete.mockResolvedValue(deletedFavorite);

        // Act
        const result = await deleteFavoritesService.execute(params);

        // Assert
        expect(mockPrisma.client.findUnique).toHaveBeenCalledWith({
            where: { id: params.clientId },
        });
        expect(mockPrisma.favorite.delete).toHaveBeenCalledWith({
            where: {
                clientId_itemId: {
                    clientId: params.clientId,
                    itemId: params.itemId,
                },
            },
        });
        expect(result).toEqual(deletedFavorite);
    });

    it('deve lançar erro quando cliente não existe', async () => {
        // Arrange
        const params = {
            clientId: '999',
            itemId: 'item-123',
        };

        mockPrisma.client.findUnique.mockResolvedValue(null);

        // Act & Assert
        await expect(deleteFavoritesService.execute(params)).rejects.toThrow(
            new AppError('Client not found', 404)
        );

        expect(mockPrisma.client.findUnique).toHaveBeenCalledWith({
            where: { id: params.clientId },
        });
        expect(mockPrisma.favorite.delete).not.toHaveBeenCalled();
    });

    it('deve lançar erro quando favorito não existe', async () => {
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
        mockPrisma.favorite.delete.mockRejectedValue(
            new Error('Record to delete does not exist.')
        );

        // Act & Assert
        await expect(deleteFavoritesService.execute(params)).rejects.toThrow(
            'Record to delete does not exist.'
        );

        expect(mockPrisma.favorite.delete).toHaveBeenCalledWith({
            where: {
                clientId_itemId: {
                    clientId: params.clientId,
                    itemId: params.itemId,
                },
            },
        });
    });

    it('deve deletar favorito com dados corretos', async () => {
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

        const deletedFavorite = {
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
        mockPrisma.favorite.delete.mockResolvedValue(deletedFavorite);

        // Act
        const result = await deleteFavoritesService.execute(params);

        // Assert
        expect(result.id).toBe('1');
        expect(result.clientId).toBe('1');
        expect(result.itemId).toBe('item-123');
        expect(result.title).toBe('Produto Teste');
    });

    it('deve verificar se cliente existe antes de deletar', async () => {
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

        const deletedFavorite = {
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
        mockPrisma.favorite.delete.mockResolvedValue(deletedFavorite);

        // Act
        await deleteFavoritesService.execute(params);

        // Assert
        expect(mockPrisma.client.findUnique).toHaveBeenCalledTimes(1);
        expect(mockPrisma.client.findUnique).toHaveBeenCalledWith({
            where: { id: params.clientId },
        });
    });
});
