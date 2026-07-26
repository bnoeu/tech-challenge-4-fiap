import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  FlatList,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { postsApi } from '../api/api';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import SearchBar from '../components/SearchBar';

export default function PostListScreen({ navigation }) {
  const { isTeacher, logout } = useAuth();
  const [posts, setPosts] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadPosts = useCallback(async (q = '') => {
    setLoading(true);
    setError('');
    try {
      const { data } = q ? await postsApi.search(q) : await postsApi.getAll();
      setPosts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Recarrega a lista sempre que a tela ganha foco (ex: voltar de criar/editar um post)
  useFocusEffect(
    useCallback(() => {
      loadPosts(query);
    }, [loadPosts])
  );

  useEffect(() => {
    const timeout = setTimeout(() => loadPosts(query), 400); // debounce da busca
    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <View style={styles.container}>
      <SearchBar value={query} onChangeText={setQuery} placeholder="Buscar posts por palavra-chave" />

      {isTeacher && (
        <View style={styles.teacherBar}>
          <TouchableOpacity style={styles.pill} onPress={() => navigation.navigate('PostForm')}>
            <Text style={styles.pillText}>+ Novo Post</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.pill} onPress={() => navigation.navigate('AdminPosts')}>
            <Text style={styles.pillText}>Admin</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.pill} onPress={() => navigation.navigate('TeacherList')}>
            <Text style={styles.pillText}>Professores</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.pill} onPress={() => navigation.navigate('StudentList')}>
            <Text style={styles.pillText}>Alunos</Text>
          </TouchableOpacity>
        </View>
      )}

      {loading && <ActivityIndicator style={{ marginTop: 20 }} size="large" color="#6c63ff" />}
      {!!error && <Text style={styles.error}>{error}</Text>}

      {!loading && posts.length === 0 && !error && (
        <Text style={styles.empty}>Nenhum post encontrado.</Text>
      )}

      <FlatList
        data={posts}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <PostCard post={item} onPress={() => navigation.navigate('PostDetail', { id: item._id })} />
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <TouchableOpacity style={styles.logout} onPress={logout}>
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f6fa' },
  teacherBar: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, gap: 8, marginBottom: 4 },
  pill: {
    backgroundColor: '#e8e6ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 6,
    marginBottom: 6,
  },
  pillText: { color: '#6c63ff', fontWeight: '700', fontSize: 12 },
  error: { color: '#e74c3c', textAlign: 'center', marginTop: 16 },
  empty: { textAlign: 'center', color: '#999', marginTop: 30 },
  logout: { alignItems: 'center', paddingVertical: 10 },
  logoutText: { color: '#e74c3c', fontWeight: '600' },
});
