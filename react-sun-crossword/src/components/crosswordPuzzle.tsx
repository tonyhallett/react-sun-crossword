import * as React from "react";
import { CrosswordModel, Square, IWord } from '../models/index'
import { Crossword } from './crossword'
import { SquareProps } from "./square";
import * as KeyEvents from "../lib/key-handler"

export interface CrosswordPuzzleProps {
    crosswordModel: CrosswordModel
}

export class CrosswordPuzzle extends React.Component<CrosswordPuzzleProps, undefined> {
    _mapGrid(grid: Square[][]):SquareProps[][] {
        var self = this;
        var mappedGrid=grid.map(row => {
            return row.map(square => {
                return { identifier: square, selected: this.squareSelected, isSelected: square.selected, isWordSelected: square.wordSelected, solvingMode: square.solvingMode, number: square.number, letter: square.letter, guess: square.guess }
            });
        })
        return mappedGrid;
    }

    _selectWord(selectedWord: IWord) {
        if (this.props.crosswordModel.selectedWord) {
            this._setWordSquaresSelection(this.props.crosswordModel.selectedWord, false);
        }
        
        this._setWordSquaresSelection(selectedWord, true);
        this.props.crosswordModel.selectedWord = selectedWord;
    }
    _setWordSquaresSelection(word: IWord, select: boolean) {
        word.squares.forEach(square => {
            square.wordSelected = select;
        })
    }
    _selectSquare(square: Square) {
        square.selected = true;
        this.props.crosswordModel.selectedSquare = square;
    }
    //method of square model
    _squareIsStartOfWord(square: Square, across: boolean) {
        var word = across ? square.acrossWord : square.downWord;
        var index = word.squares.indexOf(square);
        return index === 0;
    }
    //this context lost otherwise
    squareSelected = (square: Square) => {
        this.performSelection(square);
    }
    performSelection(square: Square,wordSelectWord=false) {
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
            var wordToSelect: IWord;
            if (square.acrossWord !== null && square.downWord !== null) {
                if (sameSquare) {
                    wordToSelect = this.props.crosswordModel.selectedWord == square.acrossWord ? square.downWord : square.acrossWord;
                    requiresRender = true;
                } else {
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
            } else {
                wordToSelect = square.acrossWord ? square.acrossWord : square.downWord;
            }
            this._selectWord(wordToSelect);



        }
        if (requiresRender) {
            this.forceUpdate();
        }
    }
    navLeft(stopAtWord:boolean=true) {
        var crosswordModel = this.props.crosswordModel
        var selectedSquare = crosswordModel.selectedSquare;
        if (selectedSquare) {
            var grid = crosswordModel.grid
            var numSquaresInRow = grid[0].length;//instead of recalculating - props on the model
            var nextNonBlankSquare: Square;
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
    navRight(stopAtWord:boolean=true) {
        var crosswordModel = this.props.crosswordModel
        var selectedSquare = crosswordModel.selectedSquare;
        if (selectedSquare) {
            var grid = crosswordModel.grid
            var numSquaresInRow = grid[0].length;//instead of recalculating - props on the model
            var nextNonBlankSquare: Square;
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
            this.performSelection(nextNonBlankSquare,true);
        }
    }
    navUp(stopAtWord: boolean = true) {
        var crosswordModel = this.props.crosswordModel
        var selectedSquare = crosswordModel.selectedSquare;
        if (selectedSquare) {
            var grid = crosswordModel.grid
            var numSquaresInColumn = grid.length;//instead of recalculating - props on the model
            var nextNonBlankSquare: Square;
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
            this.performSelection(nextNonBlankSquare,true);
        }
    }
    navDown(stopAtWord: boolean = true) {
        var crosswordModel = this.props.crosswordModel
        var selectedSquare = crosswordModel.selectedSquare;
        if (selectedSquare) {
            var grid = crosswordModel.grid
            var numSquaresInColumn = grid.length;//instead of recalculating - props on the model
            var nextNonBlankSquare: Square;
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
            this.performSelection(nextNonBlankSquare,true);
        }
    }
    arrowDown() {
        this.navDown(false);
    }
    arrowLeft() {
        this.navLeft(false);
    }
    arrowRight() {
        this.navRight(false);
    }
    arrowUp() {
        this.navUp(false);
    }
    render() {
        return <Crossword squares={this._mapGrid(this.props.crosswordModel.grid)} />
    }
    //event, keyValue, keyCode, modifiers
    keyGuess(event,keyValue:string) {
        console.log("Key guess");
        //extract in to a guess
        this.props.crosswordModel.selectedSquare.guess = keyValue.toUpperCase();

        //when add nav will have to consider may render twice
    }

}

var alphaKeysUpper = ["A", "B", "C", "D", "E", "F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
var alphaKeysLower = alphaKeysUpper.map(u => u.toLowerCase());
var alphaKeys = alphaKeysUpper.concat(alphaKeysLower);
var alphaMatches=alphaKeys.map(alphaKey => {
    return {
        methodName: "keyGuess",
        keyMatches: [alphaKey]
    }
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
]
var keyMatches = arrowMatches.concat(alphaMatches);
export var CrosswordPuzzleKeyEvents = KeyEvents.keyHandler({
    keyEventName: "keydown", keyMatches: keyMatches
})(CrosswordPuzzle);

