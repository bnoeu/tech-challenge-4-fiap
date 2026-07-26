import request from 'supertest';
import bcrypt from 'bcryptjs';
import app from '../src/app';

jest.mock('../src/modules/teacher/teacher.model', () => ({
    Teacher: {
        findOne: jest.fn()
    }
}));

import { Teacher } from '../src/modules/teacher/teacher.model';

describe('Auth API', () => {

    describe('POST /auth/login', () => {

        it('deve autenticar com credenciais válidas e retornar um token', async () => {
            const hashedPassword = await bcrypt.hash('123456', 10);

            (Teacher.findOne as jest.Mock).mockReturnValue({
                select: jest.fn().mockResolvedValue({
                    id: 'abc123',
                    name: 'Professor Teste',
                    email: 'professor@example.com',
                    password: hashedPassword
                })
            });

            const res = await request(app)
                .post('/auth/login')
                .send({ email: 'professor@example.com', password: '123456' });

            expect(res.status).toBe(200);
            expect(res.body.token).toBeDefined();
            expect(res.body.user.role).toBe('teacher');
        });

        it('deve retornar 401 para senha incorreta', async () => {
            const hashedPassword = await bcrypt.hash('123456', 10);

            (Teacher.findOne as jest.Mock).mockReturnValue({
                select: jest.fn().mockResolvedValue({
                    id: 'abc123',
                    name: 'Professor Teste',
                    email: 'professor@example.com',
                    password: hashedPassword
                })
            });

            const res = await request(app)
                .post('/auth/login')
                .send({ email: 'professor@example.com', password: 'senha-errada' });

            expect(res.status).toBe(401);
        });

        it('deve retornar 401 para e-mail inexistente', async () => {
            (Teacher.findOne as jest.Mock).mockReturnValue({
                select: jest.fn().mockResolvedValue(null)
            });

            const res = await request(app)
                .post('/auth/login')
                .send({ email: 'naoexiste@example.com', password: '123456' });

            expect(res.status).toBe(401);
        });

        it('deve retornar 400 se faltar e-mail ou senha', async () => {
            const res = await request(app)
                .post('/auth/login')
                .send({ email: 'professor@example.com' });

            expect(res.status).toBe(400);
        });

    });

});
