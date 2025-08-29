import { Request, Response } from 'express';
import { ZodError } from 'zod';
import { updateClientSchema } from '../../schemas/client.schema.js';

export class UpdateClientController {
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

            // Verificar se pelo menos um campo foi fornecido
            if (Object.keys(validatedData).length === 0) {
                return response.status(400).json({
                    success: false,
                    message:
                        'Pelo menos um campo deve ser fornecido para atualização',
                });
            }

            // TODO: Implementar lógica de atualização do cliente
            // - Verificar se cliente existe
            // - Validar se novo email já existe (se fornecido)
            // - Atualizar no banco de dados
            // - Retornar cliente atualizado

            const updatedClient = {
                id,
                name: validatedData.name ?? 'nome-anterior',
                email: validatedData.email ?? 'email-anterior',
                updatedAt: new Date(),
            };

            return response.status(200).json({
                success: true,
                message: 'Cliente atualizado com sucesso',
                data: updatedClient,
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
