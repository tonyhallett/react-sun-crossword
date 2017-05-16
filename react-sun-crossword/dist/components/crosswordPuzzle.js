"use strict";
const React = require("react");
const crossword_1 = require("./crossword");
class CrosswordPuzzle extends React.Component {
    constructor() {
        super(...arguments);
        //this context lost otherwise
        this.squareSelected = (square) => {
            var requiresRender = false;
            if (square.letter !== "") {
                var previousSelectedSquare = this.props.crosswordModel.selectedSquare;
                var sameSquare = square.selected;
                if (!sameSquare) {
                    if (previousSelectedSquare) {
                        previousSelectedSquare.selected = false;
                    }
                    this._selectSquare(square);
                    requiresRender = true;
                }
                var wordToSelect;
                if (square.acrossWord !== null && square.downWord !== null) {
                    if (sameSquare) {
                        wordToSelect = this.props.crosswordModel.selectedWord == square.acrossWord ? square.downWord : square.acrossWord;
                        requiresRender = true;
                    }
                    else {
                        wordToSelect = square.acrossWord;
                        if (square.number !== "") {
                            if (this._squareIsStartOfWord(square, false)) {
                                if (!this._squareIsStartOfWord(square, true)) {
                                    wordToSelect = square.downWord;
                                }
                            }
                        }
                    }
                }
                else {
                    wordToSelect = square.acrossWord ? square.acrossWord : square.downWord;
                }
                this._selectWord(wordToSelect);
            }
            if (requiresRender) {
                this.forceUpdate();
            }
        };
    }
    _mapGrid(grid) {
        var self = this;
        var mappedGrid = grid.map(row => {
            return row.map(square => {
                return { identifier: square, selected: this.squareSelected, isSelected: square.selected, isWordSelected: square.wordSelected, solvingMode: square.solvingMode, number: square.number, letter: square.letter, guess: square.guess };
            });
        });
        console;
        return mappedGrid;
    }
    _selectWord(selectedWord) {
        if (this.props.crosswordModel.selectedWord) {
            this._setWordSquaresSelection(this.props.crosswordModel.selectedWord, false);
        }
        this._setWordSquaresSelection(selectedWord, true);
        this.props.crosswordModel.selectedWord = selectedWord;
    }
    _setWordSquaresSelection(word, select) {
        word.squares.forEach(square => {
            square.wordSelected = select;
        });
    }
    _selectSquare(square) {
        square.selected = true;
        this.props.crosswordModel.selectedSquare = square;
    }
    //method of square model
    _squareIsStartOfWord(square, across) {
        var word = across ? square.acrossWord : square.downWord;
        var index = word.squares.indexOf(square);
        return index === 0;
    }
    render() {
        return React.createElement(crossword_1.Crossword, { squares: this._mapGrid(this.props.crosswordModel.grid) });
    }
}
exports.CrosswordPuzzle = CrosswordPuzzle;
//# sourceMappingURL=crosswordPuzzle.js.map