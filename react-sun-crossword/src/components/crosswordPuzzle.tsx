import * as React from "react";
import { CrosswordModel, Square, IWord } from '../models/index'
import { Crossword } from './crossword'
import { SquareProps } from "./square";
interface CrosswordPuzzleProps {
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
        console
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
    squareSelected=(square: Square)=> {
        
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
                    wordToSelect = square.acrossWord;
                    if (square.number !== "") {
                        if (this._squareIsStartOfWord(square, false)) {
                            if (!this._squareIsStartOfWord(square, true)) {
                                wordToSelect = square.downWord;
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
    
    render() {
        return <Crossword squares={this._mapGrid(this.props.crosswordModel.grid)} />
    }

}