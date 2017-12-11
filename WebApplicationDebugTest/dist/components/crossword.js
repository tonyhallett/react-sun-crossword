"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var square_1 = require("./square");
var commonStyling_1 = require("./commonStyling");
// State is never set so we use the 'undefined' type.
var Crossword = (function (_super) {
    __extends(Crossword, _super);
    function Crossword() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    //this is wrong do not want to pass through SquareProps as the selected ?
    Crossword.prototype.render = function () {
        var squares = this.props.squares;
        var id = 0; //solely for finding in tests
        var trs = squares.map(function (row, rowIndex) {
            var tds = row.map(function (square, index) {
                id++;
                var square = squares[rowIndex][index];
                //remember that square.selected is callback from the CrosswordPuzzle
                return React.createElement("td", { style: { border: "0px" }, key: index, id: "SquareTd" + id },
                    React.createElement(square_1.Square, { selected: square.selected, letter: square.letter, isSelected: square.isSelected, isWordSelected: square.isWordSelected, solvingMode: square.solvingMode, autoSolved: square.autoSolved, guess: square.guess, identifier: square.identifier, number: square.number }));
            });
            return React.createElement("tr", { key: rowIndex }, tds);
        });
        //could do above inline  ,
        return React.createElement("table", { style: {
                backgroundColor: commonStyling_1.commonColourStyles.blank.backgroundColor, border: "2px solid", borderColor: commonStyling_1.commonColourStyles.blank.backgroundColor, borderCollapse: "collapse"
            } },
            React.createElement("tbody", null, trs));
    };
    return Crossword;
}(React.Component));
exports.Crossword = Crossword;
//# sourceMappingURL=crossword.js.map