import styled from 'styled-components';
import { theme } from '../../styles/GlobalStyles';

const Box = styled.div`
  background: ${theme.colors.dangerLight};
  border: 1px solid ${theme.colors.danger};
  color: ${theme.colors.danger};
  border-radius: ${theme.radius.md};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  margin: ${theme.spacing.md} 0;
  font-size: 0.9rem;
`;

interface Props {
  message: string;
}

export function ErrorMessage({ message }: Props) {
  return <Box role="alert">{message}</Box>;
}
