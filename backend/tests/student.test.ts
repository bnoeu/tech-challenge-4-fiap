import request from 'supertest';
import app from '../src/app';
import { signToken } from '../src/utils/jwt';

jest.mock('../src/modules/student/student.model', () => ({
    Student: {
        find: jest.fn(),
        findOne: jest.fn(),
        findById: jest.fn(),
        create: jest.fn(),
        findByIdAndUpdate: jest.fn(),
        findByIdAndDelete: jest.fn(),
        countDocuments: jest.fn()
    }
}));

import { Student } from '../src/modules/student/student.model';

const authToken = signToken({
    id: 'teacher-id-123',
    email: 'professor@example.com',
    name: 'Professor Teste',
    role: 'teacher'
});

describe('Students API', () => {

    describe('GET /students', () => {

        it('deve retornar 401 sem token', async () => {
            const res = await request(app).get('/students');
            expect(res.status).toBe(401);
        });

        it('deve retornar lista paginada de alunos', async () => {
            (Student.find as jest.Mock).mockReturnValue({
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockResolvedValue([{ name: 'Aluno A' }])
            });
            (Student.countDocuments as jest.Mock).mockResolvedValue(1);

            const res = await request(app)
                .get('/students')
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.status).toBe(200);
            expect(res.body.data).toHaveLength(1);
        });

    });

    describe('POST /students', () => {

        it('deve criar um aluno', async () => {
            (Student.findOne as jest.Mock).mockResolvedValue(null);
            (Student.create as jest.Mock).mockResolvedValue({
                name: 'Novo Aluno',
                email: 'aluno@example.com',
                registrationNumber: 'RA123'
            });

            const res = await request(app)
                .post('/students')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ name: 'Novo Aluno', email: 'aluno@example.com', registrationNumber: 'RA123' });

            expect(res.status).toBe(201);
        });

        it('deve retornar 400 se faltar dados', async () => {
            const res = await request(app)
                .post('/students')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ name: 'Sem email' });

            expect(res.status).toBe(400);
        });

    });

    describe('DELETE /students/:id', () => {

        it('deve remover um aluno', async () => {
            (Student.findByIdAndDelete as jest.Mock).mockResolvedValue({ name: 'Removido' });

            const res = await request(app)
                .delete('/students/123')
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.status).toBe(200);
        });

        it('deve retornar 404 se não existir', async () => {
            (Student.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

            const res = await request(app)
                .delete('/students/123')
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.status).toBe(404);
        });

    });

});
