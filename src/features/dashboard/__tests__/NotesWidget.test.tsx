import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { NotesWidget } from '../components/widgets/NotesWidget';

it('renders Notes widget', () => {
  render(<NotesWidget id="notes-1" title="Notes" />);
  expect(screen.getByText('Notes')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Write notes…')).toBeInTheDocument();
});
