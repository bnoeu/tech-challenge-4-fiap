import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from '../../styles/GlobalStyles';
import type { Post } from '../../types';

const Card = styled.article`
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.lg};
  padding: ${theme.spacing.lg};
  box-shadow: ${theme.shadow.sm};
  transition: box-shadow 0.2s, transform 0.2s;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
  cursor: pointer;

  &:hover {
    box-shadow: ${theme.shadow.md};
    transform: translateY(-2px);
  }
`;

const TitleLink = styled(Link)`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${theme.colors.text};
  line-height: 1.4;
  text-decoration: none;

  &:hover {
    color: ${theme.colors.primary};
    text-decoration: underline;
  }
`;

const ExcerptLink = styled(Link)`
  color: ${theme.colors.textMuted};
  font-size: 0.95rem;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-decoration: none;

  &:hover {
    color: ${theme.colors.text};
  }
`;

const Meta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  color: ${theme.colors.textLight};
  margin-top: auto;
  padding-top: ${theme.spacing.sm};
  border-top: 1px solid ${theme.colors.border};
`;

const Author = styled.span`
  font-weight: 500;
  color: ${theme.colors.secondary};
`;

const ReadMore = styled(Link)`
  color: ${theme.colors.primary};
  font-weight: 500;
  font-size: 0.9rem;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

interface Props {
  post: Post;
}

export function PostCard({ post }: Props) {
  const to = `/posts/${post._id}`;

  const date = new Date(post.createdAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <Card>
      <TitleLink to={to}>{post.title}</TitleLink>
      <ExcerptLink to={to}>{post.content}</ExcerptLink>
      <Meta>
        <span>
          <Author>{post.author}</Author> &bull; {date}
        </span>
        <ReadMore to={to}>Ler mais →</ReadMore>
      </Meta>
    </Card>
  );
}
