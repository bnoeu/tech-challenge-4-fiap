import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { teachersApi, studentsApi } from '../api/api';

// Tela reutilizada tanto para "Professores" quanto para "Alunos".
// route.params.type deve ser 'teacher' ou 'student'.
export default function PeopleListScreen({ route, navigation }) {
  const { type } = route.params; // 'teacher' | 'student'
  const api = type === 'teacher' ? teachersApi : studentsApi;
  const labelSingular = type === 'teacher' ? 'Professor' : 'Aluno';
  const formRoute = type === 'teacher' ? 'TeacherForm' : 'StudentForm';

  const [people, setPeople] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(
    async (targetPage = 1) => {
      setLoading(true);
      setError('');
      try {
        const { data } = await api.getAll(targetPage, 10);
        setPeople(data.data);
        setPage(data.page);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [type]
  );

  useFocusEffect(
    useCallback(() => {
      load(1);
    }, [load])
  );

  const handleDelete = (item) => {
    Alert.alert(`Excluir ${labelSingular.toLowerCase()}`, `Excluir "${item.name}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.remove(item._id);
            load(page);
          } catch (err) {
            Alert.alert('Erro', err.message);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.newButton} onPress={() => navigation.navigate(formRoute)}>
        <Text style={styles.newButtonText}>+ Novo(a) {labelSingular}</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator style={{ marginTop: 20 }} size="large" color="#6c63ff" />}
      {!!error && <Text style={styles.error}>{error}</Text>}

      <FlatList
        data={people}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{item.name}</Text>
              <Text style={styles.subtitle}>{item.email}</Text>
              {type === 'student' && <Text style={styles.subtitle}>RA: {item.registrationNumber}</Text>}
            </View>
            <TouchableOpacity
              style={[styles.actionBtn, styles.editBtn]}
              onPress={() => navigation.navigate(formRoute, { id: item._id })}
            >
              <Text style={styles.actionText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, styles.deleteBtn]} onPress={() => handleDelete(item)}>
              <Text style={styles.actionText}>Excluir</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {totalPages > 1 && (
        <View style={styles.pagination}>
          <TouchableOpacity disabled={page <= 1} onPress={() => load(page - 1)}>
            <Text style={[styles.pageBtn, page <= 1 && styles.pageBtnDisabled]}>‹ Anterior</Text>
          </TouchableOpacity>
          <Text style={styles.pageInfo}>
            Página {page} de {totalPages}
          </Text>
          <TouchableOpacity disabled={page >= totalPages} onPress={() => load(page + 1)}>
            <Text style={[styles.pageBtn, page >= totalPages && styles.pageBtnDisabled]}>Próxima ›</Text>
          </TouchableOpacity>
        </View>
      )}
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
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    backgroundColor: '#fff',
  },
  pageBtn: { color: '#6c63ff', fontWeight: '700' },
  pageBtnDisabled: { color: '#ccc' },
  pageInfo: { color: '#666', fontSize: 12 },
});
