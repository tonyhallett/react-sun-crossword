import * as React from "react";
import  Radium  from 'radium'
import { SolvingMode } from '../models/index'
import { SquareLetter, SquareLetterProps } from './squareLetter' 
import { SquareNumber, SquareNumberProps } from './squareNumber'
import { commonColourStyles,BackgroundColorStyle } from './commonColourStyling'


export interface SquareProps { isSelected: boolean, isWordSelected: boolean, solvingMode: SolvingMode,number:string,letter:string,guess:string,identifier:any,  selected: (identifier: any) => any }

@Radium
export class Square extends React.Component<SquareProps, undefined> {
    render() {
        //console.log("**********")
        //console.log(this.props);
        //console.log("**********")
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
        
        var letter = this.props.letter;
        if (this.props.solvingMode !== SolvingMode.Cheating) {
            letter = this.props.guess;
        }

        return <div style={backgroundColorStyle}>
            <SquareLetter letter={letter} />
            <SquareNumber number={this.props.number}/>
        </div>
    }
}

