import * as React from "react";

import { commonColourStyles, BackgroundColorStyle } from './commonStyling'



export interface SolveButtonProps {
    isSolving: boolean,
    clicked:()=>void

}
export class SolveButton extends React.Component<SolveButtonProps, undefined> {
    render() {
        var text = "Solve"
        if (this.props.isSolving) {
            text = "Unsolve";
        }
        //will add styling later
        return <button onClick={() => { this.props.clicked(); }}>{text}</button>
    }
}
