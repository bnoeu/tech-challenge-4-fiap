import { useState, type FormEvent } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/GlobalStyles';

const Form = styled.form`
  display: flex;
  gap: ${theme.spacing.sm};
  width: 100%;
  max-width: 600px;
`;

const Input = styled.input`
  flex: 1;
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

const Button = styled.button`
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  background: ${theme.colors.primary};
  color: #fff;
  border: none;
  border-radius: ${theme.radius.md};
  font-size: 1rem;
  font-weight: 500;
  transition: background 0.2s;

  &:hover {
    background: ${theme.colors.primaryDark};
  }
`;

const ClearBtn = styled.button`
  padding: ${theme.spacing.sm};
  background: none;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.md};
  color: ${theme.colors.textMuted};
  font-size: 0.9rem;

  &:hover {
    border-color: ${theme.colors.secondary};
  }
`;

interface Props {
  onSearch: (query: string) => void;
  onClear: () => void;
  placeholder?: string;
}

export function SearchBar({ onSearch, onClear, placeholder = 'Buscar posts...' }: Props) {
  const [value, setValue] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const q = value.trim();
    if (q.length < 2) return;
    onSearch(q);
  }

  function handleClear() {
    setValue('');
    onClear();
  }

  return (
    <Form onSubmit={handleSubmit} role="search">
      <Input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        aria-label="Campo de busca"
      />
      <Button type="submit">Buscar</Button>
      {value && (
        <ClearBtn type="button" onClick={handleClear} aria-label="Limpar busca">
          ✕
        </ClearBtn>
      )}
    </Form>
  );
}
