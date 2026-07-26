import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import { postsApi } from '../api/api';
import { useAuth } from '../context/AuthContext';

export default function PostFormScreen({ route, navigation }) {
  const editingId = route.params?.id; // se vier um id, estamos editando
  const isEditing = !!editingId;
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState(isEditing ? '' : user?.name || '');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    navigation.setOptions({ title: isEditing ? 'Editar Post' : 'Novo Post' });
    if (isEditing) {
      postsApi
        .getById(editingId)
        .then(({ data }) => {
          setTitle(data.title);
          setAuthor(data.author);
          setContent(data.content);
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [editingId]);

  const handleSubmit = async () => {
    if (!title.trim() || !author.trim() || !content.trim()) {
      setError('Preencha todos os campos.');
      return;
    }
    setError('');
    setSaving(true);
    try {
      const payload = { title: title.trim(), author: author.trim(), content: content.trim() };
      if (isEditing) {
        await postsApi.update(editingId, payload);
      } else {
        await postsApi.create(payload);
      }
      navigation.goBack();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} size="large" color="#6c63ff" />;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      <Text style={styles.label}>Título</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Título do post" />

      <Text style={styles.label}>Autor</Text>
      <TextInput style={styles.input} value={author} onChangeText={setAuthor} placeholder="Nome do autor" />

      <Text style={styles.label}>Conteúdo</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={content}
        onChangeText={setContent}
        placeholder="Escreva o conteúdo do post..."
        multiline
        textAlignVertical="top"
      />

      {!!error && <Text style={styles.error}>{error}</Text>}

      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={saving}>
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>{isEditing ? 'Salvar alterações' : 'Publicar post'}</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  label: { fontSize: 13, fontWeight: '700', color: '#555', marginBottom: 6, marginTop: 14 },
  input: {
    backgroundColor: '#f5f6fa',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  textArea: { minHeight: 160 },
  button: {
    backgroundColor: '#6c63ff',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: { color: '#fff', fontWeight: '700' },
  error: { color: '#e74c3c', marginTop: 10, textAlign: 'center' },
});
