import * as React from "react";
import { SolvingMode } from "../models/index";
import { BackgroundColorStyle, commonColourStyles } from "./commonColourStyling";


export interface ClueLetterProps {
    guess: string,
    letter: string,
    autoSolved: boolean,
    solvingMode: SolvingMode,
    isSolved:boolean

}
export interface FormatWordProps { clueLetters: ClueLetterProps[] ,format:string,isSolved:boolean}


export class FormatWord extends React.Component<FormatWordProps, undefined> {
    render() {
        var clueLetters = this.props.clueLetters;
        var format = this.props.format;
        var parts = format.split(",");
        var formatted: any[] = [];//type ReactInstance = Component<any, any> | Element; - this is not the correct typing ....
        var numParts = parts.length;
        var counter = 0;
        var key = counter;
        for (var i = 0; i < numParts; i++) {
            var part = parts[i];
            var numLettersInPart = parseInt(part);
            for (var j = 0; j < numLettersInPart; j++){
                var clueLetterProps = clueLetters[counter];
                var clueLetter = <ClueLetter key={key} isSolved={clueLetterProps.isSolved} autoSolved={clueLetterProps.autoSolved} guess={clueLetterProps.guess} letter={clueLetterProps.letter} solvingMode={clueLetterProps.solvingMode} />;
                formatted.push(clueLetter);
                counter++;
                key++;
            }
            

            var isLastPart = i == numParts - 1;
            if (!isLastPart) {
                formatted.push(<span style={{paddingRight:'2px'}} key={key}>-</span>);
                key++;
            }
        }
        return <div >{formatted}</div>
    }
}


export class ClueLetter extends React.Component<ClueLetterProps, undefined> {
    render() {
        var solvingMode = this.props.solvingMode;
        var letter = this.props.letter;
        var displayLetter = letter;
        var guess = this.props.guess;
        if (solvingMode !== SolvingMode.Cheating) {
            displayLetter = guess === "" ? "_" : guess;
        }
        var fontColor: string = commonColourStyles.letter.backgroundColor;
        if (solvingMode === SolvingMode.Guessing) {
            
            if (this.props.isSolved && this.props.autoSolved) {
                fontColor = commonColourStyles.autoSolved.backgroundColor;
            } 
        } else {
            if (solvingMode === SolvingMode.Solving) {
                if (!this.props.isSolved && guess === letter) {
                    fontColor = commonColourStyles.autoSolved.backgroundColor;
                }
            }
        }

        return <span style={{color:fontColor,paddingRight:'2px'}}>{displayLetter}</span>
    }
}

