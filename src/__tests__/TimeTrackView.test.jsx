import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TimeTrackView } from '../pages/TimeTrackView';

// Como usas un hook personalizado useRecord y componentes hijos, hacemos mocks simples:
vi.mock('../Hooks/useRecord', () => ({
  useRecord: () => ({
    fetchRecords: vi.fn(),
    fetchEmployees: vi.fn(),
    records: [],
    employees: [],
    error: null,
    isLoading: false,
    selectedEmployeeId: null,
    selectedDayRecords: [],
    setRecords: vi.fn(),
    setEmployees: vi.fn(),
    setError: vi.fn(),
    setIsLoading: vi.fn(),
    setSelectedDayRecords: vi.fn(),
    setSelectedEmployeeId: vi.fn(),
  }),
}));

vi.mock('../components/DatePicker', () => ({
  DatePicker: () => <div>DatePicker mock</div>,
}));

vi.mock('../components/TimetrackList', () => ({
  TimetrackList: () => <div>TimetrackList mock</div>,
}));

describe('TimeTrackView component', () => {
  it('El componente TimeTrackView se renderiza sin fallos', () => {
    render(<TimeTrackView />);

    expect(screen.getByText('DatePicker mock')).toBeInTheDocument();
    expect(screen.getByText('TimetrackList mock')).toBeInTheDocument();
  });
});
