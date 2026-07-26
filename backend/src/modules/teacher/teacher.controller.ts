import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { Teacher } from './teacher.model';

const SALT_ROUNDS = 10;

// 🔹 GET /teachers?page=1&limit=10
export const getAllTeachers = async (req: Request, res: Response) => {
    try {
        const page = Math.max(1, parseInt(req.query.page as string) || 1);
        const limit = Math.max(1, parseInt(req.query.limit as string) || 10);
        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            Teacher.find().skip(skip).limit(limit),
            Teacher.countDocuments()
        ]);

        res.json({
            data,
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar professores' });
    }
};

// 🔹 GET /teachers/:id
export const getTeacherById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data = await Teacher.findById(id);

        if (!data) {
            return res.status(404).json({ message: 'Professor não encontrado' });
        }

        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar professor' });
    }
};

// 🔹 POST /teachers
export const createTeacher = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: 'Nome, e-mail e senha são obrigatórios'
            });
        }

        const existing = await Teacher.findOne({ email: email.toLowerCase() });
        if (existing) {
            return res.status(409).json({ message: 'Já existe um professor com este e-mail' });
        }

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const data = await Teacher.create({ name, email, password: hashedPassword });

        // Nunca retornar a senha, nem o hash, na resposta
        const { password: _pw, ...teacherWithoutPassword } = data.toObject();

        res.status(201).json(teacherWithoutPassword);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar professor' });
    }
};

// 🔹 PUT /teachers/:id
export const updateTeacher = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, email, password } = req.body;

        const updateData: Record<string, unknown> = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (password) updateData.password = await bcrypt.hash(password, SALT_ROUNDS);

        const data = await Teacher.findByIdAndUpdate(id, updateData, { new: true });

        if (!data) {
            return res.status(404).json({ message: 'Professor não encontrado' });
        }

        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar professor' });
    }
};

// 🔹 DELETE /teachers/:id
export const deleteTeacher = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data = await Teacher.findByIdAndDelete(id);

        if (!data) {
            return res.status(404).json({ message: 'Professor não encontrado' });
        }

        res.json({ message: 'Professor removido com sucesso' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao remover professor' });
    }
};
