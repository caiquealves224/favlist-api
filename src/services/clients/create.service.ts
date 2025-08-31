import type { Client } from '../../../generated/prisma';
import { prisma } from '../../database/prisma';
import { AppError } from '../../errors/appError';
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
            throw new AppError('Já existe um cliente com este e-mail', 409);
        }

        const client = await prisma.client.create({ data: { name, email } });

        return client;
    }
}
