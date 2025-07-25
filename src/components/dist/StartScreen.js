"use strict";
exports.__esModule = true;
exports.GameScreen = exports.StartScreen = void 0;
var react_1 = require("react");
var game_title_png_1 = require("../img/game-title.png");
var happy_png_1 = require("../img/avatars/emily/happy.png");
var happy_png_2 = require("../img/avatars/alex/happy.png");
var happy_png_3 = require("../img/avatars/natasha/happy.png");
exports.StartScreen = function () {
    return (react_1["default"].createElement("div", { className: "start-screen" },
        react_1["default"].createElement("img", { src: game_title_png_1["default"], alt: "Battleship" }),
        react_1["default"].createElement("div", { className: "difficulty-selector" },
            react_1["default"].createElement("div", { className: "difficulty-selector-item emily" },
                react_1["default"].createElement("img", { src: happy_png_1["default"], alt: "Emily" }),
                react_1["default"].createElement("div", { className: "difficulty-selector-item-name" },
                    react_1["default"].createElement("div", { className: "difficulty-selector-name" }, "Emily"),
                    react_1["default"].createElement("div", { className: "difficulty-selector-description" }, "Easy"))),
            react_1["default"].createElement("div", { className: "difficulty-selector-item alex" },
                react_1["default"].createElement("img", { src: happy_png_2["default"], alt: "Alex" }),
                react_1["default"].createElement("div", { className: "difficulty-selector-item-name" },
                    react_1["default"].createElement("div", { className: "difficulty-selector-name" }, "Alex"),
                    react_1["default"].createElement("div", { className: "difficulty-selector-description" }, "Medium"))),
            react_1["default"].createElement("div", { className: "difficulty-selector-item natasha" },
                react_1["default"].createElement("img", { src: happy_png_3["default"], alt: "Natasha" }),
                react_1["default"].createElement("div", { className: "difficulty-selector-item-name" },
                    react_1["default"].createElement("div", { className: "difficulty-selector-name" }, "Natasha"),
                    react_1["default"].createElement("div", { className: "difficulty-selector-description" }, "Hard"))))));
};
exports.GameScreen = function () {
    return react_1["default"].createElement("div", null, "GameScreen");
};
