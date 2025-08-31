import { Request, Response } from 'express';
import { ListClientService } from '../../services/clients/list.service';

export class ListClientsController {
    constructor(private listClientService: ListClientService) {}
    async handler(request: Request, response: Response): Promise<Response> {
        try {
            const { page = '1', limit = '10', search } = request.query;

            // Validações básicas
            const pageNumber = parseInt(page as string);
            const limitNumber = parseInt(limit as string);

            if (isNaN(pageNumber) || pageNumber < 1) {
                return response.status(400).json({
                    success: false,
                    message: 'Página deve ser um número maior que 0',
                });
            }

            if (isNaN(limitNumber) || limitNumber < 1 || limitNumber > 100) {
                return response.status(400).json({
                    success: false,
                    message: 'Limite deve ser um número entre 1 e 100',
                });
            }

            const result = await this.listClientService.execute({
                page: pageNumber,
                limit: limitNumber,
                search: search as string | undefined,
            });

            const totalClients = 2; // TODO: Implementar contagem real
            const totalPages = Math.ceil(totalClients / limitNumber);

            return response.status(200).json({
                success: true,
                message: 'Clientes encontrados com sucesso',
                data: {
                    clients: result.clients,
                    pagination: {
                        page: pageNumber,
                        limit: limitNumber,
                        total: result.total,
                        totalPages,
                        hasNext: pageNumber < totalPages,
                        hasPrev: pageNumber > 1,
                    },
                },
            });
        } catch (error) {
            console.error('Erro ao buscar clientes:', error);
            return response.status(500).json({
                success: false,
                message: 'Erro interno do servidor',
            });
        }
    }
}
