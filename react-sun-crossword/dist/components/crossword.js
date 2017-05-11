"use strict";
const React = require("react");
const square_1 = require("./square");
// State is never set so we use the 'undefined' type.
class Crossword extends React.Component {
    render() {
        var squares = this.props.squares;
        var trs = squares.map((row, rowIndex) => {
            var tds = row.map((square, index) => {
                var square = squares[rowIndex][index];
                return React.createElement("td", { key: index },
                    React.createElement(square_1.Square, { selected: square.selected, letter: square.letter, isSelected: square.isSelected, isWordSelected: square.isWordSelected, solvingMode: square.solvingMode, guess: square.guess, identifier: square.identifier, number: square.number }));
            });
            return React.createElement("tr", { key: rowIndex }, tds);
        });
        //could do above inline
        return React.createElement("table", null,
            React.createElement("tbody", null, trs));
    }
}
exports.Crossword = Crossword;
//# sourceMappingURL=crossword.js.map