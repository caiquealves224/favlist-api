import { prisma } from '../../database/prismaClient';

interface ICreateClient {
    name: string;
    email: string;
}

export class CreateClientService {
    async execute({ name, email }: ICreateClient): Promise<any> {
        // Check if user already exists
        const clientExists = await prisma.client.findFirst({
            where: {
                email,
            },
        });

        if (clientExists) {
            throw new Error('Client already exists');
        }

        // Create user
        const client = await prisma.client.create({
            data: {
                name,
                email,
            },
        });

        return client;
    }
}
