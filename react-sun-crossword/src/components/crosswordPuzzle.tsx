﻿import * as React from "react";
import { CrosswordModel, Square, IWord, SolvingMode, Word } from '../models/index'
import { Crossword } from './crossword'
import { SquareProps } from "./square";
import * as KeyEvents from "../lib/key-handler"
import { SolveButton } from "./solveButton";
import { GlobalCheatButton } from "./globalCheatButton";
import { AutoSolveButton } from "./autoSolveButton";

export interface CrosswordPuzzleProps {
    crosswordModel: CrosswordModel
}
interface RowColIndices {
    row: number,
    col:number
}
export interface CrosswordPuzzleState {
    squares: SquareProps[][],
}
export class CrosswordPuzzle extends React.Component<CrosswordPuzzleProps, CrosswordPuzzleState> {
    constructor(props: CrosswordPuzzleProps) {
        super(props);
        this.autoSolve = true;
        this.state = { squares: this.getTheState() };

        
    }
    autoSolve: boolean;
    _mapGrid(grid: Square[][]):SquareProps[][] {
        var self = this;
        var mappedGrid=grid.map((row,rowIndex) => {
            return row.map((square, colIndex) => {
                return {
                    identifier: { row: rowIndex, col: colIndex }, autoSolved: square.autoSolved, selected: this.squareSelected, isSelected: square.selected, isWordSelected: square.wordSelected, solvingMode: this.props.crosswordModel.solvingMode, number: square.number, letter: square.letter, guess: square.guess
                }
            });
        })
        return mappedGrid;
    }

    _selectWord(selectedWord: IWord) { //the crosswordModel selectedWord property should deal with it - but interface 
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
    _selectSquare(square: Square) {
        var previousSelectedSquare = this.props.crosswordModel.selectedSquare;
        if (previousSelectedSquare) {
            previousSelectedSquare.selected = false;
        }
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
    squareSelected = (rowColIndices: RowColIndices) => {
        var square=this.props.crosswordModel.grid[rowColIndices.row][rowColIndices.col]
        this.performSelection(square);
    }
    performSelection(square: Square, wordSelectWord = false) {
        
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
            this.setTheState();
        }
    }
    arrowDown() {
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
            this.performSelection(nextNonBlankSquare, true);
        }
    }
    arrowLeft() {
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
    arrowRight() {
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
            this.performSelection(nextNonBlankSquare, true);
        }
    }
    arrowUp() {
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
            this.performSelection(nextNonBlankSquare, true);
        }
    }
    backspace() {
        var selectedSquare = this.props.crosswordModel.selectedSquare
        if (selectedSquare) {
            var requiresRender: boolean;
            if (selectedSquare.guess !== "") {
                selectedSquare.guess = "";
                requiresRender = true;
            }
            var selectedWord = this.props.crosswordModel.selectedWord;
            if (selectedWord.squares.indexOf(selectedSquare) !== 0) {
                if (selectedWord.isAcross) {
                    this.arrowLeft();
                } else {
                    this.arrowUp();
                }
            } else {
                if (requiresRender) {
                    this.setTheState();
                }
            }
        }
        
    }
    keyGuess(event, keyValue: string) {
        var selectedSquare = this.props.crosswordModel.selectedSquare;
        if (selectedSquare) {
            var guess = keyValue.toUpperCase();
            var requiresRender: boolean;
            if (selectedSquare.guess !== guess) {
                selectedSquare.guess = guess;
                requiresRender = true;
            }
            
            var selectedWord = this.props.crosswordModel.selectedWord;
            if (selectedWord.squares.indexOf(selectedSquare) !== selectedWord.squares.length-1) {
                if (selectedWord.isAcross) {
                    this.arrowRight();
                } else {
                    this.arrowDown();
                }
            } else {
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
            var solvedWords: IWord[] = [];
            var unsolvedWords: IWord[] = [];
            this.props.crosswordModel.words.forEach(word => {
                if (word.solved()) {
                    solvedWords.push(word);
                } else {
                    unsolvedWords.push(word);
                }
            });
            unsolvedWords.forEach(word => {
                word.squares.forEach(square => square.autoSolved = false);
            });
            solvedWords.forEach(word => {
                console.log("solved word !");
                word.squares.forEach(square => square.autoSolved = true);
            });
                
        } else {
            var grid = this.props.crosswordModel.grid;
            grid.forEach(row => {
                row.forEach(square => {
                    square.autoSolved = false;
                });
            })
        }
        return this._mapGrid(this.props.crosswordModel.grid);
    }
    setTheState() {
        this.setState({ squares: this.getTheState() })
    }
    solveClicked = ()=>{
        if (this.props.crosswordModel.solvingMode === SolvingMode.Solving) {
            this.props.crosswordModel.solvingMode = SolvingMode.Guessing;
        } else {
            this.props.crosswordModel.solvingMode = SolvingMode.Solving;
        }
        this.setTheState();
    }
    globalCheatClicked = ()=>{
        if (this.props.crosswordModel.solvingMode === SolvingMode.Cheating) {
            this.props.crosswordModel.solvingMode = SolvingMode.Guessing;
        } else {
            this.props.crosswordModel.solvingMode = SolvingMode.Cheating;
        }
        this.setTheState();
    }
    autoSolveClicked = () => {
        this.autoSolve = !this.autoSolve;
        this.setTheState();
    }
    
    render() {
        return <div>
            <Crossword squares={this.state.squares} />
            <SolveButton isSolving={this.props.crosswordModel.solvingMode === SolvingMode.Solving} clicked={this.solveClicked} />
            <GlobalCheatButton isCheating={this.props.crosswordModel.solvingMode === SolvingMode.Cheating} clicked={this.globalCheatClicked} />
            <AutoSolveButton isAutoSolving={this.autoSolve} clicked={this.autoSolveClicked}/> 
        </div>
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
var backspaceMatch = {
    methodName: "backspace",
    keyMatches:["Backspace"]
}
var keyMatches = arrowMatches.concat(alphaMatches);
keyMatches.push(backspaceMatch);
export var CrosswordPuzzleKeyEvents = KeyEvents.keyHandler({
    keyEventName: "keydown", keyMatches: keyMatches
})(CrosswordPuzzle);

