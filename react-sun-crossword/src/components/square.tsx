import * as React from "react";
//import  Radium  =require('radium')
import { SolvingMode } from '../models/index'
import { SquareLetter, SquareLetterProps } from './squareLetter' 
import { SquareNumber, SquareNumberProps } from './squareNumber'
import { commonColourStyles,BackgroundColorStyle } from './commonColourStyling'

export interface SquareProps { selected: (identifier: any) => any, isSelected: boolean, isWordSelected: boolean, solvingMode: SolvingMode, number: string, letter: string, guess: string, identifier: any }


//@Radium
export class Square extends React.Component<SquareProps, undefined> {
    _getBackgroundColorStyle(): BackgroundColorStyle{
        if (this.props.letter === "") {
            return commonColourStyles.blank;
        }
        var solvingMode = this.props.solvingMode;
        var isSelected = this.props.isSelected;
        var isWordSelected = this.props.isWordSelected;
        var backgroundColorStyle: BackgroundColorStyle;
        var propName = "selected";
        if (!isSelected) {
            if (isWordSelected) {
                propName = "wordSelected";
            } else {
                propName = "notSelected";
            }
        }
        var solvingModePropPart: string;

        switch (solvingMode) {
            case SolvingMode.Cheating:
                solvingModePropPart = "Cheating";
                break;
            case SolvingMode.Guessing:
                solvingModePropPart = "Guessing";
                break;
            case SolvingMode.Solving:
                if (this.props.letter === this.props.guess) {
                    solvingModePropPart = "Solved";
                } else {
                    solvingModePropPart = "Unsolved";
                }
                break;
        }
        
        propName = propName + solvingModePropPart;
        
        backgroundColorStyle = commonColourStyles[propName];
        return backgroundColorStyle;
    };
    _getSquareStyle() {
        var baseStyle= {
            width: "32px",
            height: "32px",
            textAlign: "center",
            display: "table-cell",
            margin: 0,
            padding: 0,
            border: "1px",
            position:"relative"
        }
        return Object.assign(baseStyle, this._getBackgroundColorStyle());
    }
    _getSquareLetter(): string{
        var letter = this.props.letter;
        if (this.props.solvingMode !== SolvingMode.Cheating) {
            letter = this.props.guess;
        }
        return letter;
    }
    _raiseSelected=()=> {
        this.props.selected(this.props.identifier)
    }
    render() {
        return <span onClick={this._raiseSelected} style={this._getSquareStyle()}>
            <SquareNumber number={this.props.number} />
            <SquareLetter letter={this._getSquareLetter()} />
            
        </span>
    }
}

