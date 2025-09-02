import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

// Em carater de exemplo, um usuário fixo
const MOCK_USER = {
    id: 1,
    username: 'admin',
    password: 'admin',
    role: 'admin',
};

export class LoginController {
    public handler(req: Request, res: Response): Response {
        const { username, password } = req.body;

        // 1. Verifica se credenciais batem
        if (
            username !== MOCK_USER.username ||
            password !== MOCK_USER.password
        ) {
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }

        // 2. Gera token JWT
        const token = jwt.sign(
            { id: MOCK_USER.id, role: MOCK_USER.role },
            process.env.JWT_SECRET as string
        );

        // 3. Retorna token
        return res.json({
            message: 'Login bem-sucedido',
            token,
            user: {
                id: MOCK_USER.id,
                username: MOCK_USER.username,
                role: MOCK_USER.role,
            },
        });
    }
}
