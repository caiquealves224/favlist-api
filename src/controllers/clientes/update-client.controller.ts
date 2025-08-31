import { Request, Response } from 'express';
import { updateClientSchema } from '../../schemas/client.schema.js';
import { UpdateClientService } from '../../services/clients/update.service.js';

export class UpdateClientController {
    constructor(private readonly updateClientService: UpdateClientService) {}

    async handler(request: Request, response: Response): Promise<Response> {
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
    }
}
