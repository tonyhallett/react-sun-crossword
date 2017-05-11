"use strict";
const React = require("react");
const crossword_1 = require("./crossword");
class CrosswordPuzzle extends React.Component {
    _mapGrid(grid) {
        var self = this;
        return grid.map(row => {
            return row.map(square => {
                return { identifier: square, selected: this.squareSelected, isSelected: square.selected, isWordSelected: square.wordSelected, solvingMode: square.solvingMode, number: square.number, letter: square.letter, guess: square.guess };
            });
        });
    }
    squareSelected(square) {
        if (square.letter !== "") {
        }
    }
    render() {
        return React.createElement(crossword_1.Crossword, { squares: this._mapGrid(this.props.crosswordModel.grid) });
    }
}
exports.CrosswordPuzzle = CrosswordPuzzle;
//# sourceMappingURL=crosswordPuzzle.js.map