import { Request, Response } from 'express';

export class ListClientsController {
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

            // TODO: Implementar lógica de busca de clientes
            // - Buscar no banco de dados com paginação
            // - Aplicar filtros de busca se fornecidos
            // - Retornar lista paginada de clientes

            // Dados simulados para exemplo
            const mockClients = [
                {
                    id: '1',
                    name: 'João Silva',
                    email: 'joao@email.com',
                    phone: '(11) 99999-9999',
                    createdAt: new Date(),
                },
                {
                    id: '2',
                    name: 'Maria Santos',
                    email: 'maria@email.com',
                    phone: '(11) 88888-8888',
                    createdAt: new Date(),
                },
            ];

            const totalClients = 2; // TODO: Implementar contagem real
            const totalPages = Math.ceil(totalClients / limitNumber);

            return response.status(200).json({
                success: true,
                message: 'Clientes encontrados com sucesso',
                data: {
                    clients: mockClients,
                    pagination: {
                        page: pageNumber,
                        limit: limitNumber,
                        total: totalClients,
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
