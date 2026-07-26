import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { Teacher } from '../teacher/teacher.model';
import { signToken } from '../../utils/jwt';

// 🔹 POST /auth/login
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'E-mail e senha são obrigatórios' });
        }

        // .select('+password') é necessário pois o schema tem select:false no campo
        const teacher = await Teacher.findOne({ email: email.toLowerCase() }).select('+password');

        if (!teacher) {
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }

        const passwordMatches = await bcrypt.compare(password, teacher.password);

        if (!passwordMatches) {
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }

        const token = signToken({
            id: teacher.id,
            email: teacher.email,
            name: teacher.name,
            role: 'teacher'
        });

        res.json({
            token,
            user: {
                id: teacher.id,
                name: teacher.name,
                email: teacher.email,
                role: 'teacher'
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao realizar login' });
    }
};

// 🔹 GET /auth/me — retorna os dados do professor logado a partir do token
export const me = async (req: Request, res: Response) => {
    res.json({ user: req.user });
};
