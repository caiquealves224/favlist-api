import { Request, Response } from 'express';
import DeleteFavoritesService from '../../services/favorites/delete.service';

export default class DeleteFavoritesController {
    constructor(
        private readonly deleteFavoritesService: DeleteFavoritesService
    ) {}
    async handler(request: Request, response: Response): Promise<Response> {
        const result = await this.deleteFavoritesService.execute({
            clientId: request.params.clientId,
            itemId: request.params.itemId,
        });

        return response.status(200).json({
            success: true,
            message: 'Favorito removido com sucesso',
            data: result,
        });
    }
}
