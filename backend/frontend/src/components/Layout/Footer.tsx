import styled from 'styled-components';
import { theme } from '../../styles/GlobalStyles';

const FooterEl = styled.footer`
  background: ${theme.colors.surface};
  border-top: 1px solid ${theme.colors.border};
  padding: ${theme.spacing.lg} ${theme.spacing.md};
  text-align: center;
  font-size: 0.85rem;
  color: ${theme.colors.textLight};
  margin-top: auto;
`;

export function Footer() {
  return (
    <FooterEl>
      <p>Tech Challenge &copy; {new Date().getFullYear()} &mdash; FIAP</p>
    </FooterEl>
  );
}
