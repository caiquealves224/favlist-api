import { Favorite } from '../../../generated/prisma';
import { prisma } from '../../database/prisma';
import { AppError } from '../../errors/appError';
import { productCache } from '../cache/product-cache.service';

interface ProductApiResponse {
    price: number;
    image: string;
    brand: string;
    id: string;
    title: string;
    reviewScore: number;
}

export default class AddFavoritesService {
    async execute({
        clientId,
        itemId,
    }: {
        clientId: string;
        itemId: string;
    }): Promise<Favorite> {
        const client = await prisma.client.findUnique({
            where: { id: clientId ? clientId : '' },
        });
        if (!client) throw new AppError('Client not found', 404);

        const exists = await prisma.favorite.findUnique({
            where: { clientId_itemId: { clientId, itemId } },
        });
        if (exists) throw new AppError('Product already in favorites', 409);

        const favoriteApiItem = await this.fetchProduct(itemId);

        const favorite = await prisma.favorite.create({
            data: {
                clientId,
                itemId,
                price: favoriteApiItem.price,
                imageUrl: favoriteApiItem.image,
                title: favoriteApiItem.title,
            },
        });

        return favorite;
    }

    private async fetchProduct(itemId: string): Promise<ProductApiResponse> {
        // Verificar se já está no cache
        const cachedProduct = productCache.get(itemId);
        if (cachedProduct) {
            return cachedProduct;
        }

        // Buscar dados do produto na API externa se não estiver no cache
        let productData: ProductApiResponse;

        if (
            process.env.NODE_ENV === 'development' ||
            process.env.MOCK_API === 'true'
        ) {
            // Mock data para desenvolvimento
            productData = {
                price: Math.floor(Math.random() * 1000) + 50, // Preço entre 50-1050
                image: `https://via.placeholder.com/300x300?text=Product+${itemId}`,
                brand: ['Samsung', 'Apple', 'LG', 'Sony', 'Philips'][
                    Math.floor(Math.random() * 5)
                ],
                id: itemId,
                title: `Produto Exemplo ${itemId}`,
                reviewScore: Math.floor(Math.random() * 5) + 1, // Score entre 1-5
            };

            // Simular delay da API (opcional)
            await new Promise(resolve => setTimeout(resolve, 100));
        } else {
            // Produção: usar API real
            const response = await fetch(
                `https://challenge-api.luizalabs.com/api/product/${itemId}/`
            );

            if (!response.ok) {
                throw new AppError(
                    'Produto não encontrado na API externa',
                    404
                );
            }

            productData = (await response.json()) as ProductApiResponse;
        }

        // Salvar no cache
        productCache.set(itemId, productData);

        return productData;
    }
}
