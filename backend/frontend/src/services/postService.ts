import api from './api';
import type { Post, PostFormData } from '../types';

export const postService = {
  async getAll(): Promise<Post[]> {
    const { data } = await api.get<Post[]>('/posts');
    return data;
  },

  async getById(id: string): Promise<Post> {
    const { data } = await api.get<Post>(`/posts/${id}`);
    return data;
  },

  async search(query: string): Promise<Post[]> {
    const { data } = await api.get<Post[]>('/posts/search', {
      params: { q: query },
    });
    return data;
  },

  async create(payload: PostFormData): Promise<Post> {
    const { data } = await api.post<Post>('/posts', payload);
    return data;
  },

  async update(id: string, payload: Partial<PostFormData>): Promise<Post> {
    const { data } = await api.put<Post>(`/posts/${id}`, payload);
    return data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/posts/${id}`);
  },
};
