import * as React from "react";
//import  Radium  =require('radium')
import { SolvingMode } from '../models/index'
import { SquareLetter, SquareLetterProps } from './squareLetter' 
import { SquareNumber, SquareNumberProps } from './squareNumber'
import { commonColourStyles,BackgroundColorStyle } from './commonStyling'

export interface SquareProps { selected: (identifier: any) => any, isSelected: boolean, isWordSelected: boolean,autoSolved:boolean, solvingMode: SolvingMode, number: string, letter: string, guess: string, identifier: any }


//@Radium
export class Square extends React.Component<SquareProps, undefined> {
    _getBackgroundColorStyle(): BackgroundColorStyle{
        if (this.props.letter === "") {
            return commonColourStyles.blank;
        }

        var solvingMode = this.props.solvingMode;
        

        var backgroundColorStyle: BackgroundColorStyle;

        var propName = "selected";
        if (!this.props.isSelected) {
            if (this.props.isWordSelected) {
                propName = "wordSelected";
            } else {
                propName = "notSelected";
            }
        }
        var solvingModePropPart: string = "Guessing";
        if (solvingMode !== SolvingMode.Guessing) {
            if (this.props.letter === this.props.guess) {
                solvingModePropPart = "Solved";
            } else {
                solvingModePropPart = "Unsolved";
                if (solvingMode === SolvingMode.Cheating) {
                    solvingModePropPart = "Cheating";
                }
            }
        }

        
        propName = propName + solvingModePropPart;
        
        backgroundColorStyle = commonColourStyles[propName];
        return backgroundColorStyle;
    };

    _getSquareStyle(): React.CSSProperties {
        var style= {
            width: "32px",
            height: "32px",
            textAlign: "center",
            display: "table-cell",
            margin: 0,
            padding: 0,
            border: "1px",
            position: "relative",
            backgroundColor: this._getBackgroundColorStyle().backgroundColor
        }
        return style as React.CSSProperties;
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
    shouldComponentUpdate(nextProps: SquareProps, nextState) {
        var shouldUpdate = false;
        for (var p in nextProps) {
            if (this.props[p] !== nextProps[p]) {
                shouldUpdate = true;
                break;
            }
        }
        return shouldUpdate;
    }
    render() {
        return <span onClick={this._raiseSelected} style={this._getSquareStyle()}>
            <SquareNumber number={this.props.number} />
            <SquareLetter letter={this._getSquareLetter()} autoSolvedGuessing={this.props.solvingMode === SolvingMode.Guessing && this.props.autoSolved}/>
            
        </span>
    }
}

