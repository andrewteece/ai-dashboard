import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'next-themes';
import { DashboardHeader } from '../components/DashboardHeader';

describe('DashboardHeader (mobile icons + a11y)', () => {
  it('renders icon-only actions on xs with accessible names', () => {
    render(
      <ThemeProvider attribute="class">
        <DashboardHeader />
      </ThemeProvider>,
    );

    expect(screen.getByRole('button', { name: /reset to default layout/i })).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /add kpi widget/i })).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /add line widget/i })).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /add notes widget/i })).toBeInTheDocument();
  });
});
