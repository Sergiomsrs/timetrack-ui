import { render, screen } from '@testing-library/react';
import { Login } from '../pages/Login';
import { AuthContext } from '../context/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

describe('Login component', () => {
  it('El componente Login se renderiza sin fallos', () => {
    const mockLogin = () => {};

    render(
      <AuthContext.Provider value={{ login: mockLogin }}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </AuthContext.Provider>
    );

    expect(screen.getByText(/Inicia sesión/i)).toBeInTheDocument();
  });
});
