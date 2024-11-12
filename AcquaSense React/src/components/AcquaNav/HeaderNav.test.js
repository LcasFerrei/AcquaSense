import { render, screen, fireEvent } from '@testing-library/react';
import HeaderNav from './HeaderNav';
import { ThemeContext } from '../contexts/ThemeContext'; // ajuste o caminho conforme a estrutura do seu projeto

test('alterna o tema ao clicar no ícone de alternância de tema', () => {
  const toggleTheme = jest.fn();
  render(
    <ThemeContext.Provider value={{ isDarkMode: false, toggleTheme }}>
      <HeaderNav handleMenuToggle={() => {}} />
    </ThemeContext.Provider>
  );
  const themeToggleIcon = screen.getByRole('button', { name: /alternar tema/i });
  fireEvent.click(themeToggleIcon);
  expect(toggleTheme).toHaveBeenCalled();
});
