"use strict";
const React = require("react");
const square_1 = require("./square");
// State is never set so we use the 'undefined' type.
class Crossword extends React.Component {
    //this is wrong do not want to pass through SquareProps as the selected ?
    render() {
        var squares = this.props.squares;
        var id = 0; //solely for finding in tests
        var trs = squares.map((row, rowIndex) => {
            var tds = row.map((square, index) => {
                id++;
                var square = squares[rowIndex][index];
                //remember that square.selected is callback from the CrosswordPuzzle
                return React.createElement("td", { style: { border: "0px" }, key: index, id: "SquareTd" + id },
                    React.createElement(square_1.Square, { selected: square.selected, letter: square.letter, isSelected: square.isSelected, isWordSelected: square.isWordSelected, solvingMode: square.solvingMode, guess: square.guess, identifier: square.identifier, number: square.number }));
            });
            return React.createElement("tr", { key: rowIndex }, tds);
        });
        //could do above inline  ,
        return React.createElement("table", { style: { backgroundColor: "black", border: "2px solid black", borderCollapse: "collapse" } },
            React.createElement("tbody", null, trs));
    }
}
exports.Crossword = Crossword;
//# sourceMappingURL=crossword.js.map