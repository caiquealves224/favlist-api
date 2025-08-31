import { prisma } from '../../database/prisma';

export class DeleteClientService {
    async execute(id: string): Promise<void> {
        await prisma.client.delete({
            where: {
                id,
            },
        });
    }
}
