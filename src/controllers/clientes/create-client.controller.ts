import { Request, Response } from 'express';
import { CreateClientService } from '../../services/clients/create.service';

export class CreateClientController {
    constructor(private readonly createClientService: CreateClientService) {}

    async handler(request: Request, response: Response): Promise<Response> {
        const result = await this.createClientService.execute(request.body);

        return response.status(201).json({
            success: true,
            message: 'Cliente criado com sucesso',
            data: result,
        });
    }
}
