import { Client } from '../../../generated/prisma';
import { prisma } from '../../database/prisma';

export class UpdateClientService {
    async execute(id: string, data: any): Promise<Client> {
        const client = await prisma.client.update({
            where: {
                id,
            },
            data,
        });

        return client;
    }
}
