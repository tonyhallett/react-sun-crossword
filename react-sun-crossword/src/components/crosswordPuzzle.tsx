import * as React from "react";
import { CrosswordModel,Square } from '../models/index'
import { Crossword } from './crossword'
import { SquareProps } from "./square";
interface CrosswordPuzzleProps {
    crosswordModel: CrosswordModel
}
export class CrosswordPuzzle extends React.Component<CrosswordPuzzleProps, undefined> {
    _mapGrid(grid: Square[][]):SquareProps[][] {
        var self = this;
        return grid.map(row => {
            return row.map(square => {
                return { identifier: square, selected: this.squareSelected, isSelected: square.selected, isWordSelected: square.wordSelected, solvingMode: square.solvingMode, number: square.number, letter: square.letter, guess: square.guess }
            });
        })
    }
    squareSelected(square: Square) {
        if (square.letter !== "") {

        }
    }
    render() {
        return <Crossword squares={this._mapGrid(this.props.crosswordModel.grid)} />
    }

}