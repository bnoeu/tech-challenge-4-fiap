import 'dotenv/config';
import app from './app';
import { connectDB } from './config/database';

if (process.env.NODE_ENV !== 'test') {
    connectDB();
}

app.listen(process.env.PORT, () => {
    console.log('Servidor rodando');
});
