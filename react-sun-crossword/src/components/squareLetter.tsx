import * as React from "react";



export interface SquareLetterProps { letter: string }

export class SquareLetter extends React.Component<SquareLetterProps, undefined> {
    render() {
        return <div>{this.props.letter}</div>
    }
}

