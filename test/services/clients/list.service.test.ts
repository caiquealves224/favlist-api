/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { ListClientService } from '../../../src/services/clients/list.service';

// Mock do Prisma
jest.mock('../../../src/database/prisma', () => ({
    prisma: {
        client: {
            findMany: jest.fn(),
            count: jest.fn(),
        },
    },
}));

import { prisma } from '../../../src/database/prisma';
const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe('ListClientService', () => {
    let listClientService: ListClientService;

    beforeEach(() => {
        listClientService = new ListClientService();
        jest.clearAllMocks();
    });

    it('deve listar clientes com paginação', async () => {
        // Arrange
        const params = {
            page: 1,
            limit: 10,
        };

        const mockClients = [
            {
                id: '1',
                name: 'João Silva',
                email: 'joao@email.com',
                createdAt: new Date(),
                updatedAt: new Date(),
                favorites: [],
            },
            {
                id: '2',
                name: 'Maria Santos',
                email: 'maria@email.com',
                createdAt: new Date(),
                updatedAt: new Date(),
                favorites: [],
            },
        ];

        (mockPrisma.client.findMany as any).mockResolvedValueOnce(mockClients);
        (mockPrisma.client.count as any).mockResolvedValueOnce(2);

        // Act
        const result = await listClientService.execute(params);

        // Assert
        expect(mockPrisma.client.findMany).toHaveBeenCalledWith({
            skip: 0, // (page - 1) * limit = (1 - 1) * 10 = 0
            take: 10,
            where: {},
            include: { favorites: true },
        });
        expect(mockPrisma.client.count).toHaveBeenCalledWith({
            where: {},
        });
        expect(result).toEqual({
            clients: mockClients,
            total: 2,
        });
    });

    it('deve listar clientes com busca por nome', async () => {
        // Arrange
        const params = {
            page: 1,
            limit: 10,
            search: 'João',
        };

        const mockClients = [
            {
                id: '1',
                name: 'João Silva',
                email: 'joao@email.com',
                createdAt: new Date(),
                updatedAt: new Date(),
                favorites: [],
            },
        ];

        mockPrisma.client.findMany.mockResolvedValue(mockClients);
        mockPrisma.client.count.mockResolvedValue(1);

        // Act
        const result = await listClientService.execute(params);

        // Assert
        expect(mockPrisma.client.findMany).toHaveBeenCalledWith({
            skip: 0,
            take: 10,
            where: {
                name: {
                    contains: 'João',
                    mode: 'insensitive',
                },
            },
            include: { favorites: true },
        });
        expect(mockPrisma.client.count).toHaveBeenCalledWith({
            where: {
                name: {
                    contains: 'João',
                    mode: 'insensitive',
                },
            },
        });
        expect(result.clients).toHaveLength(1);
        expect(result.total).toBe(1);
    });

    it('deve calcular paginação corretamente', async () => {
        // Arrange
        const params = {
            page: 3,
            limit: 5,
        };

        const mockClients = [
            {
                id: '11',
                name: 'Cliente 11',
                email: 'cliente11@email.com',
                createdAt: new Date(),
                updatedAt: new Date(),
                favorites: [],
            },
        ];

        mockPrisma.client.findMany.mockResolvedValue(mockClients);
        mockPrisma.client.count.mockResolvedValue(25);

        // Act
        const result = await listClientService.execute(params);

        // Assert
        expect(mockPrisma.client.findMany).toHaveBeenCalledWith({
            skip: 10, // (page - 1) * limit = (3 - 1) * 5 = 10
            take: 5,
            where: {},
            include: { favorites: true },
        });
        expect(result.total).toBe(25);
    });

    it('deve retornar lista vazia quando não há clientes', async () => {
        // Arrange
        const params = {
            page: 1,
            limit: 10,
        };

        mockPrisma.client.findMany.mockResolvedValue([]);
        mockPrisma.client.count.mockResolvedValue(0);

        // Act
        const result = await listClientService.execute(params);

        // Assert
        expect(result.clients).toHaveLength(0);
        expect(result.total).toBe(0);
    });

    it('deve incluir favoritos na resposta', async () => {
        // Arrange
        const params = {
            page: 1,
            limit: 10,
        };

        const mockClients = [
            {
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
            },
        ];

        mockPrisma.client.findMany.mockResolvedValue(mockClients);
        mockPrisma.client.count.mockResolvedValue(1);

        // Act
        const result = await listClientService.execute(params);

        // Assert
        expect(result.clients[0].favorites).toHaveLength(1);
        expect(result.clients[0].favorites[0].title).toBe('Produto Teste');
    });
});
