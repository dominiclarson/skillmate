import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoadingSpinner from '@/components/LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders loading spinner with text', () => {
    render(<LoadingSpinner />);
    
    expect(screen.getByText('Loading SkillMate...')).toBeInTheDocument();
  });

  it('has correct CSS classes for styling', () => {
    render(<LoadingSpinner />);
    
    const loadingText = screen.getByText('Loading SkillMate...');
    expect(loadingText).toHaveClass('text-primary', 'font-medium');
  });

  it('renders spinner animation element', () => {
    const { container } = render(<LoadingSpinner />);
    
    const spinnerElement = container.querySelector('.animate-spin');
    expect(spinnerElement).toBeInTheDocument();
    expect(spinnerElement).toHaveClass('rounded-full', 'h-12', 'w-12', 'border-b-2', 'border-primary');
  });

  it('has correct container structure', () => {
    const { container } = render(<LoadingSpinner />);
    
    const mainContainer = container.firstChild;
    expect(mainContainer).toHaveClass('flex', 'items-center', 'justify-center', 'h-screen');
    expect(mainContainer).toHaveClass('bg-gradient-to-br', 'from-muted', 'to-secondary');
  });

  it('centers content properly', () => {
    const { container } = render(<LoadingSpinner />);
    
    const textCenter = container.querySelector('.text-center');
    expect(textCenter).toBeInTheDocument();
  });
});