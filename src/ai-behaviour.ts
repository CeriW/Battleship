// How 'smart' the AI is, out of 20, with 1 being the easiest and 20 being the hardest
export const difficultyClass: number = 20;

/* istanbul ignore next */
const adjacentShipModifier = (difficultyClass: number) => {
  switch (difficultyClass) {
    case 6:
      return 0.05;
    case 5:
      return 0.1;
    case 4:
      return 0.25;
    case 3:
      return 0.5;
    case 2:
      return 0.7;
    case 1:
      return 1;
    default:
      return 0;
  }
};

export const ai = {
  // How likely it is that the AI will allow ships to be placed touching each other, used in combination with Math.random()
  // Level 1 has 100% chance of allowing adjacent placement. The next few subsequent levels may still allow it, but have progressively less chance of doing so.
  // This was previously simply a boolean based on the difficulty level, but despite being random it placed ships touching each other
  // with surprising frequency. It was not uncommon to have multiple and sometimes all ships touching each other.
  adjacentShipModifier: adjacentShipModifier(difficultyClass),
};
