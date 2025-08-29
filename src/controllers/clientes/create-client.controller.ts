import { Request, Response } from 'express';
import { ZodError } from 'zod';
import { createClientSchema } from '../../schemas/client.schema';

export class CreateClientController {
    constructor(private readonly createClientService: any) {}

    async handler(request: Request, response: Response): Promise<Response> {
        try {
            // Validação com Zod
            const validatedData = createClientSchema.parse(request.body);

            return response.status(201).json({
                success: true,
                message: 'Cliente criado com sucesso',
                data: validatedData,
            });
        } catch (error) {
            // Tratamento específico para erros de validação do Zod
            if (error instanceof ZodError) {
                return response.status(400).json({ error: error });
            }

            console.error('Erro ao criar cliente:', error);
            return response.status(500).json({
                success: false,
                message: 'Erro interno do servidor',
            });
        }
    }
}
