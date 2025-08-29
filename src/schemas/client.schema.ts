import { z } from 'zod';

export const createClientSchema = z.object({
    name: z
        .string({
            message: 'Nome deve ser uma string',
        })
        .max(100, 'Nome deve ter no máximo 100 caracteres')
        .trim(),

    email: z.email('Email deve ter um formato válido').toLowerCase().trim(),
});

export const updateClientSchema = z.object({
    name: z
        .string()
        .max(100, 'Nome deve ter no máximo 100 caracteres')
        .trim()
        .optional(),

    email: z.email('Email deve ter um formato válido').toLowerCase().trim(),
});

export type CreateClientInput = z.infer<typeof createClientSchema>;
export type UpdateClientInput = z.infer<typeof updateClientSchema>;
