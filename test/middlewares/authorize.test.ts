/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { Request, Response, NextFunction } from 'express';
import { authorize } from '../../src/middlewares/auth/authorize';

describe('Authorize Middleware', () => {
    let mockRequest: Partial<Request> & { user?: any };
    let mockResponse: Partial<Response>;
    let mockNext: jest.Mock;
    let mockJson: jest.Mock;
    let mockStatus: jest.Mock;

    beforeEach(() => {
        mockJson = jest.fn();
        mockStatus = jest.fn().mockReturnValue({ json: mockJson });
        mockNext = jest.fn();

        mockRequest = {
            user: undefined,
        };

        mockResponse = {
            status: mockStatus as any,
            json: mockJson as any,
        };

        jest.clearAllMocks();
    });

    it('deve chamar next() quando usuário tem role autorizada', () => {
        // Arrange
        const allowedRoles = ['ADMIN', 'USER'];
        mockRequest.user = {
            id: '1',
            role: 'ADMIN',
            email: 'admin@test.com'
        };

        // Act
        const middleware = authorize(allowedRoles);
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

    it('deve retornar 401 quando usuário não está autenticado', () => {
        // Arrange
        const allowedRoles = ['ADMIN'];
        mockRequest.user = undefined; // usuário não autenticado

        // Act
        const middleware = authorize(allowedRoles);
        middleware(
            mockRequest as Request,
            mockResponse as Response,
            mockNext as NextFunction
        );

        // Assert
        expect(mockNext).not.toHaveBeenCalled();
        expect(mockStatus).toHaveBeenCalledWith(401);
        expect(mockJson).toHaveBeenCalledWith({
            message: 'Not authenticated'
        });
    });

    it('deve retornar 403 quando usuário não tem role autorizada', () => {
        // Arrange
        const allowedRoles = ['ADMIN'];
        mockRequest.user = {
            id: '1',
            role: 'USER', // role não autorizada
            email: 'user@test.com'
        };

        // Act
        const middleware = authorize(allowedRoles);
        middleware(
            mockRequest as Request,
            mockResponse as Response,
            mockNext as NextFunction
        );

        // Assert
        expect(mockNext).not.toHaveBeenCalled();
        expect(mockStatus).toHaveBeenCalledWith(403);
        expect(mockJson).toHaveBeenCalledWith({
            message: 'Forbidden: insufficient permissions'
        });
    });

    it('deve autorizar quando role de usuário está na lista de roles permitidas', () => {
        // Arrange
        const allowedRoles = ['ADMIN', 'MODERATOR', 'USER'];
        mockRequest.user = {
            id: '2',
            role: 'MODERATOR',
            email: 'mod@test.com'
        };

        // Act
        const middleware = authorize(allowedRoles);
        middleware(
            mockRequest as Request,
            mockResponse as Response,
            mockNext as NextFunction
        );

        // Assert
        expect(mockNext).toHaveBeenCalledTimes(1);
        expect(mockStatus).not.toHaveBeenCalled();
    });

    it('deve funcionar com array de uma única role', () => {
        // Arrange
        const allowedRoles = ['ADMIN'];
        mockRequest.user = {
            id: '3',
            role: 'ADMIN',
            email: 'admin@test.com'
        };

        // Act
        const middleware = authorize(allowedRoles);
        middleware(
            mockRequest as Request,
            mockResponse as Response,
            mockNext as NextFunction
        );

        // Assert
        expect(mockNext).toHaveBeenCalledTimes(1);
    });

    it('deve rejeitar quando role não coincide exatamente (case sensitive)', () => {
        // Arrange
        const allowedRoles = ['ADMIN'];
        mockRequest.user = {
            id: '4',
            role: 'admin', // case diferente
            email: 'admin@test.com'
        };

        // Act
        const middleware = authorize(allowedRoles);
        middleware(
            mockRequest as Request,
            mockResponse as Response,
            mockNext as NextFunction
        );

        // Assert
        expect(mockNext).not.toHaveBeenCalled();
        expect(mockStatus).toHaveBeenCalledWith(403);
        expect(mockJson).toHaveBeenCalledWith({
            message: 'Forbidden: insufficient permissions'
        });
    });

    it('deve lidar com usuário sem propriedade role', () => {
        // Arrange
        const allowedRoles = ['USER'];
        mockRequest.user = {
            id: '5',
            email: 'user@test.com'
            // role ausente
        };

        // Act
        const middleware = authorize(allowedRoles);
        middleware(
            mockRequest as Request,
            mockResponse as Response,
            mockNext as NextFunction
        );

        // Assert
        expect(mockNext).not.toHaveBeenCalled();
        expect(mockStatus).toHaveBeenCalledWith(403);
        expect(mockJson).toHaveBeenCalledWith({
            message: 'Forbidden: insufficient permissions'
        });
    });

    it('deve autorizar múltiplas roles diferentes', () => {
        // Arrange
        const allowedRoles = ['SUPER_ADMIN', 'ADMIN', 'EDITOR'];
        
        const testCases = [
            { role: 'SUPER_ADMIN', shouldPass: true },
            { role: 'ADMIN', shouldPass: true },
            { role: 'EDITOR', shouldPass: true },
            { role: 'USER', shouldPass: false },
            { role: 'GUEST', shouldPass: false }
        ];

        testCases.forEach(({ role, shouldPass }) => {
            // Reset mocks
            jest.clearAllMocks();
            
            mockRequest.user = {
                id: '6',
                role,
                email: 'test@test.com'
            };

            // Act
            const middleware = authorize(allowedRoles);
            middleware(
                mockRequest as Request,
                mockResponse as Response,
                mockNext as NextFunction
            );

            // Assert
            if (shouldPass) {
                expect(mockNext).toHaveBeenCalledTimes(1);
                expect(mockStatus).not.toHaveBeenCalled();
            } else {
                expect(mockNext).not.toHaveBeenCalled();
                expect(mockStatus).toHaveBeenCalledWith(403);
            }
        });
    });

    it('deve lidar com array vazio de roles', () => {
        // Arrange
        const allowedRoles: string[] = [];
        mockRequest.user = {
            id: '7',
            role: 'ADMIN',
            email: 'admin@test.com'
        };

        // Act
        const middleware = authorize(allowedRoles);
        middleware(
            mockRequest as Request,
            mockResponse as Response,
            mockNext as NextFunction
        );

        // Assert
        expect(mockNext).not.toHaveBeenCalled();
        expect(mockStatus).toHaveBeenCalledWith(403);
        expect(mockJson).toHaveBeenCalledWith({
            message: 'Forbidden: insufficient permissions'
        });
    });
});
