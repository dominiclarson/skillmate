import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignupPage from '@/app/signup/page';

describe('SignupPage', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it('submits signup form and navigates on success', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: true });
    render(<SignupPage />);

    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'new@test.com' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'secret123' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/auth/register',
        expect.objectContaining({ method: 'POST' })
      );
    });
  });

  it('shows error message on failure', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: false, json: async () => ({ error: 'Email already registered' }) });
    render(<SignupPage />);
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    expect(await screen.findByText(/email already registered/i)).toBeInTheDocument();
  });
});