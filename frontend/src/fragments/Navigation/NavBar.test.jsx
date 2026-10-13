import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import NavBar from './NavBar';
import { BrowserRouter } from 'react-router-dom';

const logoutMock = vi.fn();

vi.mock('../../hooks/Auth/useAuth', () => ({
  useAuth: () => ({
    logout: logoutMock,
  }),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('NavBar Component', () => {
  const renderNavBar = () => render(
    <BrowserRouter>
      <NavBar />
    </BrowserRouter>
  );

  it('renders the Dashboard link', () => {
    renderNavBar();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('renders the Pomodoro link', () => {
    renderNavBar();
    expect(screen.getByText('Pomodoro')).toBeInTheDocument();
  });

  it('renders the FlashCards link', () => {
    renderNavBar();
    expect(screen.getByText('FlashCards')).toBeInTheDocument();
  });

  it('renders the FileTree link', () => {
    renderNavBar();
    expect(screen.getByText('FileTree')).toBeInTheDocument();
  });

  it('renders the Groups link', () => {
    renderNavBar();
    expect(screen.getByText('Groups')).toBeInTheDocument();
  });

  it('calls logout when the button is clicked', () => {
    renderNavBar();
    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);
    expect(logoutMock).toHaveBeenCalled();
  });
});
