import { Favorite } from '../../../generated/prisma';
import { prisma } from '../../database/prisma';
import { AppError } from '../../errors/appError';

export default class GetFavoritesService {
    async execute({
        clientId,
        itemId,
    }: {
        clientId: string;
        itemId?: string;
    }): Promise<Favorite | Favorite[]> {
        const client = await prisma.client.findUnique({
            where: { id: clientId },
        });
        if (!client) throw new AppError('Client not found', 404);

        if (itemId == null) {
            const favorites = await prisma.favorite.findMany({
                where: { clientId },
            });
            return favorites;
        }

        const favorite = await prisma.favorite.findUnique({
            where: {
                clientId_itemId: {
                    clientId,
                    itemId,
                },
            },
        });

        if (!favorite)
            throw new AppError('Product not found in favorites', 404);

        return favorite;
    }
}
