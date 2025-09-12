/**
 * Test framework/library: React Testing Library with Jest/Vitest expectations.
 * - Uses @testing-library/react and @testing-library/jest-dom if available in project setup.
 * - Wraps the component with MemoryRouter to support react-router-dom <Link>.
 */

import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import About from './About';

// Try to import jest-dom matchers if present; ignore failure in environments where it's set up globally.
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('@testing-library/jest-dom');
} catch { /* noop */ }

describe('About component', () => {
  function renderAbout() {
    return render(
      <MemoryRouter>
        <About />
      </MemoryRouter>
    );
  }

  test('renders the main heading "ABOUT BATTLESHIP"', () => {
    renderAbout();
    const heading = screen.getByRole('heading', { level: 1, name: /about battleship/i });
    expect(heading).toBeInTheDocument();
  });

  test('displays introduction paragraphs with core phrases', () => {
    renderAbout();
    // Use robust, partial matches to avoid coupling to exact prose changes.
    expect(
      screen.getByText(/classic strategy game/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/sink your opponent/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/ships strategically/i)
    ).toBeInTheDocument();

    // Paragraph about the author and GitHub
    expect(
      screen.getByText(/Ceri Woolway/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/GitHub repository/i)
    ).toBeInTheDocument();
  });

  test('has an external GitHub link with correct attributes', () => {
    renderAbout();
    const githubLink = screen.getByRole('link', { name: /GitHub repository/i });
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute('href', 'https://github.com/CeriW/Battleship');

    // External link security attributes
    expect(githubLink).toHaveAttribute('target', '_blank');
    // rel may contain multiple tokens; verify required ones are present
    expect(githubLink.getAttribute('rel') || '').toMatch(/noopener/);
    expect(githubLink.getAttribute('rel') || '').toMatch(/noreferrer/);
  });

  test('renders a primary navigation link back to the game', () => {
    renderAbout();
    const backLink = screen.getByRole('link', { name: /back to game/i });
    expect(backLink).toBeInTheDocument();

    // In react-router-dom v6, Link renders an <a href="..."> in the DOM.
    // MemoryRouter produces href starting with "/".
    expect(backLink).toHaveAttribute('href', '/');

    // UI class for styling should be present
    expect(backLink).toHaveClass('button');
  });

  test('structure contains key containers with expected class names', () => {
    renderAbout();

    const root = screen.getByRole('heading', { level: 1, name: /about battleship/i }).closest('.about-page');
    // If closest('.about-page') returns null (if heading not nested), fallback to query
    const aboutPage = root || document.querySelector('.about-page');
    expect(aboutPage).toBeInTheDocument();

    const container = within(aboutPage as HTMLElement).getByRole('heading', { level: 1, name: /about battleship/i }).closest('.about-container')
      || document.querySelector('.about-container');
    expect(container).toBeInTheDocument();

    // Content section exists
    const content = (aboutPage as HTMLElement).querySelector('.about-content');
    expect(content).toBeInTheDocument();

    // Actions area contains exactly one link labeled "Back to Game"
    const actions = (aboutPage as HTMLElement).querySelector('.about-actions');
    expect(actions).toBeInTheDocument();
    const links = within(actions as HTMLElement).getAllByRole('link');
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveTextContent(/back to game/i);
  });

  test('does not render unexpected interactive elements', () => {
    renderAbout();
    // No buttons other than the Link styled as a button
    const buttons = screen.queryAllByRole('button');
    expect(buttons.length).toBe(0);

    // No input fields on the static About page
    const inputs = screen.queryAllByRole('textbox');
    expect(inputs.length).toBe(0);
  });

  test('snapshot: key semantic structure remains stable', () => {
    const { container } = renderAbout();
    // Keep snapshot tight to limit noise; focus on the main sections
    const aboutPage = container.querySelector('.about-page');
    expect(aboutPage).toMatchSnapshot();
  });
});