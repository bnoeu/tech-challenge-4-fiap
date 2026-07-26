import { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../utils/jwt';

// Estende o tipo Request do Express para incluir o usuário autenticado
declare global {
    namespace Express {
        interface Request {
            user?: TokenPayload;
        }
    }
}

// 🔹 Exige um token JWT válido no header "Authorization: Bearer <token>"
// Apenas professores possuem login, então qualquer token válido = professor autenticado.
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token de autenticação ausente' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido ou expirado' });
    }
};
