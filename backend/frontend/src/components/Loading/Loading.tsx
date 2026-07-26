import styled, { keyframes } from 'styled-components';
import { theme } from '../../styles/GlobalStyles';

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${theme.spacing.xxl};
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid ${theme.colors.border};
  border-top-color: ${theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 0.7s linear infinite;
`;

interface Props {
  fullPage?: boolean;
}

export function Loading({ fullPage }: Props) {
  if (fullPage) {
    return (
      <FullPage>
        <Spinner />
      </FullPage>
    );
  }
  return (
    <Wrapper>
      <Spinner />
    </Wrapper>
  );
}

const FullPage = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.8);
  z-index: 999;
`;
