import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../login/login';

const renderLogin = () => {
  render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );
};

describe('Login Component', () => {
  test('renders login form correctly', () => {
    renderLogin();
    expect(screen.getByPlaceholderText(/Username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Entrar/i })).toBeInTheDocument();
  });

  test('toggles password visibility', () => {
    renderLogin();
    const passwordInput = screen.getByPlaceholderText(/Password/i);
    const toggleIcon = screen.getByTestId('toggle-password-visibility');

    // Verifica que o campo de senha está no tipo "password" por padrão
    expect(passwordInput.type).toBe('password');

    // Clica no ícone de visibilidade para mostrar a senha
    fireEvent.click(toggleIcon);
    expect(passwordInput.type).toBe('text');

    // Clica novamente para esconder a senha
    fireEvent.click(toggleIcon);
    expect(passwordInput.type).toBe('password');
  });

  test('displays error on invalid login attempt', async () => {
    renderLogin();

    fireEvent.change(screen.getByPlaceholderText(/Username/i), { target: { value: 'usuario_invalido' } });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: 'senha_errada' } });
    fireEvent.click(screen.getByRole('button', { name: /Entrar/i }));

    const errorMessage = await screen.findByText(/Ocorreu um erro/i);
    expect(errorMessage).toBeInTheDocument();
  });
});
