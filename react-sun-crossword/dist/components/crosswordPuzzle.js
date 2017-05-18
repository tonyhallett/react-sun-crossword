"use strict";
const React = require("react");
const crossword_1 = require("./crossword");
const KeyEvents = require("../lib/key-handler");
class CrosswordPuzzle extends React.Component {
    constructor(props) {
        super(props);
        //this context lost otherwise
        this.squareSelected = (rowColIndices) => {
            var square = this.props.crosswordModel.grid[rowColIndices.row][rowColIndices.col];
            this.performSelection(square);
        };
        this.autoSolve = true;
        this.state = { squares: this.getTheState() };
    }
    //changed how solving mode is managed - square.solvingMode
    _mapGrid(grid) {
        var self = this;
        var mappedGrid = grid.map((row, rowIndex) => {
            return row.map((square, colIndex) => {
                return {
                    identifier: { row: rowIndex, col: colIndex }, selected: this.squareSelected, isSelected: square.selected, isWordSelected: square.wordSelected, solvingMode: this.props.crosswordModel.solvingMode, number: square.number, letter: square.letter, guess: square.guess
                };
            });
        });
        return mappedGrid;
    }
    _selectWord(selectedWord) {
        if (this.props.crosswordModel.selectedWord !== selectedWord) {
            if (this.props.crosswordModel.selectedWord) {
                //this._setWordSquaresSelection(this.props.crosswordModel.selectedWord, false);
                this.props.crosswordModel.selectedWord.deselect();
            }
            selectedWord.select();
            this.props.crosswordModel.selectedWord = selectedWord;
        }
    }
    //the crosswordModel selectedCell property should deal with it - but interface 
    _selectSquare(square) {
        var previousSelectedSquare = this.props.crosswordModel.selectedSquare;
        if (previousSelectedSquare) {
            previousSelectedSquare.selected = false;
        }
        square.selected = true;
        this.props.crosswordModel.selectedSquare = square;
    }
    //method of square model
    _squareIsStartOfWord(square, across) {
        var word = across ? square.acrossWord : square.downWord;
        var index = word.squares.indexOf(square);
        return index === 0;
    }
    performSelection(square, wordSelectWord = false) {
        var requiresRender = false;
        if (square.letter !== "") {
            var previousSelectedWord = this.props.crosswordModel.selectedWord;
            //leave here as _selectSquare changes
            var previousSelectedSquare = this.props.crosswordModel.selectedSquare;
            var sameSquare = square.selected;
            if (!sameSquare) {
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
                    var determinePreference = true;
                    if (wordSelectWord) {
                        if (previousSelectedSquare.acrossWord === square.acrossWord || previousSelectedSquare.downWord === square.downWord) {
                            wordToSelect = this.props.crosswordModel.selectedWord;
                            determinePreference = false;
                        }
                    }
                    if (determinePreference) {
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
            }
            else {
                wordToSelect = square.acrossWord ? square.acrossWord : square.downWord;
            }
            this._selectWord(wordToSelect);
        }
        if (requiresRender) {
            this.setTheState();
        }
    }
    arrowDown() {
        var crosswordModel = this.props.crosswordModel;
        var selectedSquare = crosswordModel.selectedSquare;
        if (selectedSquare) {
            var grid = crosswordModel.grid;
            var numSquaresInColumn = grid.length; //instead of recalculating - props on the model
            var nextNonBlankSquare;
            var nextSquareRowIndex = selectedSquare.rowIndex;
            var colIndex = selectedSquare.columnIndex;
            while (!nextNonBlankSquare) {
                nextSquareRowIndex = nextSquareRowIndex == numSquaresInColumn - 1 ? 0 : nextSquareRowIndex + 1;
                var nextSquare = grid[nextSquareRowIndex][colIndex];
                if (nextSquare.letter !== "") {
                    nextNonBlankSquare = nextSquare;
                    break;
                }
            }
            this.performSelection(nextNonBlankSquare, true);
        }
    }
    arrowLeft() {
        var crosswordModel = this.props.crosswordModel;
        var selectedSquare = crosswordModel.selectedSquare;
        if (selectedSquare) {
            var grid = crosswordModel.grid;
            var numSquaresInRow = grid[0].length; //instead of recalculating - props on the model
            var nextNonBlankSquare;
            var nextSquareColIndex = selectedSquare.columnIndex;
            var rowIndex = selectedSquare.rowIndex;
            while (!nextNonBlankSquare) {
                nextSquareColIndex = nextSquareColIndex == 0 ? numSquaresInRow - 1 : nextSquareColIndex - 1;
                var nextSquare = grid[rowIndex][nextSquareColIndex];
                if (nextSquare.letter !== "") {
                    nextNonBlankSquare = nextSquare;
                    break;
                }
            }
            this.performSelection(nextNonBlankSquare, true);
        }
    }
    arrowRight() {
        var crosswordModel = this.props.crosswordModel;
        var selectedSquare = crosswordModel.selectedSquare;
        if (selectedSquare) {
            var grid = crosswordModel.grid;
            var numSquaresInRow = grid[0].length; //instead of recalculating - props on the model
            var nextNonBlankSquare;
            var nextSquareColIndex = selectedSquare.columnIndex;
            var rowIndex = selectedSquare.rowIndex;
            while (!nextNonBlankSquare) {
                nextSquareColIndex = nextSquareColIndex == numSquaresInRow - 1 ? 0 : nextSquareColIndex + 1;
                var nextSquare = grid[rowIndex][nextSquareColIndex];
                if (nextSquare.letter !== "") {
                    nextNonBlankSquare = nextSquare;
                    break;
                }
            }
            this.performSelection(nextNonBlankSquare, true);
        }
    }
    arrowUp() {
        var crosswordModel = this.props.crosswordModel;
        var selectedSquare = crosswordModel.selectedSquare;
        if (selectedSquare) {
            var grid = crosswordModel.grid;
            var numSquaresInColumn = grid.length; //instead of recalculating - props on the model
            var nextNonBlankSquare;
            var nextSquareRowIndex = selectedSquare.rowIndex;
            var colIndex = selectedSquare.columnIndex;
            while (!nextNonBlankSquare) {
                nextSquareRowIndex = nextSquareRowIndex == 0 ? numSquaresInColumn - 1 : nextSquareRowIndex - 1;
                var nextSquare = grid[nextSquareRowIndex][colIndex];
                if (nextSquare.letter !== "") {
                    nextNonBlankSquare = nextSquare;
                    break;
                }
            }
            this.performSelection(nextNonBlankSquare, true);
        }
    }
    backspace() {
        var selectedSquare = this.props.crosswordModel.selectedSquare;
        if (selectedSquare) {
            var requiresRender;
            if (selectedSquare.guess !== "") {
                selectedSquare.guess = "";
                requiresRender = true;
            }
            var selectedWord = this.props.crosswordModel.selectedWord;
            if (selectedWord.squares.indexOf(selectedSquare) !== 0) {
                if (selectedWord.isAcross) {
                    this.arrowLeft();
                }
                else {
                    this.arrowUp();
                }
            }
            else {
                if (requiresRender) {
                    this.setTheState();
                }
            }
        }
    }
    keyGuess(event, keyValue) {
        var selectedSquare = this.props.crosswordModel.selectedSquare;
        if (selectedSquare) {
            var guess = keyValue.toUpperCase();
            var requiresRender;
            if (selectedSquare.guess !== guess) {
                selectedSquare.guess = guess;
                requiresRender = true;
            }
            var selectedWord = this.props.crosswordModel.selectedWord;
            if (selectedWord.squares.indexOf(selectedSquare) !== selectedWord.squares.length - 1) {
                if (selectedWord.isAcross) {
                    this.arrowRight();
                }
                else {
                    this.arrowDown();
                }
            }
            else {
                if (requiresRender) {
                    this.setTheState();
                }
            }
        }
    }
    getTheState() {
        var crosswordModel = this.props.crosswordModel;
        //given that autoSolve is unrelated to a specific crossword
        if (this.autoSolve) {
            var solvedWords = [];
            var unsolvedWords = [];
            this.props.crosswordModel.words.forEach(word => {
                if (word.solved()) {
                    solvedWords.push(word);
                }
                else {
                    unsolvedWords.push(word);
                }
            });
            unsolvedWords.forEach(word => {
                word.squares.forEach(square => square.autoSolve = false);
            });
            solvedWords.forEach(word => {
                word.squares.forEach(square => square.autoSolve = true);
            });
        }
        else {
            var grid = this.props.crosswordModel.grid;
            grid.forEach(row => {
                row.forEach(square => {
                    square.autoSolve = false;
                });
            });
        }
        return this._mapGrid(this.props.crosswordModel.grid);
    }
    setTheState() {
        this.setState({ squares: this.getTheState() });
    }
    render() {
        //need to recalculate here
        //model.update(autoSolve);
        //map
        //whenever know that have changed SquareProps[][] will have to forceUpdate
        //unless look at prop changes seperately *******************************
        return React.createElement(crossword_1.Crossword, { squares: this.state.squares });
    }
}
exports.CrosswordPuzzle = CrosswordPuzzle;
var alphaKeysUpper = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
var alphaKeysLower = alphaKeysUpper.map(u => u.toLowerCase());
var alphaKeys = alphaKeysUpper.concat(alphaKeysLower);
var alphaMatches = alphaKeys.map(alphaKey => {
    return {
        methodName: "keyGuess",
        keyMatches: [alphaKey]
    };
});
var arrowMatches = [
    {
        methodName: "arrowLeft",
        keyMatches: ["ArrowLeft"]
    },
    {
        methodName: "arrowRight",
        keyMatches: ["ArrowRight"]
    },
    {
        methodName: "arrowDown",
        keyMatches: ["ArrowDown"]
    },
    {
        methodName: "arrowUp",
        keyMatches: ["ArrowUp"]
    }
];
var backspaceMatch = {
    methodName: "backspace",
    keyMatches: ["Backspace"]
};
var keyMatches = arrowMatches.concat(alphaMatches);
keyMatches.push(backspaceMatch);
exports.CrosswordPuzzleKeyEvents = KeyEvents.keyHandler({
    keyEventName: "keydown", keyMatches: keyMatches
})(CrosswordPuzzle);
//# sourceMappingURL=crosswordPuzzle.js.map