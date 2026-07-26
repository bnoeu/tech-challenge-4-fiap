import { Request, Response } from 'express';
import { Post } from './post.model';

// 🔹 GET /posts
export const getAllPosts = async (req: Request, res: Response) => {
    try {
        const data = await Post.find();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar posts' });
    }
};

// 🔹 GET /posts/:id
export const getPostById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const data = await Post.findById(id);

        if (!data) {
            return res.status(404).json({ message: 'Post não encontrado' });
        }

        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar post' });
    }
};

// 🔹 POST /posts
export const createPost = async (req: Request, res: Response) => {
    try {
        const { title, content, author } = req.body;

        if (!title || !content || !author) {
            return res.status(400).json({
                message: 'Título, conteúdo e autor são obrigatórios'
            });
        }

        const data = await Post.create({ title, content, author });

        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar post' });
    }
};

// 🔹 PUT /posts/:id
export const updatePost = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const data = await Post.findByIdAndUpdate(id, req.body, {
            new: true
        });

        if (!data) {
            return res.status(404).json({ message: 'Post não encontrado' });
        }

        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar post' });
    }
};

// 🔹 DELETE /posts/:id
export const deletePost = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const data = await Post.findByIdAndDelete(id);

        if (!data) {
            return res.status(404).json({ message: 'Post não encontrado' });
        }

        res.json({ message: 'Post removido com sucesso' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao remover post' });
    }
};

// 🔹 GET /posts/search?q=termo
export const searchPosts = async (req: Request, res: Response) => {
    try {
        const q = req.query.q;

        if (!q || typeof q !== 'string') {
            return res.status(400).json({ message: 'Query inválida' });
        }

        const data = await Post.find({
            $or: [
                { title: { $regex: q, $options: 'i' } },
                { content: { $regex: q, $options: 'i' } }
            ]
        });

        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Erro na busca de posts' });
    }
};