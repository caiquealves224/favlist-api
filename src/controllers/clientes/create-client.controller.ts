import { Request, Response } from 'express';
import { ZodError } from 'zod';
import { createClientSchema } from '../../schemas/client.schema';
import { CreateClientService } from '../../services/clients/create.service';

export class CreateClientController {
    constructor(private readonly createClientService: CreateClientService) {}

    async handler(request: Request, response: Response): Promise<Response> {
        try {
            // Validação com Zod
            const validatedData = createClientSchema.parse(request.body ?? {});

            // Chamar o serviço para criar o cliente
            const result =
                await this.createClientService.execute(validatedData);

            return response.status(201).json({
                success: true,
                message: 'Cliente criado com sucesso',
                data: result,
            });
        } catch (error) {
            // Tratamento específico para erros de validação do Zod
            if (error instanceof ZodError) {
                const formattedErrors = error.issues.map(issue => ({
                    field: issue.path.join('.'),
                    message: issue.message,
                    code: issue.code,
                }));

                return response.status(400).json({
                    success: false,
                    message: 'Dados de entrada inválidos',
                    errors: formattedErrors,
                });
            }

            console.error('Erro ao criar cliente:', error);
            return response.status(500).json({
                success: false,
                message: 'Erro interno do servidor',
            });
        }
    }
}
