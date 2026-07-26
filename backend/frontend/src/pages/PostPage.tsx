import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Layout } from '../components/Layout/Layout';
import { Loading } from '../components/Loading/Loading';
import { ErrorMessage } from '../components/Error/ErrorMessage';
import { fetchPostById, clearSelectedPost, deletePost } from '../redux/slices/postsSlice';
import type { RootState, AppDispatch } from '../redux/store';
import { theme } from '../styles/GlobalStyles';

const Breadcrumb = styled.div`
  font-size: 0.85rem;
  color: ${theme.colors.textMuted};
  margin-bottom: ${theme.spacing.lg};

  a {
    color: ${theme.colors.primary};
  }
`;

const Article = styled.article`
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.lg};
  padding: ${theme.spacing.xl};
  box-shadow: ${theme.shadow.sm};
`;

const PostTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.3;
  margin-bottom: ${theme.spacing.md};

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 1.5rem;
  }
`;

const Meta = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  font-size: 0.85rem;
  color: ${theme.colors.textMuted};
  margin-bottom: ${theme.spacing.xl};
  padding-bottom: ${theme.spacing.md};
  border-bottom: 1px solid ${theme.colors.border};
  flex-wrap: wrap;
`;

const Content = styled.div`
  font-size: 1.05rem;
  line-height: 1.8;
  color: ${theme.colors.text};
  white-space: pre-wrap;
  word-break: break-word;
`;

const Actions = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  margin-top: ${theme.spacing.xl};
  padding-top: ${theme.spacing.md};
  border-top: 1px solid ${theme.colors.border};
`;

const EditLink = styled(Link)`
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  background: ${theme.colors.primary};
  color: #fff;
  border-radius: ${theme.radius.md};
  font-size: 0.9rem;
  font-weight: 500;
  text-decoration: none;

  &:hover {
    background: ${theme.colors.primaryDark};
    text-decoration: none;
  }
`;

const DeleteBtn = styled.button`
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  background: ${theme.colors.dangerLight};
  color: ${theme.colors.danger};
  border: 1px solid ${theme.colors.danger};
  border-radius: ${theme.radius.md};
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    background: ${theme.colors.danger};
    color: #fff;
  }
`;

export function PostPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { selectedPost: post, loading, error } = useSelector(
    (s: RootState) => s.posts
  );
  const { isAuthenticated, user } = useSelector((s: RootState) => s.auth);
  const isProfessor = isAuthenticated && user?.role === 'professor';

  useEffect(() => {
    if (id) dispatch(fetchPostById(id));
    return () => { dispatch(clearSelectedPost()); };
  }, [dispatch, id]);

  async function handleDelete() {
    if (!post) return;
    if (!confirm(`Deseja excluir o post "${post.title}"?`)) return;
    await dispatch(deletePost(post._id));
    navigate('/');
  }

  return (
    <Layout>
      <Breadcrumb>
        <Link to="/">Posts</Link> &rsaquo; {post?.title ?? 'Carregando...'}
      </Breadcrumb>

      {error && <ErrorMessage message={error} />}
      {loading && <Loading />}

      {!loading && post && (
        <Article>
          <PostTitle>{post.title}</PostTitle>
          <Meta>
            <span>Por <strong>{post.author}</strong></span>
            <span>
              Publicado em{' '}
              {new Date(post.createdAt).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
            </span>
            {post.updatedAt !== post.createdAt && (
              <span>
                Atualizado em{' '}
                {new Date(post.updatedAt).toLocaleDateString('pt-BR')}
              </span>
            )}
          </Meta>
          <Content>{post.content}</Content>

          {isProfessor && (
            <Actions>
              <EditLink to={`/editar/${post._id}`}>Editar</EditLink>
              <DeleteBtn onClick={handleDelete}>Excluir</DeleteBtn>
            </Actions>
          )}
        </Article>
      )}
    </Layout>
  );
}
