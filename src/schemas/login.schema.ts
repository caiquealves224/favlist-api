import { z } from 'zod';

export const loginSchema = z.object({
    username: z.string('Username deve ser uma string').trim(),
    password: z.string('Password deve ser uma string').trim(),
});

export type LoginInput = z.infer<typeof loginSchema>;
