module.exports = {
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest', // This tells Jest to use babel-jest for transforming JS/TS files
  },
  testEnvironment: 'jsdom', // Make sure you're using jsdom for DOM testing
};
