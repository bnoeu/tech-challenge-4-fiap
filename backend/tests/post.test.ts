import request from 'supertest';
import app from '../src/app';

jest.mock('../src/modules/post/post.model', () => ({
    Post: {
        find: jest.fn(),
        findById: jest.fn(),
        create: jest.fn(),
        findByIdAndUpdate: jest.fn(),
        findByIdAndDelete: jest.fn()
    }
}));

import { Post } from '../src/modules/post/post.model';
import { signToken } from '../src/utils/jwt';

// Token de professor válido, usado nas rotas que agora exigem autenticação
const authToken = signToken({
    id: 'teacher-id-123',
    email: 'professor@example.com',
    name: 'Professor Teste',
    role: 'teacher'
});

describe('Posts API', () => {

    // 🔹 GET ALL
    describe('GET /posts', () => {

        it('deve retornar lista vazia', async () => {
            (Post.find as jest.Mock).mockResolvedValue([]);

            const res = await request(app).get('/posts');

            expect(res.status).toBe(200);
            expect(res.body).toEqual([]);
        });

        it('deve retornar lista com posts', async () => {
            const mockData = [{ title: 'Teste' }];

            (Post.find as jest.Mock).mockResolvedValue(mockData);

            const res = await request(app).get('/posts');

            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockData);
        });

    });

    // 🔹 GET BY ID
    describe('GET /posts/:id', () => {

        it('deve retornar um post', async () => {
            (Post.findById as jest.Mock).mockResolvedValue({ title: 'Post' });

            const res = await request(app).get('/posts/123');

            expect(res.status).toBe(200);
        });

        it('deve retornar 404 se não encontrar', async () => {
            (Post.findById as jest.Mock).mockResolvedValue(null);

            const res = await request(app).get('/posts/123');

            expect(res.status).toBe(404);
        });

    });

    // 🔹 CREATE
    describe('POST /posts', () => {

        it('deve criar um post', async () => {
            (Post.create as jest.Mock).mockResolvedValue({ title: 'Novo' });

            const res = await request(app)
                .post('/posts')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    title: 'Novo',
                    content: 'Conteúdo',
                    author: 'Graci'
                });

            expect(res.status).toBe(201);
        });

        it('deve retornar erro se faltar dados', async () => {
            const res = await request(app)
                .post('/posts')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ title: 'Faltando' });

            expect(res.status).toBe(400);
        });

        it('deve retornar 401 se não estiver autenticado', async () => {
            const res = await request(app)
                .post('/posts')
                .send({ title: 'Sem token', content: 'x', author: 'y' });

            expect(res.status).toBe(401);
        });

    });

    // 🔹 UPDATE
    describe('PUT /posts/:id', () => {

        it('deve atualizar um post', async () => {
            (Post.findByIdAndUpdate as jest.Mock).mockResolvedValue({ title: 'Atualizado' });

            const res = await request(app)
                .put('/posts/123')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ title: 'Atualizado' });

            expect(res.status).toBe(200);
        });

        it('deve retornar 404 se não existir', async () => {
            (Post.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

            const res = await request(app)
                .put('/posts/123')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ title: 'Atualizado' });

            expect(res.status).toBe(404);
        });

    });

    // 🔹 DELETE
    describe('DELETE /posts/:id', () => {

        it('deve deletar um post', async () => {
            (Post.findByIdAndDelete as jest.Mock).mockResolvedValue({});

            const res = await request(app)
                .delete('/posts/123')
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.status).toBe(200);
        });

        it('deve retornar 404 se não existir', async () => {
            (Post.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

            const res = await request(app)
                .delete('/posts/123')
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.status).toBe(404);
        });

    });

    // 🔹 SEARCH
    describe('GET /posts/search', () => {

        it('deve retornar resultados', async () => {
            (Post.find as jest.Mock).mockResolvedValue([{ title: 'match' }]);

            const res = await request(app).get('/posts/search?q=teste');

            expect(res.status).toBe(200);
        });

        it('deve retornar erro se query inválida', async () => {
            const res = await request(app).get('/posts/search');

            expect(res.status).toBe(400);
        });

    });

});