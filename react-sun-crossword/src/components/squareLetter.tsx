import * as React from "react";



export interface SquareLetterProps { letter: string }

export class SquareLetter extends React.Component<SquareLetterProps, undefined> {
    render() {
        return <span style={{ verticalAlign: "middle", fontSize: "20px", fontWeight: 700, lineHeight:"28px" }}>{this.props.letter}</span>
    }
}

