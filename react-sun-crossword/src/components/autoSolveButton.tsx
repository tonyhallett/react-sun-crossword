import * as React from "react";

import { commonColourStyles, BackgroundColorStyle } from './commonStyling'
export interface AutoSolveProps {
    isAutoSolving: boolean,
    clicked: () => void

}
export class AutoSolveButton extends React.Component<AutoSolveProps, undefined> {
    render() {
        var text = "Auto Solve"
        if (this.props.isAutoSolving) {
            text = "Stop Auto Solving";
        }
        //will add styling later
        return <button onClick={() => { this.props.clicked(); }}>{text}</button>
    }
}
