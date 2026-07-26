import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Layout } from '../components/Layout/Layout';
import { PostCard } from '../components/PostCard/PostCard';
import { SearchBar } from '../components/SearchBar/SearchBar';
import { Loading } from '../components/Loading/Loading';
import { ErrorMessage } from '../components/Error/ErrorMessage';
import { fetchPosts, searchPosts, setSearchQuery } from '../redux/slices/postsSlice';
import type { RootState, AppDispatch } from '../redux/store';
import { theme } from '../styles/GlobalStyles';

const PageHeader = styled.div`
  margin-bottom: ${theme.spacing.xl};
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.sm};

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 1.5rem;
  }
`;

const Subtitle = styled.p`
  color: ${theme.colors.textMuted};
  margin-bottom: ${theme.spacing.lg};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const EmptyState = styled.p`
  text-align: center;
  color: ${theme.colors.textMuted};
  padding: ${theme.spacing.xxl};
  font-size: 1rem;
`;

const ResultInfo = styled.p`
  font-size: 0.9rem;
  color: ${theme.colors.textMuted};
  margin-bottom: ${theme.spacing.md};
`;

export function HomePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error, searchQuery } = useSelector(
    (s: RootState) => s.posts
  );

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  function handleSearch(query: string) {
    dispatch(setSearchQuery(query));
    dispatch(searchPosts(query));
  }

  function handleClear() {
    dispatch(setSearchQuery(''));
    dispatch(fetchPosts());
  }

  return (
    <Layout>
      <PageHeader>
        <Title>Blog de Posts</Title>
        <Subtitle>Artigos e conteúdos educacionais para professores e alunos</Subtitle>
        <SearchBar onSearch={handleSearch} onClear={handleClear} />
      </PageHeader>

      {error && <ErrorMessage message={error} />}

      {loading && <Loading />}

      {!loading && !error && (
        <>
          {searchQuery && (
            <ResultInfo>
              {items.length} resultado{items.length !== 1 ? 's' : ''} para &ldquo;{searchQuery}&rdquo;
            </ResultInfo>
          )}
          {items.length === 0 ? (
            <EmptyState>
              {searchQuery
                ? 'Nenhum post encontrado para sua busca.'
                : 'Nenhum post publicado ainda.'}
            </EmptyState>
          ) : (
            <Grid>
              {items.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </Grid>
          )}
        </>
      )}
    </Layout>
  );
}
