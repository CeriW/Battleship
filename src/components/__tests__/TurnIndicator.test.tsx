import React from 'react';
import { render, screen, rerender as testingLibraryRerender, cleanup } from '@testing-library/react';
/* If the project config includes @testing-library/jest-dom in setup, matchers like toBeInTheDocument will be available. */
import TurnIndicator, { TurnIndicator as NamedTurnIndicator } from '../TurnIndicator';

describe('TurnIndicator', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders the current player turn text', () => {
    render(<TurnIndicator playerTurn="Alice" />);
    expect(screen.getByText('Alice')).toBeInTheDocument?.() ?? expect(screen.getByText('Alice')).toBeTruthy();
  });

  it('applies the turn-indicator CSS class', () => {
    render(<NamedTurnIndicator playerTurn="Bob" />);
    const el = screen.getByText('Bob');
    expect(el.classList.contains('turn-indicator')).toBe(true);
  });

  it('updates the displayed text when props change', () => {
    const { rerender } = render(<TurnIndicator playerTurn="Carol" />);
    expect(screen.getByText('Carol')).toBeTruthy();

    rerender(<TurnIndicator playerTurn="Dave" />);
    expect(screen.queryByText('Carol')).toBeNull();
    expect(screen.getByText('Dave')).toBeTruthy();
  });

  it('renders nothing visible when given an empty string', () => {
    render(<TurnIndicator playerTurn="" />);
    // There is still a div element; it just has no text content.
    const el = screen.getByText('', { selector: '.turn-indicator' });
    expect(el).toBeTruthy();
    expect(el).toHaveTextContent?.('') ?? expect(el.textContent).toBe('');
  });

  it('supports long and special-character names', () => {
    const longName = '🧙‍♂️ Gandalf the Grey — Keeper of the Secret Fire, Wielder of the Flame of Anor';
    render(<TurnIndicator playerTurn={longName} />);
    expect(screen.getByText(longName)).toBeTruthy();
  });

  it('is resilient at runtime to unexpected non-string inputs (defensive cast in test)', () => {
    // We bypass TypeScript at callsite to simulate a runtime misuse.
    render(<TurnIndicator playerTurn={42 as unknown as string} />);
    expect(screen.getByText('42')).toBeTruthy();
  });
});