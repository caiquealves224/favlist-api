import { Request, Response } from 'express';
import { ZodError } from 'zod';
import { updateClientSchema } from '../../schemas/client.schema.js';
import { UpdateClientService } from '../../services/clients/update.service.js';

export class UpdateClientController {
    constructor(private readonly updateClientService: UpdateClientService) {}

    async handler(request: Request, response: Response): Promise<Response> {
        try {
            const { id } = request.params;

            // Validação do ID
            if (!id) {
                return response.status(400).json({
                    success: false,
                    message: 'ID do cliente é obrigatório',
                });
            }

            // Validação com Zod para o body
            const validatedData = updateClientSchema.parse(request.body);
            const result = await this.updateClientService.execute(
                id,
                validatedData
            );

            return response.status(200).json({
                success: true,
                message: 'Cliente atualizado com sucesso',
                data: result,
            });
        } catch (error) {
            // Tratamento específico para erros de validação do Zod
            if (error instanceof ZodError) {
                return response.status(400).json({ error });
            }

            console.error('Erro ao atualizar cliente:', error);
            return response.status(500).json({
                success: false,
                message: 'Erro interno do servidor',
            });
        }
    }
}
