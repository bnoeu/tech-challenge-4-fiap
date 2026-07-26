import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';

import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import PostListScreen from '../screens/PostListScreen';
import PostDetailScreen from '../screens/PostDetailScreen';
import PostFormScreen from '../screens/PostFormScreen';
import AdminPostsScreen from '../screens/AdminPostsScreen';
import PeopleListScreen from '../screens/PeopleListScreen';
import PeopleFormScreen from '../screens/PeopleFormScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#6c63ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerTintColor: '#1a1a2e' }}>
        {!user ? (
          // Não logado: só a tela de login (mas o "aluno" também vira um "user" local, sem senha)
          <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Entrar' }} />
        ) : (
          <>
            <Stack.Screen name="Posts" component={PostListScreen} options={{ title: 'Blog' }} />
            <Stack.Screen name="PostDetail" component={PostDetailScreen} options={{ title: 'Post' }} />

            {/* Rotas abaixo só são navegáveis por professores — os botões que levam a elas
                já ficam escondidos para alunos em PostListScreen, e o back-end também
                rejeita (401/403) qualquer chamada de escrita sem token válido. */}
            <Stack.Screen name="PostForm" component={PostFormScreen} options={{ title: 'Post' }} />
            <Stack.Screen name="AdminPosts" component={AdminPostsScreen} options={{ title: 'Administração' }} />

            <Stack.Screen
              name="TeacherList"
              component={PeopleListScreen}
              initialParams={{ type: 'teacher' }}
              options={{ title: 'Professores' }}
            />
            <Stack.Screen
              name="TeacherForm"
              component={PeopleFormScreen}
              initialParams={{ type: 'teacher' }}
              options={{ title: 'Professor' }}
            />
            <Stack.Screen
              name="StudentList"
              component={PeopleListScreen}
              initialParams={{ type: 'student' }}
              options={{ title: 'Alunos' }}
            />
            <Stack.Screen
              name="StudentForm"
              component={PeopleFormScreen}
              initialParams={{ type: 'student' }}
              options={{ title: 'Aluno' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
