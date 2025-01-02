"use strict";
exports.__esModule = true;
exports.Board = void 0;
var react_1 = require("react");
exports.Board = function (_a) {
    var _b, _c;
    var positions = _a.positions;
    var columnMarkers = [];
    for (var i = 0; i <= 10; i++) {
        columnMarkers.push(react_1["default"].createElement("div", { key: "column-marker-" + i, className: "column-marker", "data-testid": "column-marker" }, i === 0 ? '' : i));
    }
    var letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    var rows = [];
    for (var i = 0; i < letters.length; i++) {
        var cells = [];
        for (var j = 0; j < 10; j++) {
            cells.push(react_1["default"].createElement("div", { key: "cell-" + letters[i] + "-" + j, className: "cell " + ((_c = (_b = positions[i][j]) === null || _b === void 0 ? void 0 : _b.name) !== null && _c !== void 0 ? _c : ''), "data-testid": "cell" }));
        }
        rows.push(react_1["default"].createElement("div", { className: "row", key: "row-" + i },
            react_1["default"].createElement("div", { className: "row-marker", key: "row-marker-" + i, "data-testid": "row-marker" }, letters[i]),
            cells));
    }
    return (react_1["default"].createElement("div", { className: "board", "data-testid": "board" },
        columnMarkers,
        rows));
};
exports["default"] = exports.Board;
