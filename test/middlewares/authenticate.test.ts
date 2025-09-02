/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authenticate } from '../../src/middlewares/auth/authenticate';

// Mock do jsonwebtoken
jest.mock('jsonwebtoken');
const mockJwt = jwt as jest.Mocked<typeof jwt>;

describe('Authenticate Middleware', () => {
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
            headers: {},
        };

        mockResponse = {
            status: mockStatus as any,
            json: mockJson as any,
        };

        jest.clearAllMocks();
        process.env.JWT_SECRET = 'test-secret';
    });

    it('deve chamar next() quando token válido é fornecido', () => {
        // Arrange
        const token = 'valid-token';
        const payload = { id: 1, email: 'user@test.com', role: 'USER' };
        
        mockRequest.headers = {
            authorization: `Bearer ${token}`
        };

        (mockJwt.verify as jest.Mock).mockReturnValue(payload);

        // Act
        authenticate(
            mockRequest as Request,
            mockResponse as Response,
            mockNext as NextFunction
        );

        // Assert
        expect(mockJwt.verify).toHaveBeenCalledWith(token, 'test-secret');
        expect(mockRequest.user).toEqual(payload);
        expect(mockNext).toHaveBeenCalledTimes(1);
        expect(mockStatus).not.toHaveBeenCalled();
    });

    it('deve retornar 401 quando nenhum token é fornecido', () => {
        // Arrange
        mockRequest.headers = {};

        // Act
        authenticate(
            mockRequest as Request,
            mockResponse as Response,
            mockNext as NextFunction
        );

        // Assert
        expect(mockNext).not.toHaveBeenCalled();
        expect(mockStatus).toHaveBeenCalledWith(401);
        expect(mockJson).toHaveBeenCalledWith({
            message: 'No token'
        });
    });

    it('deve retornar 401 quando token é inválido', () => {
        // Arrange
        const invalidToken = 'invalid-token';
        mockRequest.headers = {
            authorization: `Bearer ${invalidToken}`
        };

        (mockJwt.verify as jest.Mock).mockImplementation(() => {
            throw new Error('Token inválido');
        });

        // Act
        authenticate(
            mockRequest as Request,
            mockResponse as Response,
            mockNext as NextFunction
        );

        // Assert
        expect(mockJwt.verify).toHaveBeenCalledWith(invalidToken, 'test-secret');
        expect(mockNext).not.toHaveBeenCalled();
        expect(mockStatus).toHaveBeenCalledWith(401);
        expect(mockJson).toHaveBeenCalledWith({
            message: 'Invalid token'
        });
    });
});
