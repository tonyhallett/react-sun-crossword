import * as React from "react";
import { commonColourStyles, BackgroundColorStyle } from './commonStyling'



export interface SquareLetterProps { letter: string ,autoSolvedGuessing:boolean}

export class SquareLetter extends React.Component<SquareLetterProps, undefined> {
    render() {
        var fontColor = this.props.autoSolvedGuessing ? commonColourStyles.letterSolved.backgroundColor : commonColourStyles.letter.backgroundColor;
        return <span style={{color:fontColor, verticalAlign: "middle", fontSize: "20px", fontWeight: 700, lineHeight:"28px" }}>{this.props.letter}</span>
    }
}

