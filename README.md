![Coverage](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/<your-username>/<your-gist-id>/raw/coverage.json)

# About Battleship

Battleship is a traditional two-player strategy game where players try to sink each others' ships by correctly guessing their hidden locations on a 10x10 grid.

## Getting started

Each player begins by placing their battleships on a 10x10 grid. This grid should be kept hidden from the other player. Historically battleships was played on [pieces of paper](https://lh5.googleusercontent.com/proxy/6S6dYiq4uoNEDfTBDkFmJDnvBcQ5M5AqViWKJ_9KJtDsfcP89w_6KId5FuWAU4lje_eswDtVqMmc3_xG6-U), although today Battleships is often played using a [physical board designed to prevent the other playing from seeing](https://www.hasbro.com/common/productimages/en_GB/54D1C85ECFBE46259A9E53C36F4D136C/51b6f589a1a02e5f8afa01b73c19a85ee9de6557.jpg).

The 10x10 grid is labelled with rows A-J and columns 1-10, which players will reference when guessing locations. Each player will have two grids - one where they mark where their own battleships are, and a second blank one where they keep track of their correct and incorrect guesses of the other player's ships.

### The fleet

Each player has five battleships of different sizes:

- Carrier (5 tiles long)
- Battleship (4 tiles long)
- Cruiser (3 tiles long)
- Submarine (3 tiles long)
- Destroyer (2 tiles long)

Players may place these ships in any position they like on the board vertically or horizontally (but not diagonally). The ships must be contained entirely within the board (they cannot go off the side). From a strategy perspective it is usually best to space your ships around the board and especially not touching each other, but the players are free to place them wherever they like.

### Starting play

There is no official rule on how you decide which player goes first. It might be a coin toss, rock-paper-scissors, agreement between players, who places their ships first, or any other method.

## How to play

1. Players take it in turns to guess where their opponent's ships are by calling out grid co-ordinates e.g. "B7"
2. The other player responds with "hit" if they have a ship there, or "miss" if it doesn't.
3. The player then marks on their grid the result. Most physical board game versions of Battleships have red or white pegs that the player can place on their grid to keep track of correct and incorrect guesses respectively, whereas for on-paper versions a tick or cross might be used, or tiles may be filled in with different coloured pens. As a player you may also keep track of which correct guesses the other player has made.
4. When a player correctly guesses every tile for a given ship, that ship is considered sunk.
5. The game is won when a player has sunk all of the other player's ships in their entirety.

## Strategy

At its most basic level, the ships may be placed randomly and any guesses made may be random. However in practice there are a number strategies of various practical and psychological complexity that may dramatically increase your chances of winning:

### Ship placement strategies

- Spread out your ships and avoid clustering them close together.
- Use a mixture of horizontal and vertical placement
- Consider use of the edges. Players tend to guess in the middle of the board, so placing ships at the edges may give you an advantage. Conversely, if a player knows you are prone to doing this, it may do the opposite.
- Use irregular patterns. Most people tend to favour something resembling symmetry in their placement. Consider breaking this trend.

### Guessing strategies

The basic strategy of random guessing is not recommended. Typically games where you randomly guess will take a minimum of 78 shots in order to win. You can dramatically decrease this and increase your chances of winning by guessing more strategically.

- Hunt and target method - guess randomly until you find a ship. Once you do, guess the adjacent horizontal and vertical tiles until you find the entirety of the ship. This reduces the average number of required guesses to 65.
- Guess in a checkerboard pattern. It is impossible to miss a ship using this strategy. Using this alongside the hunt and target method reduces the average number of shots to 60.
- Use your smarts. As the game goes on and you get more information on where the ships are and aren't, as well as which ships are still in play, you can figure out where the ships are more likely to be. For example, if only the 5 tile long carrier remains, you can rule out any pockets where gaps are smaller than this. Someone who is good at thinking this way generally reduces their required number of shots into the 30s-40s. Of course, this is much more difficult for a human than a correctly coded computer version.
- Most players tend to space out their ships. If you establish a hit in one area, it may be unlikely that other ships are nearby. Of course, a player might choose to place their ships close together in order to counteract this strategy.

## Turning Battleships into a browser-based game

The purpose of this project is to code a browser-based version of this game using Javascript and React in which the player can guess against the computer. Given the various strategies above have varying levels of complexity, it may be a good idea to code different difficulty levels which the player can choose from. The computer should be able to (if not necessarily all at the same time):

- Guess randomly
- Guess in a checkerboard formation
- Generate a "heat map" where it can figure out based on previous guesses where ships are and aren't likely or possible to be, and base its guesses on that.
- Once it makes a correct guess, continue to guess the adjacent horizontal and vertical spaces until it has sunk the ship entirely, and then return to whatever guessing pattern it was previously employing.
  - Of course, once it has established that the ship is places horizontally it should not continue guessing vertically and vice-versa. If it continues guessing it one direction and then gets a miss, it needs to start guessing from the other end.
- Place its ships randomly
- Place its ships with some "gotchas" e.g. deliberately choosing to place ships close together, placing ships at the edges, placing ships asymmetrically.

### Player experience

- The player needs to be able to place their ships appropriately and be prevented from choosing any illegal positions e.g. overlapping, off the side of the board.
- The game should keep track of correct and incorrect guesses automatically.
- If deemed appropriate, the player could be able to choose different levels of difficulty from the computer.
- It should be accessible and use aria attributes and appropriate semantic HTML.
- It should have a mechanism to decide which player goes first. This might be random or implement a rock-paper-scissors approach.
- It may be an option to guide the player by having a visible or toggleable heatmap advising which squares are most likely to contain a ship.
- It should have the ability to save your game to come back to later.

### The tech stack

- The primary goal of this project is to deepen my knowledge of React, which at the time of writing is on a somewhat surface level.
- The templating language will be JSX.
- It should use Typescript rather than plain Javascript.
- There are a number of different approaches I could use for styling:
  - SCSS since this is what I am most familiar with
  - Vanilla CSS since I am aware that many of the features that moved me to SCSS years ago are now supported in vanilla CSS.
  - Something I am far less familiar with like LESS or Tailwind.
- It should use Jest to test both the UI and data layers. This will be particularly useful when creating the "heat map" to be able to determine where the optimal position to guess is.
- The Jest tests should form part of a CI/CD pipeline to enable me to determine where things have broken or degraded along the way.
- It should use Git version control
- It should be publicly viewable online using Netlify (I have found this much more flexible than Github pages in the past).
- It should be set up with Google Analytics

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
