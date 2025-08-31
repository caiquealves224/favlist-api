import { prisma } from '../../database/prisma';
import { Client } from '../../../generated/prisma';
import { AppError } from '../../errors/appError';

export class GetClientService {
    async execute(identifier: string): Promise<Client> {
        const client = await prisma.client.findFirst({
            where: {
                OR: [{ id: identifier }, { email: identifier }],
            },
            include: { favorites: true },
        });
        if (!client) {
            throw new AppError('Cliente não encontrado', 404);
        }

        return client;
    }
}
