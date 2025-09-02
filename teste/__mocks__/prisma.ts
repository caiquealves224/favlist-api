/* eslint-disable @typescript-eslint/no-explicit-any */
import { jest } from '@jest/globals';

export const mockPrisma = {
    client: {
        findFirst: jest.fn<any>().mockReturnValue(null),
        findUnique: jest.fn<any>().mockReturnValue(null),
        findMany: jest.fn<any>().mockReturnValue([]),
        create: jest.fn<any>().mockImplementation((data: any) => ({ id: '1', ...data.data })),
        update: jest.fn<any>().mockImplementation((params: any) => ({ id: params.where.id, ...params.data })),
        delete: jest.fn<any>().mockImplementation((params: any) => ({ id: params.where.id })),
        count: jest.fn<any>().mockReturnValue(0),
    },
    favorite: {
        findFirst: jest.fn<any>().mockReturnValue(null),
        findUnique: jest.fn<any>().mockReturnValue(null),
        findMany: jest.fn<any>().mockReturnValue([]),
        create: jest.fn<any>().mockImplementation((data: any) => ({ id: '1', ...data.data })),
        update: jest.fn<any>().mockImplementation((params: any) => ({ id: params.where.id, ...params.data })),
        delete: jest.fn<any>().mockImplementation((params: any) => ({ id: params.where.id })),
    },
};

export default mockPrisma;
