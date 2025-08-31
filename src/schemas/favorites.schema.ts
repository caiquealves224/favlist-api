import z from 'zod';

export const FavoriteSchema = z.object({
    itemId: z.string().min(1, 'itemId é obrigatório'),
});
