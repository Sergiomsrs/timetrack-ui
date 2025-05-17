import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';

import AddTimeTrack from '../pages/AddTimeTrack';
import { AuthContext } from '../context/AuthContext ';

describe('AddTimeTrack Component', () => {
  it('renders without crashing', () => {
    // Proveedor de contexto falso con valores simulados
    const mockAuth = { auth: { user: { id: 1, name: 'Test User' } } };

    render(
      <AuthContext.Provider value={mockAuth}>
        <AddTimeTrack />
      </AuthContext.Provider>
    );

    // Verificar que el título principal se renderiza
    const title = screen.getByText(/Time Track/i);
    expect(title).toBeInTheDocument();
  });
});
