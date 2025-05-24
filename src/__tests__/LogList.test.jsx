import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { LogList } from '../pages/LogList';
import '@testing-library/jest-dom';

import { AuthContext } from '../context/AuthContext';

describe('LogList component', () => {
  const fakeAuth = { token: 'fake-token' };

  beforeEach(() => {
    // Mock global fetch
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve([
            {
              nombre: 'Juan',
              apellido: 'Pérez',
              fecha: '2025-05-18',
              hora: '08:00',
              enviadoEn: new Date().toISOString(),
            },
          ]),
      })
    );
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('El componente LogList se renderiza sin errores', async () => {
    render(
      <AuthContext.Provider value={{ auth: fakeAuth }}>
        <LogList />
      </AuthContext.Provider>
    );

    // Comprueba que el título está en el documento
    expect(screen.getByText(/Últimas Notificaciones/i)).toBeDefined();

    // Espera a que aparezca el nombre del usuario mockeado
    await waitFor(() => {
      expect(screen.getByText(/Juan Pérez/i)).toBeDefined();
    });
  });
});
