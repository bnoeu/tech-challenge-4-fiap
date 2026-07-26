import mongoose, { Document } from 'mongoose';

export interface IStudent extends Document {
    name: string;
    email: string;
    registrationNumber: string;
    createdAt: Date;
    updatedAt: Date;
}

const studentSchema = new mongoose.Schema<IStudent>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    // Número de matrícula (RA) do aluno
    registrationNumber: { type: String, required: true }
}, { timestamps: true });

export const Student = mongoose.model<IStudent>('Student', studentSchema);
