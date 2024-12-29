// How 'smart' the AI is, out of 20, with 1 being the easiest and 20 being the hardest
export const difficultyClass: number = 20;

export const ai = {
  // Whether the AI will place ships touching each other.
  // This is not advised for strategy reasons - it is easy for a player to
  // accidentally get two ships in streak, hence the low number
  // Despite the positioning being random, it is surprising how often it will
  // place ships touching each other when this is true
  willPlaceShipsAdjacent: difficultyClass < 3,
};
