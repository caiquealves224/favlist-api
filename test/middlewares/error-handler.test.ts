/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { Request, Response } from 'express';
import { errorHandler } from '../../src/middlewares/error-handler';
import { AppError } from '../../src/errors/appError';

describe('Error Handler Middleware', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockJson: jest.Mock;
    let mockStatus: jest.Mock;

    beforeEach(() => {
        mockJson = jest.fn();
        mockStatus = jest.fn().mockReturnValue({ json: mockJson });
        
        mockRequest = {};
        mockResponse = {
            status: mockStatus as any,
            json: mockJson as any,
        };

        // Mock console.error para evitar logs nos testes
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('deve retornar erro 400 quando receber AppError', () => {
        // Arrange
        const appError = new AppError('Cliente não encontrado', 404);

        // Act
        errorHandler(
            appError,
            mockRequest as Request,
            mockResponse as Response
        );

        // Assert
        expect(mockStatus).toHaveBeenCalledWith(404);
        expect(mockJson).toHaveBeenCalledWith({
            status: 'error',
            message: 'Cliente não encontrado',
        });
    });

    it('deve retornar erro 500 quando receber erro genérico', () => {
        // Arrange
        const genericError = new Error('Erro inesperado');

        // Act
        errorHandler(
            genericError,
            mockRequest as Request,
            mockResponse as Response
        );

        // Assert
        expect(mockStatus).toHaveBeenCalledWith(500);
        expect(mockJson).toHaveBeenCalledWith({
            status: 'error',
            message: 'Internal server error',
        });
        expect(console.error).toHaveBeenCalledWith(genericError);
    });

    it('deve retornar erro 500 quando receber erro sem mensagem', () => {
        // Arrange
        const errorWithoutMessage = new Error();

        // Act
        errorHandler(
            errorWithoutMessage,
            mockRequest as Request,
            mockResponse as Response
        );

        // Assert
        expect(mockStatus).toHaveBeenCalledWith(500);
        expect(mockJson).toHaveBeenCalledWith({
            status: 'error',
            message: 'Internal server error',
        });
    });

    it('deve lidar com AppError com diferentes status codes', () => {
        // Arrange
        const forbiddenError = new AppError('Acesso negado', 403);

        // Act
        errorHandler(
            forbiddenError,
            mockRequest as Request,
            mockResponse as Response
        );

        // Assert
        expect(mockStatus).toHaveBeenCalledWith(403);
        expect(mockJson).toHaveBeenCalledWith({
            status: 'error',
            message: 'Acesso negado',
        });
    });

    it('deve lidar com objetos de erro que não são instâncias de Error', () => {
        // Arrange
        const nonErrorObject = { message: 'Algo deu errado' } as any;

        // Act
        errorHandler(
            nonErrorObject,
            mockRequest as Request,
            mockResponse as Response
        );

        // Assert
        expect(mockStatus).toHaveBeenCalledWith(500);
        expect(mockJson).toHaveBeenCalledWith({
            status: 'error',
            message: 'Internal server error',
        });
    });
});
