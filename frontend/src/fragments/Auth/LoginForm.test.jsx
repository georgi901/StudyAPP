import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import LoginForm from './LoginForm';
import { BrowserRouter } from 'react-router-dom';

vi.mock('../../hooks/Auth/useAuth', () => ({
  useAuth: () => ({
    loginUser: vi.fn().mockResolvedValue({ success: true }),
  }),
}));

afterEach(cleanup);

describe('LoginForm', () => {
  const renderForm = () => render(
    <BrowserRouter>
      <LoginForm />
    </BrowserRouter>
  );

  it('renders the username input', () => {
    renderForm();
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
  });

  it('renders the password input', () => {
    renderForm();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
  });

  it('renders the login button', () => {
    renderForm();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('requires the username field', () => {
    renderForm();
    expect(screen.getByPlaceholderText('Username')).toBeRequired();
  });

  it('requires the password field', () => {
    renderForm();
    expect(screen.getByPlaceholderText('Password')).toBeRequired();
  });

  it('allows typing into the username field', () => {
    renderForm();
    const input = screen.getByPlaceholderText('Username');
    fireEvent.change(input, { target: { value: 'myuser' } });
    expect(input.value).toBe('myuser');
  });
});
