"use strict";
exports.__esModule = true;
exports.calculateHeatMap = exports.initialiseHeatMapArray = void 0;
function initialiseHeatMapArray() {
    var array = [];
    for (var i = 0; i < 10; i++) {
        array[i] = new Array(10).fill(0);
    }
    return array;
}
exports.initialiseHeatMapArray = initialiseHeatMapArray;
var cellStates;
(function (cellStates) {
    cellStates[cellStates["hit"] = -1] = "hit";
    cellStates[cellStates["miss"] = -100] = "miss";
})(cellStates || (cellStates = {}));
var cellHasNotBeenGuessed = function (cell) {
    return cell !== cellStates.hit && cell !== cellStates.miss;
};
exports.calculateHeatMap = function (existingBoard) {
    var _a, _b;
    var heatMap = initialiseHeatMapArray();
    for (var x = 0; x < 10; x++) {
        for (var y = 0; y < 10; y++) {
            //  If we already have a hit in this cell, it's dead on the heatmap
            if (((_a = existingBoard[y][x]) === null || _a === void 0 ? void 0 : _a.hit) === true) {
                heatMap[y][x] = cellStates.hit;
            }
            if (((_b = existingBoard[y][x]) === null || _b === void 0 ? void 0 : _b.hit) === false) {
                heatMap[y][x] = cellStates.miss;
            }
        }
    }
    // Now we've figured out where all the hits are, we can mark the adjacent cells as possible hits
    for (var i = 0; i < 100; i++) {
        var y = Math.floor(i / 10);
        var x = i % 10;
        //  If this cell is a hit...
        if (heatMap[y][x] === cellStates.hit) {
            // MARK ADJACENT CELLS AS HOT INDISCRIMINATELY ---------------------------
            // If we're not in the first row, and the cell above is not a hit, then it's hot
            if (y > 0 && cellHasNotBeenGuessed(heatMap[y - 1][x])) {
                heatMap[y - 1][x] += 1;
            }
            // If we're not in the last row, and the cell below is not a hit, then it's hot
            if (y < 9 && cellHasNotBeenGuessed(heatMap[y + 1][x])) {
                heatMap[y + 1][x] += 1;
            }
            // If we're not in the last column, and the cell to the right is not a hit, then it's hot
            if (x < 9 && cellHasNotBeenGuessed(heatMap[y][x + 1])) {
                heatMap[y][x + 1] += 1;
            }
            // If we're not in the first column, and the cell to the left is not a hit, then it's hot
            if (x > 0 && cellHasNotBeenGuessed(heatMap[y][x - 1])) {
                heatMap[y][x - 1] += 1;
            }
            // GO ALONG THE ROWS FOR EXTRA HEAT --------------------------------------
            // Is the cell to the left also a hit?
            if (x > 0 && heatMap[y][x - 1] === -1) {
                // If it is, we're going to keep going left until we find an empty space and make it even hotter
                for (var i_1 = x; i_1 >= 0; i_1--) {
                    if (cellHasNotBeenGuessed(heatMap[y][i_1])) {
                        heatMap[y][i_1] += 1;
                        if (i_1 - 1 >= 0 && cellHasNotBeenGuessed(heatMap[y][i_1 - 1])) {
                            heatMap[y][i_1 - 1] += 1;
                        }
                        break;
                    }
                }
            }
            // Is the cell to the right also a hit?
            if (x < 10 && heatMap[y][x + 1] === -1) {
                // If it is, we're going to keep going right until we find an empty space and make it even hotter
                for (var i_2 = x; i_2 < 9; i_2++) {
                    if (cellHasNotBeenGuessed(heatMap[y][i_2])) {
                        heatMap[y][i_2] += 1;
                        if (i_2 + 1 < 10 && cellHasNotBeenGuessed(heatMap[y][i_2 + 1])) {
                            heatMap[y][i_2 + 1] += 1;
                        }
                        break;
                    }
                }
            }
            // GO ALONG THE COLUMNS FOR EXTRA HEAT -----------------------------------
            // Is the cell above also a hit?
            if (y > 0 && heatMap[y - 1][x] === -1) {
                // If it is, we're going to keep going up until we find an empty space and make it even hotter
                for (var i_3 = y; i_3 >= 0; i_3--) {
                    if (cellHasNotBeenGuessed(heatMap[i_3][x])) {
                        heatMap[i_3][x] += 1;
                        if (i_3 - 1 >= 0) {
                            heatMap[i_3 - 1][x] += 1;
                        }
                        break;
                    }
                }
            }
            // Is the cell below also a hit?
            if (y < 9 && heatMap[y + 1][x] === -1) {
                // If it is, we're going to keep going up until we find an empty space and make it even hotter
                for (var i_4 = y; i_4 < 10; i_4++) {
                    if (cellHasNotBeenGuessed(heatMap[i_4][x])) {
                        heatMap[i_4][x] += 1;
                        if (i_4 + 1 < 10) {
                            heatMap[i_4 + 1][x] += 1;
                        }
                        break;
                    }
                }
            }
        }
    }
    console.log(heatMap);
    return heatMap;
};
