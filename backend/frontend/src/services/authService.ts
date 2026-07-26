import type { AuthUser } from '../types';

const MOCK_USERS: Array<AuthUser & { password: string }> = [
  { email: 'professor@example.com', password: '123456',   name: 'Prof. Silva', role: 'professor' },
  { email: 'admin@example.com',     password: 'admin123', name: 'Admin',       role: 'professor' },
  { email: 'aluno@example.com',     password: 'aluno123', name: 'João Aluno',  role: 'aluno'     },
];

const STORAGE_KEY = 'auth_user';

export const authService = {
  login(email: string, password: string): AuthUser {
    const user = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );
    if (!user) throw new Error('Email ou senha inválidos.');
    const { password: _pw, ...authUser } = user;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
    return authUser;
  },

  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
  },

  getCurrentUser(): AuthUser | null {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  },
};
