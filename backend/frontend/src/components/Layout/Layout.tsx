import styled from 'styled-components';
import { Header } from './Header';
import { Footer } from './Footer';
import { theme } from '../../styles/GlobalStyles';

const Main = styled.main`
  flex: 1;
  max-width: 1100px;
  width: 100%;
  margin: 0 auto;
  padding: ${theme.spacing.xl} ${theme.spacing.md};

  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: ${theme.spacing.lg} ${theme.spacing.md};
  }
`;

interface Props {
  children: React.ReactNode;
}

export function Layout({ children }: Props) {
  return (
    <>
      <Header />
      <Main>{children}</Main>
      <Footer />
    </>
  );
}
