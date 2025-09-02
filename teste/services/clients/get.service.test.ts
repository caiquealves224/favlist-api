import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { GetClientService } from '../../../src/services/clients/get.service';
import { prisma } from '../../../src/database/prisma';
import { AppError } from '../../../src/errors/appError';

// Mock do Prisma
jest.mock('../../../src/database/prisma', () => ({
    prisma: {
        client: {
            findFirst: jest.fn(),
        },
    },
}));

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe('GetClientService', () => {
    let getClientService: GetClientService;

    beforeEach(() => {
        getClientService = new GetClientService();
        jest.clearAllMocks();
    });

    it('deve buscar cliente por ID com sucesso', async () => {
        // Arrange
        const clientId = '1';
        const expectedClient = {
            id: '1',
            name: 'João Silva',
            email: 'joao@email.com',
            createdAt: new Date(),
            updatedAt: new Date(),
            favorites: [],
        };

        mockPrisma.client.findFirst.mockResolvedValue(expectedClient);

        // Act
        const result = await getClientService.execute(clientId);

        // Assert
        expect(mockPrisma.client.findFirst).toHaveBeenCalledWith({
            where: {
                OR: [{ id: clientId }, { email: clientId }],
            },
            include: { favorites: true },
        });
        expect(result).toEqual(expectedClient);
    });

    it('deve buscar cliente por email com sucesso', async () => {
        // Arrange
        const clientEmail = 'joao@email.com';
        const expectedClient = {
            id: '1',
            name: 'João Silva',
            email: 'joao@email.com',
            createdAt: new Date(),
            updatedAt: new Date(),
            favorites: [
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
            ],
        };

        mockPrisma.client.findFirst.mockResolvedValue(expectedClient);

        // Act
        const result = await getClientService.execute(clientEmail);

        // Assert
        expect(mockPrisma.client.findFirst).toHaveBeenCalledWith({
            where: {
                OR: [{ id: clientEmail }, { email: clientEmail }],
            },
            include: { favorites: true },
        });
        expect(result).toEqual(expectedClient);
        expect(result.favorites).toHaveLength(1);
    });

    it('deve lançar erro quando cliente não é encontrado', async () => {
        // Arrange
        const clientId = '999';

        mockPrisma.client.findFirst.mockResolvedValue(null);

        // Act & Assert
        await expect(getClientService.execute(clientId)).rejects.toThrow(
            new AppError('Cliente não encontrado', 404)
        );

        expect(mockPrisma.client.findFirst).toHaveBeenCalledWith({
            where: {
                OR: [{ id: clientId }, { email: clientId }],
            },
            include: { favorites: true },
        });
    });

    it('deve incluir favoritos na resposta', async () => {
        // Arrange
        const clientId = '1';
        const clientWithFavorites = {
            id: '1',
            name: 'João Silva',
            email: 'joao@email.com',
            createdAt: new Date(),
            updatedAt: new Date(),
            favorites: [
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
            ],
        };

        mockPrisma.client.findFirst.mockResolvedValue(clientWithFavorites);

        // Act
        const result = await getClientService.execute(clientId);

        // Assert
        expect(result.favorites).toHaveLength(2);
        expect(result.favorites[0].title).toBe('Produto 1');
        expect(result.favorites[1].title).toBe('Produto 2');
    });
});
