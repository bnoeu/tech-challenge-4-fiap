import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi } from '../api/api';

const AuthContext = createContext(null);

const TOKEN_KEY = '@blog:token';
const USER_KEY = '@blog:user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { id, name, email, role: 'teacher' }
  const [loading, setLoading] = useState(true); // true enquanto lê o storage na inicialização

  // Ao abrir o app, tenta restaurar a sessão salva
  useEffect(() => {
    (async () => {
      try {
        const storedUser = await AsyncStorage.getItem(USER_KEY);
        const storedToken = await AsyncStorage.getItem(TOKEN_KEY);
        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Login: só professores possuem senha e conseguem logar.
  // Alunos usam o app sem autenticação, com acesso somente leitura.
  const login = async (email, password) => {
    const { data } = await authApi.login(email, password);
    await AsyncStorage.setItem(TOKEN_KEY, data.token);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  // "Entrar como aluno": não chama a API, só marca o papel localmente,
  // já que alunos não autenticam (apenas visualizam conteúdo).
  const continueAsStudent = async () => {
    const guestUser = { role: 'student', name: 'Aluno(a)' };
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(guestUser));
    await AsyncStorage.removeItem(TOKEN_KEY);
    setUser(guestUser);
    return guestUser;
  };

  const logout = async () => {
    await AsyncStorage.removeItem(TOKEN_KEY);
    await AsyncStorage.removeItem(USER_KEY);
    setUser(null);
  };

  const isTeacher = user?.role === 'teacher';

  return (
    <AuthContext.Provider
      value={{ user, loading, isTeacher, login, continueAsStudent, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook de conveniência: const { user, login, logout } = useAuth();
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>');
  return ctx;
}
