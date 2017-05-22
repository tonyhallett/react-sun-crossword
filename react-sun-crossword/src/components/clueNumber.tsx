import * as React from "react";



export interface ClueNumberProps { number: string }

export class ClueNumber extends React.Component<ClueNumberProps, undefined> {
    render() {
        return <span style={{
           fontSize: "10px", fontWeight:700
        }}>{this.props.number}</span>
    }
}