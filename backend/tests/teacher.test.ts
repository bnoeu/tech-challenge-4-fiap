import request from 'supertest';
import app from '../src/app';
import { signToken } from '../src/utils/jwt';

jest.mock('../src/modules/teacher/teacher.model', () => ({
    Teacher: {
        find: jest.fn(),
        findOne: jest.fn(),
        findById: jest.fn(),
        create: jest.fn(),
        findByIdAndUpdate: jest.fn(),
        findByIdAndDelete: jest.fn(),
        countDocuments: jest.fn()
    }
}));

import { Teacher } from '../src/modules/teacher/teacher.model';

const authToken = signToken({
    id: 'teacher-id-123',
    email: 'professor@example.com',
    name: 'Professor Teste',
    role: 'teacher'
});

describe('Teachers API', () => {

    describe('GET /teachers', () => {

        it('deve retornar 401 sem token', async () => {
            const res = await request(app).get('/teachers');
            expect(res.status).toBe(401);
        });

        it('deve retornar lista paginada de professores', async () => {
            (Teacher.find as jest.Mock).mockReturnValue({
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockResolvedValue([{ name: 'Prof A' }])
            });
            (Teacher.countDocuments as jest.Mock).mockResolvedValue(1);

            const res = await request(app)
                .get('/teachers')
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.status).toBe(200);
            expect(res.body.data).toHaveLength(1);
            expect(res.body.total).toBe(1);
        });

    });

    describe('POST /teachers', () => {

        it('deve criar um professor', async () => {
            (Teacher.findOne as jest.Mock).mockResolvedValue(null);
            (Teacher.create as jest.Mock).mockResolvedValue({
                toObject: () => ({
                    name: 'Novo Professor',
                    email: 'novo@example.com',
                    password: 'hash-nao-deve-aparecer'
                })
            });

            const res = await request(app)
                .post('/teachers')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ name: 'Novo Professor', email: 'novo@example.com', password: '123456' });

            expect(res.status).toBe(201);
            expect(res.body.password).toBeUndefined();
        });

        it('deve retornar 409 se e-mail já existir', async () => {
            (Teacher.findOne as jest.Mock).mockResolvedValue({ email: 'existente@example.com' });

            const res = await request(app)
                .post('/teachers')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ name: 'X', email: 'existente@example.com', password: '123456' });

            expect(res.status).toBe(409);
        });

        it('deve retornar 400 se faltar dados', async () => {
            const res = await request(app)
                .post('/teachers')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ name: 'Sem email' });

            expect(res.status).toBe(400);
        });

    });

    describe('DELETE /teachers/:id', () => {

        it('deve remover um professor', async () => {
            (Teacher.findByIdAndDelete as jest.Mock).mockResolvedValue({ name: 'Removido' });

            const res = await request(app)
                .delete('/teachers/123')
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.status).toBe(200);
        });

        it('deve retornar 404 se não existir', async () => {
            (Teacher.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

            const res = await request(app)
                .delete('/teachers/123')
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.status).toBe(404);
        });

    });

});
