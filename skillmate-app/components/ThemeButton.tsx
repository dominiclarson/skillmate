'use client';
import { Sun, Moon } from 'lucide-react';

export function ThemeButton({ current, onToggle }: { current: 'light' | 'dark'; onToggle: () => void }) {
  return (
    <button onClick={onToggle} aria-label="Toggle theme" className="p-2 rounded focus:outline-none">
      {current === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}