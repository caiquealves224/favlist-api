import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { DeleteClientService } from '../../../src/services/clients/delete.service';
import { prisma } from '../../../src/database/prisma';

// Mock do Prisma
jest.mock('../../../src/database/prisma', () => ({
    prisma: {
        client: {
            delete: jest.fn(),
        },
    },
}));

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe('DeleteClientService', () => {
    let deleteClientService: DeleteClientService;

    beforeEach(() => {
        deleteClientService = new DeleteClientService();
        jest.clearAllMocks();
    });

    it('deve deletar um cliente com sucesso', async () => {
        // Arrange
        const clientId = '1';
        const deletedClient = {
            id: '1',
            name: 'João Silva',
            email: 'joao@email.com',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        mockPrisma.client.delete.mockResolvedValue(deletedClient);

        // Act
        await deleteClientService.execute(clientId);

        // Assert
        expect(mockPrisma.client.delete).toHaveBeenCalledWith({
            where: { id: clientId },
        });
    });

    it('deve lançar erro quando cliente não existe', async () => {
        // Arrange
        const clientId = '999';

        mockPrisma.client.delete.mockRejectedValue(
            new Error('Record to delete does not exist.')
        );

        // Act & Assert
        await expect(deleteClientService.execute(clientId)).rejects.toThrow(
            'Record to delete does not exist.'
        );

        expect(mockPrisma.client.delete).toHaveBeenCalledWith({
            where: { id: clientId },
        });
    });

    it('deve lançar erro quando ID é inválido', async () => {
        // Arrange
        const invalidId = '';

        mockPrisma.client.delete.mockRejectedValue(
            new Error('Invalid ID format')
        );

        // Act & Assert
        await expect(deleteClientService.execute(invalidId)).rejects.toThrow(
            'Invalid ID format'
        );
    });
});
