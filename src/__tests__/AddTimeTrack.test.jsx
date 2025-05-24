import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';

import AddTimeTrack from '../pages/AddTimeTrack';
import { AuthContext } from '../context/AuthContext';


vi.mock('../Hooks/useRecord', () => ({
  useRecord: () => ({
    fetchLastThree: vi.fn(),
    lastThree: [
      {
        id: 1,
        dni: '12345678A',
        timestampFormatted: '2025-05-17 08:00:00',
      },
    ],
  }),
}));


describe('AddTimeTrack Component', () => {
  it('El componente AddTimeTrack se renderiza sin fallos', () => {
    const mockAuth = { auth: { user: { id: 1, name: 'Test User' } } };

    render(
      <AuthContext.Provider value={mockAuth}>
        <AddTimeTrack />
      </AuthContext.Provider>
    );

    const title = screen.getByText(/Time Track/i);
    expect(title).toBeInTheDocument();
  });
});


