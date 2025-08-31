import { Request, Response } from 'express';
import AddFavoritesService from '../../services/favorites/add.service';

export default class AddFavoritesController {
    constructor(private readonly addFavoritesService: AddFavoritesService) {}
    async handler(request: Request, response: Response): Promise<Response> {
        const result = await this.addFavoritesService.execute({
            clientId: request.body.clientId,
            itemId: request.body.itemId,
        });

        return response.status(200).json({
            success: true,
            message: 'Favorito adicionado com sucesso',
            data: result,
        });
    }
}
