import React from 'react';
import { render, screen } from '@testing-library/react';
import RootLayout from '@/app/layout';

describe('RootLayout', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it('renders login/signup when unauthenticated', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: false });
    render(<RootLayout><div>Test</div></RootLayout>);
    expect(await screen.findByText(/login/i)).toBeInTheDocument();
    expect(screen.getByText(/sign up/i)).toBeInTheDocument();
  });

  it('renders logout when authenticated', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: true });
    render(<RootLayout><div>Test</div></RootLayout>);
    expect(await screen.findByText(/logout/i)).toBeInTheDocument();
  });
});