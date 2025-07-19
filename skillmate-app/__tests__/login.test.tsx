import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import LoginPage from '@/app/login/page';

describe('LoginPage', () => {
  it('renders the form', () => {
    render(<LoginPage />);
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
  
});


  it('submits credentials and navigates on success', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: true });
    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'user@test.com' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'pass123' } });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/auth/login',
        expect.objectContaining({ method: 'POST' })
      );
    });
  });

  it('shows error message on failure', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: false, json: async () => ({ error: 'Invalid credentials' }) });
    render(<LoginPage />);
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));
    expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument();
  });
});