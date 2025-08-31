import { prisma } from '../../database/prisma';
import { Client } from '../../../generated/prisma';

interface ListClientResponse {
    clients: Client[];
    total: number;
}

export class ListClientService {
    async execute({
        page,
        limit,
        search,
    }: {
        page: number;
        limit: number;
        search?: string;
    }): Promise<ListClientResponse> {
        const clients = await prisma.client.findMany({
            skip: (page - 1) * limit,
            take: limit,
            where:
                search != null
                    ? {
                          name: {
                              contains: search,
                              mode: 'insensitive',
                          },
                      }
                    : {},
            include: { favorites: true },
        });

        const total = await prisma.client.count({
            where:
                search != null
                    ? {
                          name: {
                              contains: search,
                              mode: 'insensitive',
                          },
                      }
                    : {},
        });
        return {
            clients,
            total,
        };
    }
}
