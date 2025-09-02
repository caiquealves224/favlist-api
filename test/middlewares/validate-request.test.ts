/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { validate } from '../../src/middlewares/validate-request';

describe('Validate Request Middleware', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: jest.Mock;
    let mockJson: jest.Mock;
    let mockStatus: jest.Mock;

    beforeEach(() => {
        mockJson = jest.fn();
        mockStatus = jest.fn().mockReturnValue({ json: mockJson });
        mockNext = jest.fn();

        mockRequest = {
            body: {},
            query: {},
            params: {}
        };

        mockResponse = {
            status: mockStatus as any,
            json: mockJson as any,
        };

        jest.clearAllMocks();
    });

    it('deve chamar next() quando validação for bem-sucedida', () => {
        // Arrange
        const schema = z.object({
            name: z.string(),
            email: z.string().email(),
        });

        const validData = {
            name: 'João Silva',
            email: 'joao@email.com',
        };

        mockRequest.body = validData;

        // Act
        const middleware = validate(schema);
        middleware(
            mockRequest as Request,
            mockResponse as Response,
            mockNext as NextFunction
        );

        // Assert
        expect(mockNext).toHaveBeenCalledTimes(1);
        expect(mockStatus).not.toHaveBeenCalled();
        expect(mockJson).not.toHaveBeenCalled();
    });

    it('deve retornar erro 400 quando validação falhar', () => {
        // Arrange
        const schema = z.object({
            name: z.string(),
            email: z.string().email(),
        });

        const invalidData = {
            name: 123, // inválido - deveria ser string
            email: 'email-inválido', // inválido - não é um email válido
        };

        mockRequest.body = invalidData;

        // Act
        const middleware = validate(schema);
        middleware(
            mockRequest as Request,
            mockResponse as Response,
            mockNext as NextFunction
        );

        // Assert
        expect(mockNext).not.toHaveBeenCalled();
        expect(mockStatus).toHaveBeenCalledWith(400);
        expect(mockJson).toHaveBeenCalledWith(
            expect.objectContaining({
                status: 'error',
                message: 'Validation failed',
                errors: expect.arrayContaining([
                    expect.objectContaining({
                        field: expect.any(String),
                        message: expect.any(String),
                        code: expect.any(String)
                    })
                ])
            })
        );
    });

    it('deve retornar erro específico para campo obrigatório ausente', () => {
        // Arrange
        const schema = z.object({
            requiredField: z.string(),
        });

        mockRequest.body = {}; // campo obrigatório ausente

        // Act
        const middleware = validate(schema);
        middleware(
            mockRequest as Request,
            mockResponse as Response,
            mockNext as NextFunction
        );

        // Assert
        expect(mockNext).not.toHaveBeenCalled();
        expect(mockStatus).toHaveBeenCalledWith(400);
        expect(mockJson).toHaveBeenCalledWith(
            expect.objectContaining({
                status: 'error',
                message: 'Validation failed',
                errors: expect.arrayContaining([
                    expect.objectContaining({
                        field: 'requiredField',
                        message: expect.any(String),
                        code: expect.any(String)
                    })
                ])
            })
        );
    });
});
