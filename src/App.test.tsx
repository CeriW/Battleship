/**
 * Tests for App and GameBoards components.
 * Framework: Jest (or Vitest with jest-compatible APIs) + @testing-library/react.
 * Focus: route rendering, conditional boards/screens, turn indicator, CSS class toggling,
 * and computer-turn timed behavior invoking useMakeComputerGuess and setAvatar with COMPUTER_THINKING.
 */
import React from 'react';
import { render, screen, within, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// The App under test uses BrowserRouter internally.
import App from './App';

// Mocks for modules used inside App/GameBoards
// 1) Mock SCSS import if Jest moduleNameMapper is not configured (noop module).
jest.mock('./index.scss', () => ({}), { virtual: true });

// 2) Mock components with simple test-ids to focus on App wiring logic.
jest.mock('./components/Window', () => ({
  __esModule: true,
  default: ({ title, className, children }: any) => (
    <div data-testid={`window-${title || 'no-title'}`} data-classname={className}>
      {children}
    </div>
  ),
}));

jest.mock('./components/Board', () => ({
  __esModule: true,
  default: ({ positions }: any) => <div data-testid="board" data-positions={JSON.stringify(positions)} />,
}));

jest.mock('./components/UserGuessBoard', () => ({
  __esModule: true,
  default: () => <div data-testid="user-guess-board" />,
}));

jest.mock('./components/Log', () => ({
  __esModule: true,
  Log: () => <div data-testid="log" />,
}));

jest.mock('./components/TurnIndicator', () => ({
  __esModule: true,
  TurnIndicator: ({ playerTurn }: any) => <div data-testid="turn-indicator">{playerTurn}</div>,
}));

// Expose GameEvents enum for assertions and mock Avatar to display current event.
const AvatarModule = jest.requireActual('./components/Avatar');
const { GameEvents } = AvatarModule as any;
jest.mock('./components/Avatar', () => {
  const actual = jest.requireActual('./components/Avatar');
  return {
    __esModule: true,
    ...actual,
    Avatar: ({ gameEvent }: any) => <div data-testid="avatar" data-event={gameEvent} />,
  };
});

// Mock deriveAvatarName to deterministic output for aiLevel.
jest.mock('./components/Avatar', () => {
  const original = jest.requireActual('./components/Avatar');
  return {
    __esModule: true,
    ...original,
    deriveAvatarName: (aiLevel: string) => `AI-${aiLevel}`,
    Avatar: ({ gameEvent }: any) => <div data-testid="avatar" data-event={gameEvent} />,
    GameEvents: original.GameEvents,
  };
});

// 3) Critical hook mock: useMakeComputerGuess should be a spy function to verify invocation timing.
const makeGuessSpy = jest.fn();
jest.mock('./logic/makeComputerGuess', () => ({
  __esModule: true,
  useMakeComputerGuess: () => makeGuessSpy,
}));

// 4) Mock leaf screens to simple stubs.
jest.mock('./components/StartScreen', () => ({
  __esModule: true,
  StartScreen: () => <div data-testid="start-screen" />,
}));
jest.mock('./logic/GameEndScreen', () => ({
  __esModule: true,
  GameEndScreen: ({ winner }: any) => <div data-testid="end-screen">{`winner:${winner}`}</div>,
}));
jest.mock('./components/Status', () => ({
  __esModule: true,
  Status: () => <div data-testid="status" />,
}));
jest.mock('./components/About', () => ({
  __esModule: true,
  About: () => <div data-testid="about">About page</div>,
}));

// 5) Provide a controlled GameContext provider to set game state scenarios.
import { GameContext } from './GameContext';

// Helper: render just the inner boards by rendering App and then locating container, or directly render a provider with children from App file.
// App internally nests <GameProvider><GameBoards /></GameProvider> on route "/". To drive GameBoards state, we bypass GameProvider
// by rendering a custom provider around the exported App's GameBoards via route "/" (not exported). Instead, we simulate via App but
// patch GameContext.Provider at runtime to override values. We monkey-patch React.createElement for GameProvider usage if needed.
// Simpler: we render a small harness that mimics GameBoards usage by injecting a Provider wrapping a minimal copy of the element tree.
// Since GameBoards is not exported, we emulate the App's behavior by replacing GameProvider with our injected Provider via jest.mock.

const baseContext = {
  userShips: [{ x: 0, y: 0 }],
  aiLevel: 'easy',
  avatar: { gameEvent: GameEvents.IDLE ?? 'IDLE' },
  setAvatar: jest.fn(),
  gameStatus: 'unstarted',
  setgameStatus: jest.fn(),
};

function withContext(ui: React.ReactElement, ctxOverrides: Partial<typeof baseContext> = {}) {
  const value = { ...baseContext, ...ctxOverrides };
  return <GameContext.Provider value={value as any}>{ui}</GameContext.Provider>;
}

// Selectors
const getGameContainer = () => screen.queryByRole('region', { name: /game-container/i }) || screen.queryByTestId('game-container');

// Because the real markup uses divs/classes, we assert via class presence on rendered DOM.
function expectPlayerGuessBoardClass(expected: 'user-turn' | 'computer-turn') {
  const el = document.querySelector('.player-guess-board');
  expect(el).toBeInTheDocument();
  expect((el as HTMLElement).className).toContain(expected);
}

// Timers for computer think/guess flow
beforeEach(() => {
  jest.useFakeTimers();
  makeGuessSpy.mockClear();
  (baseContext.setAvatar as jest.Mock).mockClear();
});

afterEach(() => {
  jest.useRealTimers();
});

// 1) Renders StartScreen when unstarted
test('renders StartScreen when gameStatus is unstarted', () => {
  render(withContext(<App /> as any, { gameStatus: 'unstarted' }));
  expect(screen.getByTestId('start-screen')).toBeInTheDocument();
  expect(screen.queryByTestId('end-screen')).not.toBeInTheDocument();
  expect(screen.queryByTestId('user-guess-board')).not.toBeInTheDocument();
});

// 2) Renders end screens for both winners
test('renders user win end screen', () => {
  render(withContext(<App /> as any, { gameStatus: 'user-win' }));
  expect(screen.getByTestId('end-screen')).toHaveTextContent('winner:user');
});

test('renders computer win end screen', () => {
  render(withContext(<App /> as any, { gameStatus: 'computer-win' }));
  expect(screen.getByTestId('end-screen')).toHaveTextContent('winner:computer');
});

// 3) When in active play, shows boards, status, log, and correct turn indicator text for user/computer
test('active play (user-turn): renders boards and shows "Your turn"', () => {
  render(withContext(<App /> as any, { gameStatus: 'user-turn' }));
  expect(screen.getByTestId('user-guess-board')).toBeInTheDocument();
  expect(screen.getByTestId('status')).toBeInTheDocument();
  expect(screen.getByTestId('log')).toBeInTheDocument();
  expect(screen.getByTestId('board')).toHaveAttribute('data-positions', JSON.stringify([{ x: 0, y: 0 }]));
  expect(screen.getByTestId('turn-indicator')).toHaveTextContent('Your turn');
  expectPlayerGuessBoardClass('user-turn');
});

test("active play (computer-turn): shows AI's turn and toggles class", () => {
  render(withContext(<App /> as any, { gameStatus: 'computer-turn', aiLevel: 'hard' }));
  expect(screen.getByTestId('turn-indicator')).toHaveTextContent("AI-hard's turn");
  expectPlayerGuessBoardClass('computer-turn');
});

// 4) Computer turn effects: setAvatar(COMPUTER_THINKING) then makeComputerGuess after timers
test('computer-turn triggers thinking event then makeComputerGuess after delays', () => {
  const setAvatarMock = jest.fn();
  render(withContext(<App /> as any, { gameStatus: 'computer-turn', setAvatar: setAvatarMock }));

  // First half delay -> COMPUTER_THINKING
  act(() => {
    jest.advanceTimersByTime(350); // computerThinkingTime/2
  });
  expect(setAvatarMock).toHaveBeenCalledWith({ gameEvent: GameEvents.COMPUTER_THINKING });

  // Second half -> make guess
  act(() => {
    jest.advanceTimersByTime(350);
  });
  expect(makeGuessSpy).toHaveBeenCalledTimes(1);
});

// 5) Guard: effect should not re-enter while in progress (debounce via ref)
test('computer-turn effect runs once even if timers run multiple times', () => {
  render(withContext(<App /> as any, { gameStatus: 'computer-turn' }));

  act(() => {
    jest.advanceTimersByTime(700); // full cycle
    jest.advanceTimersByTime(700); // extra cycle; without status change it should not double-call
  });
  expect(makeGuessSpy).toHaveBeenCalledTimes(1);
});

// 6) Route: /about renders About page (App contains its own BrowserRouter)
test('navigating to /about renders About component', () => {
  window.history.pushState({}, '', '/about');
  render(<App />);
  expect(screen.getByTestId('about')).toHaveTextContent('About page');
});

// 7) Avatar window className reflects derived avatar name ("computer-avatar AI-easy") and avatar event propagates
test('avatar window class includes derived AI name and passes avatar event', () => {
  render(withContext(<App /> as any, { gameStatus: 'user-turn', aiLevel: 'easy', avatar: { gameEvent: 'HAPPY' } }));
  const avatar = screen.getByTestId('avatar');
  expect(avatar).toHaveAttribute('data-event', 'HAPPY');

  // The Window mock exposes className as data-classname; verify it contains derived class
  const win = screen.getByTestId('window-no-title');
  expect(win).toHaveAttribute('data-classname', expect.stringContaining('computer-avatar AI-easy'));
});