import mongoose, { Document } from 'mongoose';

export interface IPost extends Document {
    title: string;
    content: string;
    author: string;
    createdAt: Date;
    updatedAt: Date;
}

const postSchema = new mongoose.Schema<IPost>({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true }
}, { timestamps: true });

export const Post = mongoose.model<IPost>('Post', postSchema);