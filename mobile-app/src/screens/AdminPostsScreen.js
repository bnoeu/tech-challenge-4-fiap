import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { postsApi } from '../api/api';

export default function AdminPostsScreen({ navigation }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await postsApi.getAll();
      setPosts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const handleDelete = (item) => {
    Alert.alert('Excluir post', `Excluir "${item.title}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await postsApi.remove(item._id);
            load();
          } catch (err) {
            Alert.alert('Erro', err.message);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.newButton} onPress={() => navigation.navigate('PostForm')}>
        <Text style={styles.newButtonText}>+ Novo Post</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator style={{ marginTop: 20 }} size="large" color="#6c63ff" />}
      {!!error && <Text style={styles.error}>{error}</Text>}

      <FlatList
        data={posts}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.subtitle}>{item.author}</Text>
            </View>
            <TouchableOpacity
              style={[styles.actionBtn, styles.editBtn]}
              onPress={() => navigation.navigate('PostForm', { id: item._id })}
            >
              <Text style={styles.actionText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, styles.deleteBtn]} onPress={() => handleDelete(item)}>
              <Text style={styles.actionText}>Excluir</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f6fa' },
  newButton: { backgroundColor: '#6c63ff', margin: 16, padding: 12, borderRadius: 10, alignItems: 'center' },
  newButtonText: { color: '#fff', fontWeight: '700' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 12,
    borderRadius: 10,
    gap: 8,
  },
  title: { fontSize: 15, fontWeight: '700', color: '#1a1a2e' },
  subtitle: { fontSize: 12, color: '#888' },
  actionBtn: { paddingHorizontal: 10, paddingVertical: 8, borderRadius: 8 },
  editBtn: { backgroundColor: '#e8e6ff' },
  deleteBtn: { backgroundColor: '#fde8e8' },
  actionText: { fontSize: 12, fontWeight: '700' },
  error: { color: '#e74c3c', textAlign: 'center', marginTop: 16 },
});
