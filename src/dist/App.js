'use strict';
exports.__esModule = true;
exports.App = void 0;
var react_1 = require('react');
require('./index.scss');
var Board_1 = require('./components/Board');
var HeatMapBoard_1 = require('./components/HeatMapBoard');
var placeShips_1 = require('./logic/placeShips');
var ai_behaviour_1 = require('./ai-behaviour');
var calculateHeatMap_1 = require('./logic/calculateHeatMap');
function App() {
  var _a = react_1.useState(placeShips_1.placeShips()),
    computerShips = _a[0],
    setComputerShips = _a[1];
  var _b = react_1.useState(placeShips_1.placeShips()),
    userShips = _b[0],
    setUserShips = _b[1];
  var testHeatMapShips = placeShips_1.initialiseShipArray();
  // testHeatMapShips[1][1] = { name: 'test', status: false };
  var heatMap = calculateHeatMap_1.calculateHeatMap(testHeatMapShips);
  // console.log(computerShips);
  return react_1['default'].createElement(
    react_1['default'].Fragment,
    null,
    react_1['default'].createElement(
      'div',
      { id: 'boards' },
      react_1['default'].createElement('h3', null, 'User board'),
      react_1['default'].createElement(Board_1['default'], { positions: userShips }),
      react_1['default'].createElement('h3', null, 'Heat map'),
      react_1['default'].createElement(HeatMapBoard_1['default'], { positions: heatMap })
    ),
    react_1['default'].createElement('div', null, 'Difficulty: ', ai_behaviour_1.difficultyClass),
    react_1['default'].createElement('div', null, JSON.stringify(ai_behaviour_1.ai, null, 2))
  );
}
exports.App = App;
exports['default'] = App;
