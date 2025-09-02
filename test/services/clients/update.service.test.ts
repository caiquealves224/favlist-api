import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { UpdateClientService } from '../../../src/services/clients/update.service';
import { prisma } from '../../../src/database/prisma';
import { AppError } from '../../../src/errors/appError';

// Mock do Prisma
jest.mock('../../../src/database/prisma', () => ({
    prisma: {
        client: {
            findUnique: jest.fn(),
            update: jest.fn(),
        },
    },
}));

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe('UpdateClientService', () => {
    let updateClientService: UpdateClientService;

    beforeEach(() => {
        updateClientService = new UpdateClientService();
        jest.clearAllMocks();
    });

    it('deve atualizar um cliente com sucesso', async () => {
        // Arrange
        const clientId = '1';
        const updateData = {
            name: 'João Silva Atualizado',
            email: 'joao.novo@email.com',
        };

        const existingClient = {
            id: '1',
            name: 'João Silva',
            email: 'joao@email.com',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const updatedClient = {
            id: '1',
            name: 'João Silva Atualizado',
            email: 'joao.novo@email.com',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        mockPrisma.client.findUnique.mockResolvedValue(existingClient);
        mockPrisma.client.update.mockResolvedValue(updatedClient);

        // Act
        const result = await updateClientService.execute(clientId, updateData);

        // Assert
        expect(mockPrisma.client.findUnique).toHaveBeenCalledWith({
            where: { id: clientId },
        });
        expect(mockPrisma.client.update).toHaveBeenCalledWith({
            where: { id: clientId },
            data: updateData,
        });
        expect(result).toEqual(updatedClient);
    });

    it('deve lançar erro quando cliente não existe', async () => {
        // Arrange
        const clientId = '999';
        const updateData = {
            name: 'João Silva Atualizado',
        };

        mockPrisma.client.findUnique.mockResolvedValue(null);

        // Act & Assert
        await expect(updateClientService.execute(clientId, updateData)).rejects.toThrow(
            new AppError('Cliente não encontrado', 404)
        );

        expect(mockPrisma.client.findUnique).toHaveBeenCalledWith({
            where: { id: clientId },
        });
        expect(mockPrisma.client.update).not.toHaveBeenCalled();
    });

    it('deve atualizar apenas campos fornecidos', async () => {
        // Arrange
        const clientId = '1';
        const updateData = {
            name: 'Apenas Nome Atualizado',
        };

        const existingClient = {
            id: '1',
            name: 'João Silva',
            email: 'joao@email.com',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const updatedClient = {
            id: '1',
            name: 'Apenas Nome Atualizado',
            email: 'joao@email.com',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        mockPrisma.client.findUnique.mockResolvedValue(existingClient);
        mockPrisma.client.update.mockResolvedValue(updatedClient);

        // Act
        const result = await updateClientService.execute(clientId, updateData);

        // Assert
        expect(mockPrisma.client.update).toHaveBeenCalledWith({
            where: { id: clientId },
            data: updateData,
        });
        expect(result.name).toBe('Apenas Nome Atualizado');
    });
});
