import { Request, Response } from 'express';
import { Student } from './student.model';

// 🔹 GET /students?page=1&limit=10
export const getAllStudents = async (req: Request, res: Response) => {
    try {
        const page = Math.max(1, parseInt(req.query.page as string) || 1);
        const limit = Math.max(1, parseInt(req.query.limit as string) || 10);
        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            Student.find().skip(skip).limit(limit),
            Student.countDocuments()
        ]);

        res.json({
            data,
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar alunos' });
    }
};

// 🔹 GET /students/:id
export const getStudentById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data = await Student.findById(id);

        if (!data) {
            return res.status(404).json({ message: 'Aluno não encontrado' });
        }

        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar aluno' });
    }
};

// 🔹 POST /students
export const createStudent = async (req: Request, res: Response) => {
    try {
        const { name, email, registrationNumber } = req.body;

        if (!name || !email || !registrationNumber) {
            return res.status(400).json({
                message: 'Nome, e-mail e matrícula são obrigatórios'
            });
        }

        const existing = await Student.findOne({ email: email.toLowerCase() });
        if (existing) {
            return res.status(409).json({ message: 'Já existe um aluno com este e-mail' });
        }

        const data = await Student.create({ name, email, registrationNumber });

        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar aluno' });
    }
};

// 🔹 PUT /students/:id
export const updateStudent = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const data = await Student.findByIdAndUpdate(id, req.body, { new: true });

        if (!data) {
            return res.status(404).json({ message: 'Aluno não encontrado' });
        }

        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar aluno' });
    }
};

// 🔹 DELETE /students/:id
export const deleteStudent = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data = await Student.findByIdAndDelete(id);

        if (!data) {
            return res.status(404).json({ message: 'Aluno não encontrado' });
        }

        res.json({ message: 'Aluno removido com sucesso' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao remover aluno' });
    }
};
