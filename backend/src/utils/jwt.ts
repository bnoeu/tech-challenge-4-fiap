import jwt from 'jsonwebtoken';

// Em produção, SEMPRE defina JWT_SECRET via variável de ambiente.
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-troque-em-producao';
const JWT_EXPIRES_IN = '8h';

export interface TokenPayload {
    id: string;
    email: string;
    name: string;
    role: 'teacher';
}

export const signToken = (payload: TokenPayload): string => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyToken = (token: string): TokenPayload => {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
};
