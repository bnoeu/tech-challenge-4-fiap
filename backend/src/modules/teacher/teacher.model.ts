import mongoose, { Document } from 'mongoose';

export interface ITeacher extends Document {
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}

const teacherSchema = new mongoose.Schema<ITeacher>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    // Hash da senha (nunca armazenamos a senha em texto puro)
    password: { type: String, required: true, select: false }
}, { timestamps: true });

export const Teacher = mongoose.model<ITeacher>('Teacher', teacherSchema);
