import { Request, Response } from 'express';
import GetFavoritesService from '../../services/favorites/get.service';

export default class GetFavoritesController {
    constructor(private readonly getFavoritesService: GetFavoritesService) {}
    async handler(request: Request, response: Response): Promise<Response> {
        const result = await this.getFavoritesService.execute({
            clientId: request.params.clientId,
            itemId: request.params.itemId,
        });

        return response.status(200).json({
            success: true,
            message: 'Favorito encontrado com sucesso',
            data: result,
        });
    }
}
