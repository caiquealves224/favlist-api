import { Request, Response } from 'express';
import AddFavoritesService from '../../services/favorites/add.service';

export default class AddFavoritesController {
    constructor(private readonly addFavoritesService: AddFavoritesService) {}
    async handler(request: Request, response: Response): Promise<Response> {
        const { clientId } = request.params;
        const { itemId } = request.body;

        const result = await this.addFavoritesService.execute({
            clientId,
            itemId,
        });

        return response.status(201).json({
            success: true,
            message: 'Favorito adicionado com sucesso',
            data: result,
        });
    }
}
