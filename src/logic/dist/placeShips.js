"use strict";
exports.__esModule = true;
exports.placeShips = exports.checkValidShipState = exports.generateRandomPosition = exports.shipTypes = exports.initialiseShipArray = void 0;
var ai_behaviour_1 = require("../ai-behaviour");
function initialiseShipArray() {
    var array = [];
    for (var i = 0; i < 10; i++) {
        array[i] = new Array(10).fill({ name: '', hit: null });
    }
    return array;
}
exports.initialiseShipArray = initialiseShipArray;
exports.shipTypes = [
    { name: 'carrier', size: 5 },
    { name: 'battleship', size: 4 },
    { name: 'cruiser', size: 3 },
    { name: 'submarine', size: 3 },
    { name: 'destroyer', size: 2 },
];
// Generate a random ship position that does not go off the side of the board
exports.generateRandomPosition = function (ship, alignment) {
    if (alignment === void 0) { alignment = (Math.random() > 0.5 ? 'horizontal' : 'vertical'); }
    var startingRow, startingColumn;
    if (alignment === 'horizontal') {
        startingRow = Math.floor(Math.random() * 10);
        startingColumn = Math.floor(Math.random() * (11 - ship.size));
    }
    else {
        // vertical
        startingRow = Math.floor(Math.random() * (11 - ship.size));
        startingColumn = Math.floor(Math.random() * 10);
    }
    return { startingRow: startingRow, startingColumn: startingColumn, alignment: alignment };
};
// Check that for a proposed ship occupation, there are no overlaps with other ships
// Returns true if the state is valid and usable
exports.checkValidShipState = function (_a) {
    var proposedPositions = _a.proposedPositions, shipSize = _a.shipSize, existingPositions = _a.existingPositions, _b = _a.adjacentShipModifier, adjacentShipModifier = _b === void 0 ? ai_behaviour_1.ai.adjacentShipModifier : _b;
    // First check if ship would go out of bounds
    if (proposedPositions.alignment === 'horizontal' && proposedPositions.startingColumn + shipSize > 9)
        return false;
    if (proposedPositions.alignment === 'vertical' && proposedPositions.startingRow + shipSize > 9)
        return false;
    // Make a list of all the cells that this ship could occupy
    var potentialCoordinates = [];
    if (proposedPositions.alignment === 'horizontal') {
        for (var i = 0; i < shipSize; i++) {
            potentialCoordinates.push({
                x: proposedPositions.startingColumn + i,
                y: proposedPositions.startingRow
            });
        }
    }
    else {
        // alignment === 'vertical'
        for (var i = 0; i < shipSize; i++) {
            potentialCoordinates.push({
                x: proposedPositions.startingColumn,
                y: proposedPositions.startingRow + i
            });
        }
    }
    // Figure out whether the spaces are occupied by other ships, as well as adjacent spaces where ai disallows
    var valid = true;
    var adjacentShipsAllowable = Math.random() + adjacentShipModifier >= 1;
    potentialCoordinates.forEach(function (_a) {
        var x = _a.x, y = _a.y;
        if (existingPositions[y][x])
            valid = false; // Check this specific spot
        if (!adjacentShipsAllowable && existingPositions[Math.max(0, y - 1)][x])
            valid = false; // Check row above
        if (!adjacentShipsAllowable && existingPositions[Math.min(9, y + 1)][x])
            valid = false; // Check row below
        if (!adjacentShipsAllowable && existingPositions[y][Math.max(0, x - 1)])
            valid = false; // Check column to left
        if (!adjacentShipsAllowable && existingPositions[y][Math.min(9, x + 1)])
            valid = false; // Check column to right
    });
    return valid;
};
exports.placeShips = function () {
    var positions = initialiseShipArray();
    exports.shipTypes.forEach(function (ship) {
        var validShipState = false;
        while (!validShipState) {
            var proposedPositions = exports.generateRandomPosition(ship);
            validShipState = exports.checkValidShipState({
                proposedPositions: proposedPositions,
                shipSize: ship.size,
                existingPositions: positions
            });
            if (validShipState) {
                if (proposedPositions.alignment === 'horizontal') {
                    for (var i = proposedPositions.startingColumn; i < proposedPositions.startingColumn + ship.size; i++) {
                        positions[proposedPositions.startingRow][i] = { name: ship.name, hit: false };
                    }
                }
                else {
                    // vertical placement
                    for (var i = proposedPositions.startingRow; i < proposedPositions.startingRow + ship.size; i++) {
                        positions[i][proposedPositions.startingColumn] = { name: ship.name, hit: false };
                    }
                }
            }
        }
    });
    return positions;
};
