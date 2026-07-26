import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { theme } from '../../styles/GlobalStyles';
import { logout } from '../../redux/slices/authSlice';
import type { RootState, AppDispatch } from '../../redux/store';

const Nav = styled.header`
  background: ${theme.colors.surface};
  border-bottom: 1px solid ${theme.colors.border};
  box-shadow: ${theme.shadow.sm};
  position: sticky;
  top: 0;
  z-index: 100;
`;

const Inner = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 ${theme.spacing.md};
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Brand = styled(Link)`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${theme.colors.primary};
  text-decoration: none;

  span {
    color: ${theme.colors.text};
    font-weight: 400;
  }
`;

const NavLinks = styled.nav`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};

  @media (max-width: ${theme.breakpoints.mobile}) {
    gap: ${theme.spacing.sm};
  }
`;

const NavLink = styled(Link)`
  color: ${theme.colors.textMuted};
  font-size: 0.9rem;
  text-decoration: none;
  font-weight: 500;
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.radius.sm};
  transition: color 0.2s;

  &:hover {
    color: ${theme.colors.primary};
    text-decoration: none;
  }
`;

const LogoutBtn = styled.button`
  background: none;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.md};
  padding: ${theme.spacing.xs} ${theme.spacing.md};
  font-size: 0.85rem;
  color: ${theme.colors.textMuted};
  transition: all 0.2s;

  &:hover {
    border-color: ${theme.colors.danger};
    color: ${theme.colors.danger};
  }
`;

const UserBadge = styled.span`
  font-size: 0.82rem;
  color: ${theme.colors.primary};
  font-weight: 500;
  background: ${theme.colors.primaryLight};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.radius.full};

  @media (max-width: ${theme.breakpoints.mobile}) {
    display: none;
  }
`;

export function Header() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((s: RootState) => s.auth);

  function handleLogout() {
    dispatch(logout());
    navigate('/');
  }

  return (
    <Nav>
      <Inner>
        <Brand to="/">
          Tech<span>Challenge</span>
        </Brand>
        <NavLinks>
          <NavLink to="/">Posts</NavLink>
          {isAuthenticated && (
            <>
              {user?.role === 'professor' && (
                <>
                  <NavLink to="/criar">Novo Post</NavLink>
                  <NavLink to="/admin">Admin</NavLink>
                </>
              )}
              {user && (
                <UserBadge title={user.role === 'professor' ? 'Professor' : 'Aluno'}>
                  {user.name}
                </UserBadge>
              )}
              <LogoutBtn onClick={handleLogout}>Sair</LogoutBtn>
            </>
          )}
          {!isAuthenticated && <NavLink to="/login">Entrar</NavLink>}
        </NavLinks>
      </Inner>
    </Nav>
  );
}
