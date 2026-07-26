import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { teachersApi, studentsApi } from '../api/api';

// Tela reutilizada tanto para "Professores" quanto para "Alunos".
// route.params.type deve ser 'teacher' ou 'student'; route.params.id, se presente, indica edição.
export default function PeopleFormScreen({ route, navigation }) {
  const { type, id } = route.params;
  const isEditing = !!id;
  const api = type === 'teacher' ? teachersApi : studentsApi;
  const labelSingular = type === 'teacher' ? 'Professor' : 'Aluno';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // só professores têm senha
  const [registrationNumber, setRegistrationNumber] = useState(''); // só alunos têm RA
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    navigation.setOptions({ title: isEditing ? `Editar ${labelSingular}` : `Novo(a) ${labelSingular}` });
    if (isEditing) {
      api
        .getById(id)
        .then(({ data }) => {
          setName(data.name);
          setEmail(data.email);
          setRegistrationNumber(data.registrationNumber || '');
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim()) {
      setError('Nome e e-mail são obrigatórios.');
      return;
    }
    if (type === 'teacher' && !isEditing && !password.trim()) {
      setError('Senha é obrigatória para novos professores.');
      return;
    }
    if (type === 'student' && !registrationNumber.trim()) {
      setError('Número de matrícula (RA) é obrigatório.');
      return;
    }

    setError('');
    setSaving(true);
    try {
      const payload =
        type === 'teacher'
          ? { name: name.trim(), email: email.trim(), ...(password.trim() ? { password: password.trim() } : {}) }
          : { name: name.trim(), email: email.trim(), registrationNumber: registrationNumber.trim() };

      if (isEditing) {
        await api.update(id, payload);
      } else {
        await api.create(payload);
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
      <Text style={styles.label}>Nome</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Nome completo" />

      <Text style={styles.label}>E-mail</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="email@exemplo.com"
        autoCapitalize="none"
        keyboardType="email-address"
      />

      {type === 'teacher' && (
        <>
          <Text style={styles.label}>
            Senha {isEditing ? '(deixe em branco para manter a atual)' : ''}
          </Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="••••••"
            secureTextEntry
          />
        </>
      )}

      {type === 'student' && (
        <>
          <Text style={styles.label}>Número de matrícula (RA)</Text>
          <TextInput
            style={styles.input}
            value={registrationNumber}
            onChangeText={setRegistrationNumber}
            placeholder="Ex: 2026001234"
          />
        </>
      )}

      {!!error && <Text style={styles.error}>{error}</Text>}

      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={saving}>
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>{isEditing ? 'Salvar alterações' : 'Cadastrar'}</Text>
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
