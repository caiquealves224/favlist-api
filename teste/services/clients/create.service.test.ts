import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { CreateClientService } from '../../../src/services/clients/create.service';
import { prisma } from '../../../src/database/prisma';
import { AppError } from '../../../src/errors/appError';

// Mock do Prisma
jest.mock('../../../src/database/prisma', () => ({
    prisma: {
        client: {
            findFirst: jest.fn(),
            create: jest.fn(),
        },
    },
}));

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe('CreateClientService', () => {
    let createClientService: CreateClientService;

    beforeEach(() => {
        createClientService = new CreateClientService();
        jest.clearAllMocks();
    });

    it('deve criar um cliente com sucesso', async () => {
        // Arrange
        const clientData = {
            name: 'João Silva',
            email: 'joao@email.com',
        };

        const expectedClient = {
            id: '1',
            name: 'João Silva',
            email: 'joao@email.com',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        mockPrisma.client.findFirst.mockResolvedValue(null);
        mockPrisma.client.create.mockResolvedValue(expectedClient);

        // Act
        const result = await createClientService.execute(clientData);

        // Assert
        expect(mockPrisma.client.findFirst).toHaveBeenCalledWith({
            where: { email: clientData.email },
        });
        expect(mockPrisma.client.create).toHaveBeenCalledWith({
            data: clientData,
        });
        expect(result).toEqual(expectedClient);
    });

    it('deve lançar erro quando cliente já existe', async () => {
        // Arrange
        const clientData = {
            name: 'João Silva',
            email: 'joao@email.com',
        };

        const existingClient = {
            id: '1',
            name: 'João Silva',
            email: 'joao@email.com',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        mockPrisma.client.findFirst.mockResolvedValue(existingClient);

        // Act & Assert
        await expect(createClientService.execute(clientData)).rejects.toThrow(
            new AppError('Já existe um cliente com este e-mail', 409)
        );

        expect(mockPrisma.client.findFirst).toHaveBeenCalledWith({
            where: { email: clientData.email },
        });
        expect(mockPrisma.client.create).not.toHaveBeenCalled();
    });
});
