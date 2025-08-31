import type { Client } from '../../../generated/prisma';
import { prisma } from '../../database/prisma';
interface ICreateClient {
    name: string;
    email: string;
}

export class CreateClientService {
    async execute({ name, email }: ICreateClient): Promise<Client> {
        const clientExists = await prisma.client.findFirst({
            where: { email },
        });

        if (clientExists !== null) {
            throw new Error('Client already exists');
        }

        const client = await prisma.client.create({ data: { name, email } });

        return client;
    }
}
