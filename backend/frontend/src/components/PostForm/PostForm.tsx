import { useState, type FormEvent } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/GlobalStyles';
import type { PostFormData } from '../../types';

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
  font-weight: 500;
  font-size: 0.9rem;
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

const Textarea = styled.textarea`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.md};
  font-size: 1rem;
  outline: none;
  resize: vertical;
  min-height: 200px;
  line-height: 1.6;
  transition: border-color 0.2s;

  &:focus {
    border-color: ${theme.colors.primary};
  }
`;

const HintText = styled.span`
  font-size: 0.78rem;
  color: ${theme.colors.textLight};
`;

const Actions = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  justify-content: flex-end;
`;

const SubmitButton = styled.button`
  padding: ${theme.spacing.sm} ${theme.spacing.xl};
  background: ${theme.colors.primary};
  color: #fff;
  border: none;
  border-radius: ${theme.radius.md};
  font-size: 1rem;
  font-weight: 500;
  transition: background 0.2s;

  &:hover:not(:disabled) {
    background: ${theme.colors.primaryDark};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const CancelButton = styled.button`
  padding: ${theme.spacing.sm} ${theme.spacing.xl};
  background: none;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.md};
  font-size: 1rem;
  color: ${theme.colors.textMuted};
  transition: border-color 0.2s;

  &:hover {
    border-color: ${theme.colors.secondary};
  }
`;

interface Props {
  initialValues?: Partial<PostFormData>;
  onSubmit: (data: PostFormData) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
  loading?: boolean;
}

export function PostForm({
  initialValues = {},
  onSubmit,
  onCancel,
  submitLabel = 'Salvar',
  loading = false,
}: Props) {
  const [form, setForm] = useState<PostFormData>({
    title: initialValues.title ?? '',
    content: initialValues.content ?? '',
    author: initialValues.author ?? '',
  });

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim() || !form.author.trim()) return;
    await onSubmit(form);
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Field>
        <Label htmlFor="title">Título *</Label>
        <Input
          id="title"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Título do post"
          required
          maxLength={200}
        />
        <HintText>{form.title.length}/200</HintText>
      </Field>

      <Field>
        <Label htmlFor="author">Autor *</Label>
        <Input
          id="author"
          name="author"
          value={form.author}
          onChange={handleChange}
          placeholder="Nome do autor"
          required
          maxLength={100}
        />
      </Field>

      <Field>
        <Label htmlFor="content">Conteúdo *</Label>
        <Textarea
          id="content"
          name="content"
          value={form.content}
          onChange={handleChange}
          placeholder="Escreva o conteúdo do post..."
          required
        />
      </Field>

      <Actions>
        {onCancel && (
          <CancelButton type="button" onClick={onCancel} disabled={loading}>
            Cancelar
          </CancelButton>
        )}
        <SubmitButton type="submit" disabled={loading}>
          {loading ? 'Salvando...' : submitLabel}
        </SubmitButton>
      </Actions>
    </Form>
  );
}
