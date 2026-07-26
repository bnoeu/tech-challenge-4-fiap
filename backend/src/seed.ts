import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { connectDB } from './config/database';
import { Teacher } from './modules/teacher/teacher.model';
import mongoose from 'mongoose';

// Uso: npm run seed
// Cria um professor inicial para permitir o primeiro login.
// Sem isso, ninguém consegue logar (pois criar professor exige estar logado).
const run = async () => {
    await connectDB();

    const email = 'professor@example.com';
    const existing = await Teacher.findOne({ email });

    if (existing) {
        console.log('Professor inicial já existe:', email);
    } else {
        const password = await bcrypt.hash('123456', 10);
        await Teacher.create({ name: 'Professor Padrão', email, password });
        console.log('Professor inicial criado com sucesso!');
        console.log('E-mail:', email);
        console.log('Senha: 123456');
    }

    await mongoose.disconnect();
    process.exit(0);
};

run().catch((err) => {
    console.error('Erro ao rodar seed:', err);
    process.exit(1);
});
