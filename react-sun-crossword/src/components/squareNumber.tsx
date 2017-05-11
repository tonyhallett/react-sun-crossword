import * as React from "react";



export interface SquareNumberProps { number: string }

export class SquareNumber extends React.Component<SquareNumberProps, undefined> {
    render() {
        return <span style={{
            position: "absolute", left: "2px", top: 0, fontSize: "10px", fontWeight:700
        }}>{this.props.number}</span>
    }
}
