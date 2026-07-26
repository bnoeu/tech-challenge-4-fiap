import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Layout } from '../components/Layout/Layout';
import { PostForm } from '../components/PostForm/PostForm';
import { ErrorMessage } from '../components/Error/ErrorMessage';
import { createPost } from '../redux/slices/postsSlice';
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

export function CreatePostPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s: RootState) => s.posts);
  const user = useSelector((s: RootState) => s.auth.user);

  async function handleSubmit(data: PostFormData) {
    const result = await dispatch(createPost(data));
    if (createPost.fulfilled.match(result)) {
      navigate(`/posts/${result.payload._id}`);
    }
  }

  return (
    <Layout>
      <PageTitle>Novo Post</PageTitle>
      {error && <ErrorMessage message={error} />}
      <Card>
        <PostForm
          initialValues={{ author: user?.name ?? '' }}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/')}
          submitLabel="Publicar"
          loading={loading}
        />
      </Card>
    </Layout>
  );
}
