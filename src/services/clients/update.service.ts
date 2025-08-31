import { Client } from '../../../generated/prisma';
import { prisma } from '../../database/prisma';
import { AppError } from '../../errors/appError';

export class UpdateClientService {
    async execute(id: string, data: any): Promise<Client> {
        const clientAlreadyExists = await prisma.client.findUnique({
            where: {
                id,
            },
        });

        if (!clientAlreadyExists) {
            throw new AppError('Cliente não encontrado', 404);
        }

        const clientUpdated = await prisma.client.update({
            where: {
                id,
            },
            data,
        });

        return clientUpdated;
    }
}
