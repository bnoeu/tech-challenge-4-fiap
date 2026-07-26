import { useState, type FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import styled from 'styled-components';
import { loginSuccess } from '../redux/slices/authSlice';
import { authService } from '../services/authService';
import { ErrorMessage } from '../components/Error/ErrorMessage';
import type { RootState, AppDispatch } from '../redux/store';
import { theme } from '../styles/GlobalStyles';
import { useEffect } from 'react';

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
  width: 100%;
  max-width: 420px;
  box-shadow: ${theme.shadow.lg};
`;

const Logo = styled.div`
  text-align: center;
  margin-bottom: ${theme.spacing.xl};

  h1 {
    font-size: 1.8rem;
    font-weight: 700;
    color: ${theme.colors.primary};
  }

  p {
    color: ${theme.colors.textMuted};
    font-size: 0.9rem;
    margin-top: ${theme.spacing.xs};
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 500;
  color: ${theme.colors.text};
`;

const Input = styled.input`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.md};
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: ${theme.colors.primary};
  }
`;

const SubmitBtn = styled.button`
  padding: ${theme.spacing.md};
  background: ${theme.colors.primary};
  color: #fff;
  border: none;
  border-radius: ${theme.radius.md};
  font-size: 1rem;
  font-weight: 600;
  margin-top: ${theme.spacing.sm};
  transition: background 0.2s;

  &:hover:not(:disabled) {
    background: ${theme.colors.primaryDark};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const DemoHint = styled.div`
  margin-top: ${theme.spacing.lg};
  padding: ${theme.spacing.md};
  background: ${theme.colors.primaryLight};
  border-radius: ${theme.radius.md};
  font-size: 0.82rem;
  color: ${theme.colors.textMuted};
  line-height: 1.6;

  strong {
    color: ${theme.colors.primary};
  }
`;

const BackLink = styled.div`
  text-align: center;
  margin-top: ${theme.spacing.md};
  font-size: 0.9rem;
  color: ${theme.colors.textMuted};
`;

export function LoginPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/';

  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true });
  }, [isAuthenticated, navigate, from]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = authService.login(email, password);
      dispatch(loginSuccess(user));
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Page>
      <Card>
        <Logo>
          <h1>TechChallenge</h1>
          <p>Acesse o painel de administração</p>
        </Logo>

        {error && <ErrorMessage message={error} />}

        <Form onSubmit={handleSubmit}>
          <Field>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              autoComplete="email"
            />
          </Field>
          <Field>
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              required
              autoComplete="current-password"
            />
          </Field>
          <SubmitBtn type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </SubmitBtn>
        </Form>

        <DemoHint>
          <strong>Professor</strong> (cria, edita e exclui posts)
          <br />
          Email: professor@example.com &bull; Senha: 123456
          <br /><br />
          <strong>Aluno</strong> (visualiza e lê posts)
          <br />
          Email: aluno@example.com &bull; Senha: aluno123
        </DemoHint>

        <BackLink>
          <Link to="/">← Voltar para os posts</Link>
        </BackLink>
      </Card>
    </Page>
  );
}
