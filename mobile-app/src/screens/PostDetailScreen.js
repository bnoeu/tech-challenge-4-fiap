import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { postsApi } from '../api/api';
import { useAuth } from '../context/AuthContext';

export default function PostDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const { isTeacher } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);
      postsApi
        .getById(id)
        .then(({ data }) => active && setPost(data))
        .catch((err) => active && setError(err.message))
        .finally(() => active && setLoading(false));
      return () => {
        active = false;
      };
    }, [id])
  );

  const handleDelete = () => {
    Alert.alert('Excluir post', 'Tem certeza que deseja excluir este post?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await postsApi.remove(id);
            navigation.goBack();
          } catch (err) {
            Alert.alert('Erro', err.message);
          }
        },
      },
    ]);
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} size="large" color="#6c63ff" />;
  if (error) return <Text style={styles.error}>{error}</Text>;
  if (!post) return null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      <Text style={styles.title}>{post.title}</Text>
      <Text style={styles.author}>por {post.author}</Text>
      <Text style={styles.content}>{post.content}</Text>

      {isTeacher && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, styles.editButton]}
            onPress={() => navigation.navigate('PostForm', { id: post._id })}
          >
            <Text style={styles.buttonText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDelete}>
            <Text style={styles.buttonText}>Excluir</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: '800', color: '#1a1a2e', marginBottom: 6 },
  author: { fontSize: 14, color: '#6c63ff', fontWeight: '600', marginBottom: 18 },
  content: { fontSize: 16, lineHeight: 24, color: '#333' },
  actions: { flexDirection: 'row', marginTop: 28, gap: 12 },
  button: { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  editButton: { backgroundColor: '#6c63ff' },
  deleteButton: { backgroundColor: '#e74c3c' },
  buttonText: { color: '#fff', fontWeight: '700' },
  error: { color: '#e74c3c', textAlign: 'center', marginTop: 40 },
});
