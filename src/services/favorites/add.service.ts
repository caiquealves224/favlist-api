import { Favorite } from '../../../generated/prisma';
import { prisma } from '../../database/prisma';
import { AppError } from '../../errors/appError';

export default class AddFavoritesService {
    async execute({
        clientId,
        itemId,
    }: {
        clientId: string;
        itemId: string;
    }): Promise<Favorite> {
        const favoriteApiItem = await this.fetchProduct(itemId);

        const favorite = await prisma.favorite.upsert({
            where: {
                clientId_itemId: {
                    clientId,
                    itemId,
                },
            },
            update: {
                price: favoriteApiItem.price,
                imageUrl: favoriteApiItem.image,
                title: favoriteApiItem.title,
            },
            create: {
                clientId,
                itemId,
                price: favoriteApiItem.price,
                imageUrl: favoriteApiItem.image,
                title: favoriteApiItem.title,
            },
        });

        return favorite;
    }

    private async fetchProduct(itemId: string): Promise<{
        price: number;
        image: string;
        brand: string;
        id: string;
        title: string;
        reviewScore: number;
    }> {
        try {
            const response = await fetch(
                `${process.env.PRODUCTS_API_URL as string}/${itemId}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': process.env.PRODUCTS_API_KEY as string,
                    },
                }
            );

            if (response.status === 404) {
                throw new AppError('Produto não encontrado', 404);
            }

            if (!response.ok) {
                throw new AppError('Erro ao buscar o produto', 500);
            }

            const favoriteData: {
                price: number;
                image: string;
                brand: string;
                id: string;
                title: string;
                reviewScore: number;
            } = await response.json();
            return favoriteData;
        } catch (error) {
            console.error(error);
            throw new AppError('Erro ao buscar o produto', 500);
        }
    }
}
