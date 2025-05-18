// src/__tests__/User.test.jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { User } from '../pages/User';

// Mock de los componentes hijos para simplificar el test
vi.mock('../components/UserForm', () => ({
  default: () => <div>Mock UserForm</div>
}));
vi.mock('../components/UserList', () => ({
  UserList: (props) => <div>Mock UserList</div>
}));
vi.mock('../components/ActiveTab', () => ({
  ActiveTab: ({ activeTab }) => <div>ActiveTab: {activeTab}</div>
}));
vi.mock('../components/HourlyForm', () => ({
  HourlyForm: () => <div>Mock HourlyForm</div>
}));

describe('User component', () => {
  it('El componente User se renderiza sin fallos', () => {
    render(<User />);
    expect(screen.getByText(/ActiveTab: list/i)).toBeDefined();
  });
});
