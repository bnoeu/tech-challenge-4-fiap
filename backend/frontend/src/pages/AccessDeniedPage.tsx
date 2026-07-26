import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from '../styles/GlobalStyles';

const Page = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${theme.colors.background};
  padding: ${theme.spacing.md};
`;

const Card = styled.div`
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.lg};
  padding: ${theme.spacing.xxl};
  max-width: 460px;
  width: 100%;
  text-align: center;
  box-shadow: ${theme.shadow.md};
`;

const Icon = styled.div`
  font-size: 3.5rem;
  margin-bottom: ${theme.spacing.md};
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${theme.colors.danger};
  margin-bottom: ${theme.spacing.sm};
`;

const Message = styled.p`
  color: ${theme.colors.textMuted};
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: ${theme.spacing.xl};
`;

const RoleBadge = styled.span`
  display: inline-block;
  background: ${theme.colors.dangerLight};
  color: ${theme.colors.danger};
  border: 1px solid ${theme.colors.danger};
  border-radius: ${theme.radius.full};
  padding: ${theme.spacing.xs} ${theme.spacing.md};
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: ${theme.spacing.xl};
`;

const HomeLink = styled(Link)`
  display: inline-block;
  padding: ${theme.spacing.sm} ${theme.spacing.xl};
  background: ${theme.colors.primary};
  color: #fff;
  border-radius: ${theme.radius.md};
  font-weight: 500;
  text-decoration: none;

  &:hover {
    background: ${theme.colors.primaryDark};
    text-decoration: none;
  }
`;

export function AccessDeniedPage() {
  return (
    <Page>
      <Card>
        <Icon>🔒</Icon>
        <Title>Acesso Restrito</Title>
        <RoleBadge>Apenas Professores</RoleBadge>
        <Message>
          Você não tem permissão para acessar esta área.
          O gerenciamento de posts é exclusivo para professores.
        </Message>
        <HomeLink to="/">Voltar para os Posts</HomeLink>
      </Card>
    </Page>
  );
}
