import { Request, Response } from 'express';
import { GetClientService } from '../../services/clients/get.service';

export class GetClientsController {
    constructor(private getClientService: GetClientService) {}
    async handler(request: Request, response: Response): Promise<Response> {
        const result = await this.getClientService.execute(request.params.id);
        return response.status(200).json(result);
    }
}
