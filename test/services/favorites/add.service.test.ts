/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
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

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

// Mock do fetch global
const mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>;
(global as any).fetch = mockFetch;

describe('AddFavoritesService', () => {
    let addFavoritesService: AddFavoritesService;

    beforeEach(() => {
        addFavoritesService = new AddFavoritesService();
        jest.clearAllMocks();
    });

    it('deve adicionar um favorito com sucesso', async () => {
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

        const mockProductData = {
            id: 'item-123',
            title: 'Produto Teste',
            price: 99.99,
            image: 'https://example.com/image.jpg',
            brand: 'Marca Teste',
            reviewScore: 4.5,
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
        mockPrisma.favorite.findUnique.mockResolvedValue(null);
        mockPrisma.favorite.create.mockResolvedValue(mockFavorite);
        mockFetch.mockResolvedValue({
            ok: true,
            status: 200,
            json: () => Promise.resolve(mockProductData),
        } as Response);

        // Act
        const result = await addFavoritesService.execute(params);

        // Assert
        expect(mockPrisma.client.findUnique).toHaveBeenCalledWith({
            where: { id: params.clientId },
        });
        expect(mockPrisma.favorite.findUnique).toHaveBeenCalledWith({
            where: { clientId_itemId: { clientId: params.clientId, itemId: params.itemId } },
        });
        expect(mockFetch).toHaveBeenCalledWith(
            `${process.env.PRODUCTS_API_URL}/item-123`,
            expect.objectContaining({
                method: 'GET',
                headers: expect.objectContaining({
                    'Content-Type': 'application/json',
                }),
            })
        );
        expect(mockPrisma.favorite.create).toHaveBeenCalledWith({
            data: {
                clientId: params.clientId,
                itemId: params.itemId,
                price: mockProductData.price,
                imageUrl: mockProductData.image,
                title: mockProductData.title,
            },
        });
        expect(result).toEqual(mockFavorite);
    });

    it('deve lançar erro quando cliente não existe', async () => {
        // Arrange
        const params = {
            clientId: '999',
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
        expect(mockPrisma.favorite.findUnique).not.toHaveBeenCalled();
    });

    it('deve lançar erro quando produto já está nos favoritos', async () => {
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

        const existingFavorite = {
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
        mockPrisma.favorite.findUnique.mockResolvedValue(existingFavorite);

        // Act & Assert
        await expect(addFavoritesService.execute(params)).rejects.toThrow(
            new AppError('Product already in favorites', 409)
        );

        expect(mockPrisma.favorite.findUnique).toHaveBeenCalledWith({
            where: { clientId_itemId: { clientId: params.clientId, itemId: params.itemId } },
        });
        expect(mockFetch).not.toHaveBeenCalled();
    });

    it('deve lançar erro quando produto não é encontrado na API', async () => {
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
        mockFetch.mockResolvedValue({
            ok: false,
            status: 404,
        } as Response);

        // Act & Assert
        await expect(addFavoritesService.execute(params)).rejects.toThrow(
            new AppError('Produto não encontrado', 404)
        );
    });

    it('deve lançar erro quando API retorna erro 500', async () => {
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

        mockPrisma.client.findUnique.mockResolvedValue(mockClient);
        mockPrisma.favorite.findUnique.mockResolvedValue(null);
        mockFetch.mockResolvedValue({
            ok: false,
            status: 500,
        } as Response);

        // Act & Assert
        await expect(addFavoritesService.execute(params)).rejects.toThrow(
            new AppError('Erro ao buscar o produto', 500)
        );
    });

    it('deve lançar erro quando fetch falha', async () => {
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

        mockPrisma.client.findUnique.mockResolvedValue(mockClient);
        mockPrisma.favorite.findUnique.mockResolvedValue(null);
        mockFetch.mockRejectedValue(new Error('Network error'));

        // Act & Assert
        await expect(addFavoritesService.execute(params)).rejects.toThrow(
            new AppError('Erro ao buscar o produto', 500)
        );
    });
});
