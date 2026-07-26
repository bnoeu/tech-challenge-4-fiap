import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Layout } from '../components/Layout/Layout';
import { Loading } from '../components/Loading/Loading';
import { ErrorMessage } from '../components/Error/ErrorMessage';
import { fetchPosts, deletePost } from '../redux/slices/postsSlice';
import type { RootState, AppDispatch } from '../redux/store';
import { theme } from '../styles/GlobalStyles';

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.xl};
  flex-wrap: wrap;
  gap: ${theme.spacing.md};
`;

const PageTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
`;

const NewPostLink = styled(Link)`
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

const TableWrapper = styled.div`
  overflow-x: auto;
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.lg};
  box-shadow: ${theme.shadow.sm};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
`;

const Th = styled.th`
  text-align: left;
  padding: ${theme.spacing.md};
  border-bottom: 2px solid ${theme.colors.border};
  font-weight: 600;
  color: ${theme.colors.textMuted};
  background: ${theme.colors.background};
  white-space: nowrap;
`;

const Td = styled.td`
  padding: ${theme.spacing.md};
  border-bottom: 1px solid ${theme.colors.border};
  vertical-align: middle;
  color: ${theme.colors.text};
`;

const TitleCell = styled(Td)`
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Tr = styled.tr`
  &:last-child td {
    border-bottom: none;
  }
  &:hover td {
    background: ${theme.colors.background};
  }
`;

const ActionRow = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
`;

const ViewLink = styled(Link)`
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.sm};
  font-size: 0.8rem;
  color: ${theme.colors.textMuted};
  text-decoration: none;

  &:hover {
    border-color: ${theme.colors.primary};
    color: ${theme.colors.primary};
    text-decoration: none;
  }
`;

const EditLink = styled(Link)`
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  background: ${theme.colors.primaryLight};
  border: 1px solid ${theme.colors.primary};
  border-radius: ${theme.radius.sm};
  font-size: 0.8rem;
  color: ${theme.colors.primary};
  text-decoration: none;

  &:hover {
    background: ${theme.colors.primary};
    color: #fff;
    text-decoration: none;
  }
`;

const DeleteBtn = styled.button`
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  background: ${theme.colors.dangerLight};
  border: 1px solid ${theme.colors.danger};
  border-radius: ${theme.radius.sm};
  font-size: 0.8rem;
  color: ${theme.colors.danger};
  transition: all 0.2s;

  &:hover {
    background: ${theme.colors.danger};
    color: #fff;
  }
`;

const Count = styled.p`
  font-size: 0.85rem;
  color: ${theme.colors.textMuted};
  margin-bottom: ${theme.spacing.md};
`;

export function AdminPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error } = useSelector((s: RootState) => s.posts);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Excluir o post "${title}"?`)) return;
    await dispatch(deletePost(id));
  }

  return (
    <Layout>
      <PageHeader>
        <PageTitle>Painel Admin</PageTitle>
        <NewPostLink to="/criar">+ Novo Post</NewPostLink>
      </PageHeader>

      {error && <ErrorMessage message={error} />}
      {loading && <Loading />}

      {!loading && (
        <>
          <Count>{items.length} post{items.length !== 1 ? 's' : ''} no total</Count>
          <TableWrapper>
            <Table>
              <thead>
                <tr>
                  <Th>Título</Th>
                  <Th>Autor</Th>
                  <Th>Data</Th>
                  <Th>Ações</Th>
                </tr>
              </thead>
              <tbody>
                {items.map((post) => (
                  <Tr key={post._id}>
                    <TitleCell title={post.title}>{post.title}</TitleCell>
                    <Td>{post.author}</Td>
                    <Td>
                      {new Date(post.createdAt).toLocaleDateString('pt-BR')}
                    </Td>
                    <Td>
                      <ActionRow>
                        <ViewLink to={`/posts/${post._id}`}>Ver</ViewLink>
                        <EditLink to={`/editar/${post._id}`}>Editar</EditLink>
                        <DeleteBtn
                          onClick={() => handleDelete(post._id, post.title)}
                        >
                          Excluir
                        </DeleteBtn>
                      </ActionRow>
                    </Td>
                  </Tr>
                ))}
                {items.length === 0 && (
                  <Tr>
                    <Td colSpan={4} style={{ textAlign: 'center', color: theme.colors.textMuted }}>
                      Nenhum post encontrado.
                    </Td>
                  </Tr>
                )}
              </tbody>
            </Table>
          </TableWrapper>
        </>
      )}
    </Layout>
  );
}
