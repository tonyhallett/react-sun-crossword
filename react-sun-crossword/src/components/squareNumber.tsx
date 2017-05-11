import * as React from "react";



export interface SquareNumberProps { number: string }

export class SquareNumber extends React.Component<SquareNumberProps, undefined> {
    render() {
        return <span>{this.props.number}</span>
    }
}
