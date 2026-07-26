import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Layout } from '../components/Layout/Layout';
import { PostForm } from '../components/PostForm/PostForm';
import { Loading } from '../components/Loading/Loading';
import { ErrorMessage } from '../components/Error/ErrorMessage';
import { fetchPostById, updatePost, clearSelectedPost } from '../redux/slices/postsSlice';
import type { RootState, AppDispatch } from '../redux/store';
import type { PostFormData } from '../types';
import { theme } from '../styles/GlobalStyles';

const PageTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: ${theme.spacing.xl};
`;

const Card = styled.div`
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.lg};
  padding: ${theme.spacing.xl};
  box-shadow: ${theme.shadow.sm};
  max-width: 720px;
`;

export function EditPostPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { selectedPost: post, loading, error } = useSelector(
    (s: RootState) => s.posts
  );

  useEffect(() => {
    if (id) dispatch(fetchPostById(id));
    return () => { dispatch(clearSelectedPost()); };
  }, [dispatch, id]);

  async function handleSubmit(data: PostFormData) {
    if (!id) return;
    const result = await dispatch(updatePost({ id, payload: data }));
    if (updatePost.fulfilled.match(result)) {
      navigate(`/posts/${id}`);
    }
  }

  return (
    <Layout>
      <PageTitle>Editar Post</PageTitle>
      {error && <ErrorMessage message={error} />}
      {loading && !post && <Loading />}
      {post && (
        <Card>
          <PostForm
            initialValues={{
              title: post.title,
              content: post.content,
              author: post.author,
            }}
            onSubmit={handleSubmit}
            onCancel={() => navigate(`/posts/${id}`)}
            submitLabel="Salvar alterações"
            loading={loading}
          />
        </Card>
      )}
    </Layout>
  );
}
