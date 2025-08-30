import { prisma } from '../../database/prisma';
import { Client } from '../../../generated/prisma';

export class GetClientService {
    async execute(identifier: string): Promise<Client> {
        const client = await prisma.client.findFirst({
            where: {
                OR: [{ id: identifier }, { email: identifier }],
            },
        });
        if (!client) {
            throw new Error('Client not found');
        }

        return client;
    }
}
