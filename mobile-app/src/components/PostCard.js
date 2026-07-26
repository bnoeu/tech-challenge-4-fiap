import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// Mostra título, autor e uma prévia do conteúdo. onPress abre a leitura completa.
export default function PostCard({ post, onPress }) {
  const preview =
    post.content?.length > 120 ? `${post.content.slice(0, 120)}...` : post.content;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.title}>{post.title}</Text>
      <Text style={styles.author}>por {post.author}</Text>
      <Text style={styles.preview}>{preview}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  title: { fontSize: 17, fontWeight: '700', color: '#1a1a2e', marginBottom: 4 },
  author: { fontSize: 13, color: '#6c63ff', marginBottom: 8, fontWeight: '600' },
  preview: { fontSize: 14, color: '#555', lineHeight: 20 },
});
